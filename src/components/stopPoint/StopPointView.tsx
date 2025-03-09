import { type JSX } from 'preact';
import { type StopType, type StopPoint } from '@model';
import css from './stopPoint.module.css';
import { getStopTypeName, separateBy } from './util';
import { BusStopRender, Link, StopPointTile } from '@components';

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
		focussedStopPointPath.length >= 0
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
					<h2 aria-label={`Stop point ${stopPointData.commonName}`}>
						{stopPointData.commonName}
					</h2>
					<div>
						<span class={css.stopType} aria-label="Stop point type">
							{getStopTypeName(stopPointData.stopType)}
						</span>
						{zone !== undefined && (
							<span aria-label="Stop point fare zone" class={css.zone}>
								Zone {zone}
							</span>
						)}
						<span class={css.stopId} aria-label="Stop point NAPTAN ID">
							{stopPointData.naptanId}
						</span>
					</div>
				</div>
				{otherChildren.length > 0 && <h3>Parts of this stop point:</h3>}
				<div class={css.detailsRow}>
					{otherChildren.map((child) => (
						<StopPointTile
							key={child.naptanId}
							stopPoint={child}
							parentName={stopPointData.commonName}
						/>
					))}
				</div>
				{selectableChildren.length > 0 && <h3>Nested stop points:</h3>}
				<div class={css.tileRow}>
					{selectableChildren.map((child) => (
						<Link
							route={`/stopPoint/${focussedStopData?.naptanId === child.naptanId ? stopPointData.naptanId : child.naptanId}`}
							key={child.naptanId}
							ariaLabel={`Go to nested stop point ${child.commonName} or view details in link content`}
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
						</Link>
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
