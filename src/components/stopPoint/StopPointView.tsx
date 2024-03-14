import { type JSX } from 'preact';
import { type StopPoint } from '../../model';
import { BusStopPoint } from './BusStopPoint';

interface StopPointProps {
	stopPoint: StopPoint;
}

function BusClusterStopPoint({ stopPoint }: StopPointProps): JSX.Element {
	if (stopPoint.stopType !== 'NaptanOnstreetBusCoachStopCluster') {
		return <>fuck!</>;
	}

	return (
		<>
			<p>This is a bus stop cluster</p>
			<h3>{stopPoint.commonName}</h3>
			<h6>{stopPoint.naptanId}</h6>
			{stopPoint.children.map((child) => (
				<StopPointView key={child.naptanId} stopPoint={child} />
			))}
		</>
	);
}

function BusPairStopPoint({ stopPoint }: StopPointProps): JSX.Element {
	if (stopPoint.stopType !== 'NaptanOnstreetBusCoachStopPair') {
		return <>fuck!</>;
	}

	return (
		<>
			<p>This is a bus stop pair</p>
			<h3>{stopPoint.commonName}</h3>
			<h6>{stopPoint.naptanId}</h6>
			{stopPoint.children.map((child) => (
				<StopPointView key={child.naptanId} stopPoint={child} />
			))}
		</>
	);
}

export function StopPointView({ stopPoint }: StopPointProps): JSX.Element {
	switch (stopPoint.stopType) {
		case 'NaptanOnstreetBusCoachStopPair':
			return <BusPairStopPoint stopPoint={stopPoint} />;
			case 'NaptanOnstreetBusCoachStopCluster':
				return <BusClusterStopPoint stopPoint={stopPoint} />;
		case 'NaptanPublicBusCoachTram':
			return <BusStopPoint stopPoint={stopPoint} scale={5} />;
		default:
			return <>not done yet</>;
	}
}
