import { type JSX } from 'preact';
import { type StopPoint } from '../../model';
import css from './stopPoint.module.css';
import { getStopCallingBusData, hasBusesInTree } from './util';
import { StopLetterRender } from './StopLetterRender';

interface StopPointTileProps {
	stopPoint: StopPoint;
}

interface StopPointTileWithParentProps extends StopPointTileProps {
	parentName: string;
}

function RailOrMetroOrBusStation({
	stopPoint,
}: StopPointTileProps): JSX.Element {
	const busesFlag =
		stopPoint.stopType !== 'NaptanBusCoachStation' && hasBusesInTree(stopPoint);

	return (
		<div class={css.stopPointTile}>
			<div class={css.titleRow}>
				<h5>{stopPoint.commonName}</h5>
			</div>
			<div
				class={`${css.linesRow} ${stopPoint.stopType !== 'NaptanBusCoachStation' ? css.railLinesRow : ''}`}
			>
				{busesFlag && <span class={css.buses}>Buses</span>}
				{stopPoint.lines.map((l) => (
					<span key={l.id} class={css[l.id]}>
						{l.name}
					</span>
				))}
			</div>
		</div>
	);
}

function MetroPlatformTile({ stopPoint }: StopPointTileProps): JSX.Element {
	return (
		<div class={css.stopPointTile}>
			<div class={css.titleRow}>
				<h5>Metro platform</h5>
			</div>
			<div class={`${css.linesRow} ${css.railLinesRow}`}>
				{stopPoint.lines.map((l) => (
					<span key={l.id} class={css[l.id]}>
						{l.name}
					</span>
				))}
			</div>
		</div>
	);
}

function RailOrMetroAccessAreaTile({
	stopPoint,
}: StopPointTileProps): JSX.Element {
	return (
		<div class={css.stopPointTile}>
			<div class={css.titleRow}>
				<h5>
					{stopPoint.stopType === 'NaptanRailAccessArea'
						? 'Rail access area'
						: 'Metro access area'}
				</h5>
			</div>
			<div class={`${css.linesRow} ${css.railLinesRow}`}>
				{stopPoint.lines.map((l) => (
					<span key={l.id} class={css[l.id]}>
						{l.name}
					</span>
				))}
			</div>
		</div>
	);
}

function RailOrMetroEntranceTile({
	stopPoint,
}: StopPointTileProps): JSX.Element {
	return (
		<div class={css.stopPointTile}>
			<div class={css.titleRow}>
				<h5>
					{stopPoint.stopType === 'NaptanRailEntrance'
						? 'Rail entrance'
						: 'Metro entrance'}
				</h5>
			</div>
			<h6>{stopPoint.indicator}</h6>
		</div>
	);
}

function BusStopPairOrClusterTile({
	stopPoint,
}: StopPointTileProps): JSX.Element {
	const lines = getStopCallingBusData(stopPoint);

	return (
		<div class={`${css.stopPointTile} ${css.busStopTile}`}>
			<div class={css.titleRow}>
				<h5>
					{stopPoint.stopType === 'NaptanOnstreetBusCoachStopCluster'
						? 'Bus Stop Cluster'
						: 'Bus Stop Pair'}
				</h5>
			</div>
			<div class={css.linesRow}>
				{lines.map((l) => (
					<span key={l.number}>{l.number}</span>
				))}
			</div>
		</div>
	);
}

function BusStopPointTile({
	stopPoint,
	parentName,
}: StopPointTileProps & { parentName: string }): JSX.Element {
	const towards = stopPoint.additionalProperties.find(
		(p) => p.key === 'Towards',
	)?.value;

	const lines = getStopCallingBusData(stopPoint);

	return (
		<div class={`${css.stopPointTile} ${css.busStopTile}`}>
			<div class={css.titleRow}>
				<h5>
					Bus stop{' '}
					{stopPoint.commonName !== parentName && <>({stopPoint.commonName})</>}
				</h5>
				<StopLetterRender stopLetter={stopPoint.stopLetter} scale={0.6} />
			</div>
			<div class={css.linesRow}>
				{lines.map((l) => (
					<span key={l.number}>{l.number}</span>
				))}
			</div>

			{towards !== undefined && <p>Towards {towards}</p>}
		</div>
	);
}

export function StopPointTile({
	stopPoint,
	parentName,
}: StopPointTileWithParentProps): JSX.Element {
	switch (stopPoint.stopType) {
		case 'NaptanPublicBusCoachTram':
			return <BusStopPointTile stopPoint={stopPoint} parentName={parentName} />;
		case 'NaptanOnstreetBusCoachStopCluster':
		case 'NaptanOnstreetBusCoachStopPair':
			return <BusStopPairOrClusterTile stopPoint={stopPoint} />;
		case 'NaptanRailEntrance':
		case 'NaptanMetroEntrance':
			return <RailOrMetroEntranceTile stopPoint={stopPoint} />;
		case 'NaptanRailAccessArea':
		case 'NaptanMetroAccessArea':
			return <RailOrMetroAccessAreaTile stopPoint={stopPoint} />;
		case 'NaptanMetroPlatform':
			return <MetroPlatformTile stopPoint={stopPoint} />;
		case 'NaptanRailStation':
		case 'NaptanMetroStation':
		case 'NaptanBusCoachStation':
			return <RailOrMetroOrBusStation stopPoint={stopPoint} />;
		default:
			return (
				<div class={css.stopPointTile}>
					<h5>Other entity:</h5>
					<h5>{stopPoint.stopType}</h5>
				</div>
			);
	}
}
