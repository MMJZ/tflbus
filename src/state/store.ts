import {
	type Signal,
	signal,
	type ReadonlySignal,
	computed,
	effect,
} from '@preact/signals';
import {
	EnrichedLineData,
	InboundRouteRow,
	LineData,
	LineRoute,
	LineSequenceStopPoint,
	RouteRow,
	StopPointBase,
	type StopPoint,
} from '../model';
import { Patch, applyPatch, getPatch } from 'fast-array-diff';
import { zip } from './util';

const localStopPointCacheKey = 'localStopPointCache';
const localLineCacheKey = 'localLineCache';

export interface AppState {
	stopPointCache: Signal<Map<string, StopPoint>>;
	focussedStopPointId: Signal<string | undefined>;
	focussedStopPoint: ReadonlySignal<StopPoint | undefined>;
	focussedStopPointPath: ReadonlySignal<string[] | undefined>;
	lineCache: Signal<Map<string, LineData>>;
	focussedLineId: Signal<string | undefined>;
	focussedLine: ReadonlySignal<EnrichedLineData | undefined>;
	scrollY: Signal<number>;
}

export function createAppState(): AppState {
	let cachedStopPoints: Map<string, StopPoint>;
	let cachedLines: Map<string, LineData>;
	try {
		cachedStopPoints = new Map(
			JSON.parse(localStorage.getItem(localStopPointCacheKey) ?? '[]') as Array<
				[string, StopPoint]
			>,
		);
		cachedLines = new Map(
			JSON.parse(localStorage.getItem(localLineCacheKey) ?? '[]') as Array<
				[string, LineData]
			>,
		);
	} catch (_: unknown) {
		cachedStopPoints = new Map();
		cachedLines = new Map();
	}

	const stopPointCache = signal(cachedStopPoints);
	const lineCache = signal(cachedLines);
	const focussedStopPointId = signal<string | undefined>(undefined);
	const focussedStopPoint = computed(() =>
		focussedStopPointId.value === undefined
			? undefined
			: stopPointCache.value.get(focussedStopPointId.value),
	);

	effect(() => {
		const focussed = focussedStopPointId.value;
		if (focussed !== undefined && !stopPointCache.value.has(focussed)) {
			fetch(
				`https://api.tfl.gov.uk/StopPoint/${focussed}?includeCrowdingData=false`,
			)
				.then(async (response) => (await response.json()) as StopPoint)
				.then((extraPropsStopPoint) => {
					const stopPoint =
						filterStopPointToKnownProperties(extraPropsStopPoint);

					stopPointCache.value = new Map([
						...stopPointCache.peek(),
						...cacheChildren(stopPoint, stopPoint),
					]);

					try {
						localStorage.setItem(
							localStopPointCacheKey,
							JSON.stringify(Array.from(stopPointCache.peek().entries())),
						);
					} catch (e: unknown) {
						alert(e);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});

	const focussedStopPointPath = computed(() => {
		if (
			focussedStopPointId.value === undefined ||
			focussedStopPoint.value === undefined
		) {
			return undefined;
		}

		return getPathToStop(focussedStopPointId.value, focussedStopPoint.value);
	});

	const scrollY = signal(0);

	const focussedLineId = signal(undefined);

	const focussedLine = computed(() => {
		const data =
			focussedLineId.value === undefined
				? undefined
				: lineCache.value.get(focussedLineId.value);

		if (data === undefined) {
			return undefined;
		}

		if (
			data.inboundRoute.stopPointSequences.length !== 1 ||
			data.outboundRoute.stopPointSequences.length !== 1
		) {
			return undefined; // in short, fuck the b buses and their loopy nonsense, for now at least
		}

		const inboundSequenceStops =
			data.inboundRoute.stopPointSequences[0].stopPoint.slice().reverse();
		const outboundSequenceStops =
			data.outboundRoute.stopPointSequences[0].stopPoint;

		const patches = getPatch(
			outboundSequenceStops,
			inboundSequenceStops,
			(a, b) => a.parentId === b.parentId,
		);

		// const zipped = zip(
		// 	outboundSequenceStops,
		// 	applyPatch(inboundSequenceStops, patches),
		// );

		const { results, outboundPos, inboundPos } = patches.reduce<{
			results: RouteRow[];
			outboundPos: number;
			inboundPos: number;
		}>(
			(acc, patch) => ({
				results: acc.results
					.concat(
						zip(
							outboundSequenceStops.slice(acc.outboundPos, patch.oldPos),
							inboundSequenceStops.slice(acc.inboundPos, patch.newPos),
						).map(([a, b]) => ({
							kind: 'shared',
							outboundName: a.name,
							inboundName: b.name,
							outboundId: a.id,
							inboundId: b.id,
							parentId: a.parentId,
							outboundStopLetter: a.stopLetter,
							inboundStopLetter: b.stopLetter,
						})),
					)
					.concat(
						patch.items.map((item) => ({
							kind: patch.type === 'remove' ? 'outbound' : 'inbound',
							name: item.name,
							id: item.id,
							parentId: item.parentId,
							stopLetter: item.stopLetter,
						})),
					),
				outboundPos:
					patch.oldPos + (patch.type === 'remove' ? patch.items.length : 0),
				inboundPos:
					patch.newPos + (patch.type === 'add' ? patch.items.length : 0),
			}),
			{ results: [], outboundPos: 0, inboundPos: 0 },
		);

		const fullResults = results.concat(
			zip(
				outboundSequenceStops.slice(outboundPos, outboundSequenceStops.length),
				inboundSequenceStops.slice(inboundPos, inboundSequenceStops.length),
			).map(([a, b]) => ({
				kind: 'shared',
				outboundName: a.name,
				inboundName: b.name,
				outboundId: a.id,
				inboundId: b.id,
				parentId: a.parentId,
				outboundStopLetter: a.stopLetter,
				inboundStopLetter: b.stopLetter,
			})),
		);

		return {
			...data,
			patch: patches,
			routeRows: fullResults,
		};
	});

	effect(() => {
		const focussed = focussedLineId.value;
		if (focussed !== undefined && !lineCache.value.has(focussed)) {
			fetch(`https://api.tfl.gov.uk/Line/${focussed}/Route/Sequence/Outbound`)
				.then(async (response) => (await response.json()) as LineRoute)
				.then((extraPropsOutboundRoute) => {
					const outboundRoute = filterLineRouteToKnownProperties(
						extraPropsOutboundRoute,
					);
					fetch(
						`https://api.tfl.gov.uk/Line/${focussed}/Route/Sequence/Inbound`,
					)
						.then(async (response) => (await response.json()) as LineRoute)
						.then((extraPropsInboundRoute) => {
							const inboundRoute = filterLineRouteToKnownProperties(
								extraPropsInboundRoute,
							);

							lineCache.value = new Map([
								...lineCache.peek(),
								[focussed, { inboundRoute, outboundRoute }],
							]);

							try {
								localStorage.setItem(
									localLineCacheKey,
									JSON.stringify(Array.from(lineCache.peek().entries())),
								);
							} catch (e: unknown) {
								alert(e);
							}
						})
						.catch((err) => {
							console.log(err);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});

	return {
		stopPointCache,
		focussedStopPointId,
		focussedStopPoint,
		focussedStopPointPath,
		scrollY,
		lineCache,
		focussedLineId,
		focussedLine,
	};
}

function getPathToStop(target: string, node: StopPoint): string[] | undefined {
	if (target === node.naptanId) {
		return [node.naptanId];
	}
	for (const child of node.children) {
		const path = getPathToStop(target, child);
		if (path !== undefined) {
			return [node.naptanId, ...path];
		}
	}
	return undefined;
}

function cacheChildren(
	root: StopPoint,
	stopPoint: StopPoint,
): Array<[string, StopPoint]> {
	return stopPoint.children
		.map((child: StopPoint) => cacheChildren(root, child))
		.flat(1)
		.concat([[stopPoint.naptanId, root]]);
}

function filterStopPointToKnownProperties(
	extraPropsStopPoint: StopPoint,
): StopPoint {
	return {
		naptanId: extraPropsStopPoint.naptanId,
		stopLetter: extraPropsStopPoint.stopLetter,
		modes: extraPropsStopPoint.modes,
		commonName: extraPropsStopPoint.commonName,
		lat: extraPropsStopPoint.lat,
		lon: extraPropsStopPoint.lon,
		smsCode: extraPropsStopPoint.smsCode,
		additionalProperties: extraPropsStopPoint.additionalProperties.map((p) => ({
			key: p.key,
			value: p.value,
		})),
		lines: extraPropsStopPoint.lines.map((l) => ({ name: l.name, id: l.id })),
		stopType: extraPropsStopPoint.stopType,
		children: extraPropsStopPoint.children.map(
			filterStopPointToKnownProperties,
		),
	} as StopPoint;
}

function filterLineRouteToKnownProperties(
	extraPropsLineRoute: LineRoute,
): LineRoute {
	return {
		lineName: extraPropsLineRoute.lineName,
		lineId: extraPropsLineRoute.lineId,
		direction: extraPropsLineRoute.direction,
		stopPointSequences: extraPropsLineRoute.stopPointSequences.map(
			(sequence) => ({
				branchId: sequence.branchId,
				nextBranchIds: sequence.nextBranchIds,
				prevBranchIds: sequence.prevBranchIds,
				stopPoint: sequence.stopPoint.map((stopPoint) => ({
					name: stopPoint.name,
					id: stopPoint.id,
					parentId: stopPoint.parentId,
					topMostParentId: stopPoint.topMostParentId,
					stopLetter: stopPoint.stopLetter,
					towards: stopPoint.towards,
					lines: stopPoint.lines.map((line) => ({
						name: line.name,
					})),
				})),
			}),
		),
	};
}
