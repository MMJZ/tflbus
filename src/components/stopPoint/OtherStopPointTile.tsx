import { type JSX } from 'preact';
import { StopPointBase } from '../../model';

interface StopPointProps {
	stopPoint: StopPointBase;
}

export function OtherStopPointTile({ stopPoint }: StopPointProps): JSX.Element {

	return (
		<div>
			<p>tile for other thing</p>
			<p>{stopPoint.commonName}</p>
			<p>{stopPoint.stopType}</p>
			<p>{stopPoint.naptanId}</p>
		</div>
	);
}
