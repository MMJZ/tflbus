import { type JSX } from 'preact';
import { type StopType, type StopPoint } from '../../model';
import { BusStopRender } from './BusStopRender';
import css from './stopPoint.module.css';
import { StopPointTile } from './StopPointTile';
import { getStopTypeName, separateBy } from './util';

interface StopPointProps {
	stopPointData: StopPoint;
	focussedStopPointPath: string[];
}

const selectableChildrenTypes: StopType[] = [
	'TransportInterchange',
	'NaptanRailStation',
	'NaptanMetroStation',
	'NaptanBusCoachStation',
	'NaptanOnstreetBusCoachStopCluster',
	'NaptanOnstreetBusCoachStopPair',
	'NaptanPublicBusCoachTram',
];

function OtherStopPoint({
	stopPointData,
	focussedStopPointPath,
}: StopPointProps): JSX.Element {
	const focussedStopData =
		focussedStopPointPath[0] !== undefined
			? stopPointData.children.find(
					(child) => child.naptanId === focussedStopPointPath[0],
				)
			: undefined;

	const [selectableChildren, otherChildren] = separateBy(
		stopPointData.children,
		(c) => selectableChildrenTypes.includes(c.stopType),
	);

	const zone = stopPointData.additionalProperties.find(
		(a) => a.key === 'Zone',
	)?.value;

	return (
		<>
			<div class={css.pointWrapper}>
				<div class={css.pointHeader}>
					<h4>{stopPointData.commonName}</h4>
					<div>
						<h5>{getStopTypeName(stopPointData.stopType)}</h5>
						{zone !== undefined && <div class={css.zone}>Zone {zone}</div>}
						<h6>{stopPointData.naptanId}</h6>
					</div>
				</div>
				{otherChildren.length > 0 && <h5>Parts of this stop point:</h5>}
				<div class={css.detailsRow}>
					{otherChildren.map((child) => (
						<StopPointTile
							key={child.naptanId}
							stopPoint={child}
							parentName={stopPointData.commonName}
						/>
					))}
				</div>
				{selectableChildren.length > 0 && <h5>Nested stop points:</h5>}
				<div class={css.tileRow}>
					{selectableChildren.map((child) => (
						<a
							href={`/stopPoint/${focussedStopData?.naptanId === child.naptanId ? stopPointData.naptanId : child.naptanId}`}
							key={child.naptanId}
						>
							<div
								class={`${css.tileWrapper} ${focussedStopPointPath[0] === child.naptanId ? css.selectedTile : ''}`}
								style={{
									borderBottom:
										focussedStopData === undefined ? undefined : 'none',
									borderRadius:
										focussedStopData === undefined ? '4px' : '4px 4px 0 0',
								}}
							>
								<StopPointTile
									stopPoint={child}
									parentName={stopPointData.commonName}
								/>
							</div>
						</a>
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
}: StopPointProps): JSX.Element {
	if (focussedStopPointPath[0] !== stopPointData.naptanId) {
		alert('path is incorrect!');
	}

	const focussedStopSubPath = focussedStopPointPath.slice(1);

	if (stopPointData.stopType === 'NaptanPublicBusCoachTram') {
		return <BusStopRender stopPoint={stopPointData} scale={4} />;
	}

	return (
		<OtherStopPoint
			stopPointData={stopPointData}
			focussedStopPointPath={focussedStopSubPath}
		/>
	);
}
