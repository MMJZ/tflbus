import { type JSX } from 'preact';
import { StopPointBase } from '../../model';
import css from './stopPoint.module.css';
import { getStopTypeName } from './util';

interface StopPointProps {
	stopPoint: StopPointBase;
}

export function StopPointTile({ stopPoint }: StopPointProps): JSX.Element {

	return (
		<div class={css.stopPointTile}>
			<h5>{getStopTypeName(stopPoint.stopType)}</h5>
			<h3>{stopPoint.commonName}</h3>
			{/* <h6>{stopPoint.naptanId}</h6> */}
		</div>
	);
}
