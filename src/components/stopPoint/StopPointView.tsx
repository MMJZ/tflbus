import { type JSX } from 'preact';
import {
	BusStop,
	BusStopCluster,
	BusStopGroup,
	BusStopPair,
	GeneralStopPoint,
	StopPointBase,
	type StopPoint,
} from '../../model';
import { BusStopPointTile } from './BusStopPointTile';
import { BusStopRender } from './BusStopRender';
import css from './stopPoint.module.css';
import { OtherStopPointTile } from './OtherStopPointTile';

interface StopPointProps<T extends StopPointBase> {
	stopPointData: T;
	focussedStopPointPath: string[];
}

function BusPairOrClusterStopPoint({
	stopPointData,
	focussedStopPointPath,
}: StopPointProps<BusStopGroup>): JSX.Element {
	const focussedStopData =
		focussedStopPointPath[0] !== undefined
			? stopPointData.children.find(
					(child) => child.naptanId === focussedStopPointPath[0],
				)
			: undefined;

	return (
		<>
			<div class={css.pairWrapper}>
				<div class={css.pairHeader}>
					<h5>
						Bus Stop{' '}
						{stopPointData.stopType === 'NaptanOnstreetBusCoachStopPair'
							? 'Pair'
							: 'Cluster'}
					</h5>
					<h4>{stopPointData.commonName}</h4>
					<h6>{stopPointData.naptanId}</h6>
				</div>
				<div class={css.tileRow}>
					{stopPointData.children.map((child) => (
						<div
							class={`${css.tileWrapper} ${focussedStopPointPath[0] === child.naptanId ? css.selectedTile : ''}`}
						>
							<a href={`/stopPoint/${child.naptanId}`}>
								<BusStopPointTile key={child.naptanId} stopPoint={child} />
							</a>
						</div>
					))}
				</div>
			</div>
			{focussedStopData !== undefined && (
				<BusStopRender stopPoint={focussedStopData} scale={4} />
			)}
		</>
	);
}

function OtherStopPoint({
	stopPointData,
	focussedStopPointPath,
}: StopPointProps<StopPoint>): JSX.Element {
	const focussedStopData =
		focussedStopPointPath[0] !== undefined
			? stopPointData.children.find(
					(child) => child.naptanId === focussedStopPointPath[0],
				)
			: undefined;

	return (
		<>
			<div class={css.pairWrapper}>
				<div class={css.pairHeader}>
					<h5>{stopPointData.stopType}</h5>
					<h4>{stopPointData.commonName}</h4>
					<h6>{stopPointData.naptanId}</h6>
				</div>
				<div class={css.tileRow}>
					{stopPointData.children.map((child) => (
						<div
							class={`${css.tileWrapper} ${focussedStopPointPath[0] === child.naptanId ? css.selectedTile : ''}`}
						>
							<a href={`/stopPoint/${child.naptanId}`}>
								<OtherStopPointTile key={child.naptanId} stopPoint={child} />
							</a>
						</div>
					))}
				</div>
			</div>
			{focussedStopData !== undefined && (
				<StopPointView
					stopPointData={focussedStopData}
					focussedStopPointPath={focussedStopPointPath}
				/>
			)}
		</>
	);
}

export function StopPointView({
	stopPointData,
	focussedStopPointPath,
}: StopPointProps<StopPoint>): JSX.Element {
	if (focussedStopPointPath[0] !== stopPointData.naptanId) {
		alert('path is incorrect!');
	}

	const focussedStopSubPath = focussedStopPointPath.slice(1);

	switch (stopPointData.stopType) {
		case 'NaptanOnstreetBusCoachStopPair':
		case 'NaptanOnstreetBusCoachStopCluster':
		case 'NaptanBusCoachStation':
			return (
				<BusPairOrClusterStopPoint
					stopPointData={stopPointData}
					focussedStopPointPath={focussedStopSubPath}
				/>
			);
		case 'NaptanPublicBusCoachTram':
			return <>serious error - not expecting bus stop as root</>;
		default:
			return (
				<OtherStopPoint
					stopPointData={stopPointData}
					focussedStopPointPath={focussedStopSubPath}
				/>
			);
	}
}
