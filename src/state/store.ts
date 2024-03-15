import {
	type Signal,
	signal,
	type ReadonlySignal,
	computed,
	effect,
} from '@preact/signals';
import { type StopPoint } from '../model';

const localStopPointCacheKey = 'localStopPointCache';

export interface AppState {
	stopPointCache: Signal<Map<string, StopPoint>>;
	focussedStopPointId: Signal<string | undefined>;
	focussedStopPoint: ReadonlySignal<StopPoint | undefined>;
}

export function createAppState(): AppState {
	let cached: Map<string, StopPoint>;
	try {
		cached = new Map(
			JSON.parse(localStorage.getItem(localStopPointCacheKey) ?? '[]') as Array<
				[string, StopPoint]
			>,
		);
	} catch (_: unknown) {
		cached = new Map();
	}

	const stopPointCache = signal(cached);
	const focussedStopPointId = signal<string | undefined>(undefined);
	const focussedStopPoint = computed(() =>
		focussedStopPointId.value === undefined
			? undefined
			: stopPointCache.value.get(focussedStopPointId.value),
	);

	effect(() => {
		const focussed = focussedStopPointId.value;
		if (focussed !== undefined && !stopPointCache.peek().has(focussed)) {
			fetch(
				`https://api.tfl.gov.uk/StopPoint/${focussed}?includeCrowdingData=false`,
			)
				.then(async (response) => (await response.json()) as StopPoint)
				.then((stopPoint) => {
					stopPointCache.value = new Map([
						...stopPointCache.peek(),
						...cacheChildren(stopPoint),
					]);

					localStorage.setItem(
						localStopPointCacheKey,
						JSON.stringify(Array.from(stopPointCache.peek().entries())),
					);
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
	};
}

function cacheChildren(stopPoint: StopPoint): Array<[string, StopPoint]> {
	return stopPoint.children
		.flatMap(cacheChildren)
		.concat([stopPoint.naptanId, stopPoint]);
}
