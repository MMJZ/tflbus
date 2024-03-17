import { type JSX } from 'preact';
import { BusStop, type StopPoint } from '../../model';
import { BusStopRender } from './BusStopRender';

interface StopPointProps {
	stopPoint: BusStop;
}

export function BusStopPointTile({ stopPoint }: StopPointProps): JSX.Element {

	return (
		<div>
			<p>tile</p>
			<BusStopRender stopPoint={stopPoint} scale={1} />
		</div>
	);
}
