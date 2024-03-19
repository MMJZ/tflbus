import { type JSX } from 'preact';
import {
	StopPointBase,
	type StopPoint,
} from '../../model';
import { BusStopRender } from './BusStopRender';
import css from './stopPoint.module.css';
import { StopPointTile } from './StopPointTile';

interface StopPointProps<T extends StopPointBase> {
	stopPointData: T;
	focussedStopPointPath: string[];
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
			<div class={css.pointWrapper}>
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
								<StopPointTile key={child.naptanId} stopPoint={child} />
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

	if (stopPointData.stopType === 'NaptanPublicBusCoachTram') {
		return <BusStopRender stopPoint={stopPointData} scale={4} />
	}

	return (
		<OtherStopPoint
			stopPointData={stopPointData}
			focussedStopPointPath={focussedStopSubPath}
		/>
	);
}
