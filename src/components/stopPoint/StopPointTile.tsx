import { type JSX } from 'preact';
import { type StopPoint } from '@model';
import css from './stopPoint.module.css';
import { getStopCallingBusData, hasBusesInTree } from './util';
import { StopLetterRender } from '@components';

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
		<div class={css.stopPointTile} aria-label="Stop point details">
			<div class={css.titleRow} aria-label="Stop point name">
				<h4>{stopPoint.commonName}</h4>
			</div>
			<ul
				class={`${css.linesRow} ${stopPoint.stopType !== 'NaptanBusCoachStation' ? css.railLinesRow : ''}`}
			>
				{busesFlag && <li class={css.buses}>Buses</li>}
				{stopPoint.lines.map((l) => (
					<li key={l.id} class={css[l.id]}>
						{l.name}
					</li>
				))}
			</ul>
		</div>
	);
}

function MetroPlatformTile({ stopPoint }: StopPointTileProps): JSX.Element {
	return (
		<div class={css.stopPointTile}>
			<div class={css.titleRow}>
				<h4>Metro platform</h4>
			</div>
			<ul class={`${css.linesRow} ${css.railLinesRow}`}>
				{stopPoint.lines.map((l) => (
					<li key={l.id} class={css[l.id]}>
						{l.name}
					</li>
				))}
			</ul>
		</div>
	);
}

function RailOrMetroAccessAreaTile({
	stopPoint,
}: StopPointTileProps): JSX.Element {
	return (
		<div class={css.stopPointTile} aria-label="Stop point details">
			<div class={css.titleRow} aria-label="Stop point kind">
				<h4>
					{stopPoint.stopType === 'NaptanRailAccessArea'
						? 'Rail access area'
						: 'Metro access area'}
				</h4>
			</div>
			<ul
				class={`${css.linesRow} ${css.railLinesRow}`}
				aria-label="Services serving this stop point"
			>
				{stopPoint.lines.map((l) => (
					<li key={l.id} class={css[l.id]}>
						{l.name}
					</li>
				))}
			</ul>
		</div>
	);
}

function RailOrMetroEntranceTile({
	stopPoint,
}: StopPointTileProps): JSX.Element {
	return (
		<div class={css.stopPointTile} aria-label="Stop point details">
			<div class={css.titleRow} aria-label="Stop point kind">
				<h4>
					{stopPoint.stopType === 'NaptanRailEntrance'
						? 'Rail entrance'
						: 'Metro entrance'}
				</h4>
			</div>
			{stopPoint.indicator !== undefined && <p>{stopPoint.indicator}</p>}
		</div>
	);
}

function BusStopPairOrClusterTile({
	stopPoint,
}: StopPointTileProps): JSX.Element {
	const lines = getStopCallingBusData(stopPoint);

	return (
		<div
			class={`${css.stopPointTile} ${css.busStopTile}`}
			aria-label="Stop point details"
		>
			<div class={css.titleRow} aria-label="Stop point name">
				<h4>
					{stopPoint.stopType === 'NaptanOnstreetBusCoachStopCluster'
						? 'Bus Stop Cluster'
						: 'Bus Stop Pair'}
				</h4>
			</div>
			<ul class={css.linesRow} aria-label="Bus routes serving this stop point">
				{lines.map((l) => (
					<li key={l.number}>{l.number}</li>
				))}
			</ul>
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
		<div
			class={`${css.stopPointTile} ${css.busStopTile}`}
			aria-label="Stop point details"
		>
			<div class={css.titleRow} aria-label="Stop point name">
				<h4>
					Bus stop{' '}
					{stopPoint.commonName !== parentName && <>({stopPoint.commonName})</>}
				</h4>
				<StopLetterRender stopLetter={stopPoint.stopLetter} scale={0.6} />
			</div>
			<ul class={css.linesRow}>
				{lines.map((l) => (
					<li key={l.number}>{l.number}</li>
				))}
			</ul>

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
					<h4>Other entity:</h4>
					<h5>{stopPoint.stopType}</h5>
				</div>
			);
	}
}
