import { StopPoint } from '../../model';
import { getStopLetterAndSize } from './util';
import css from './stopPoint.module.css';
import { JSX } from 'preact';

interface StopLetterProps {
	stopLetter: string;
	scale: number;
	defaultToDot?: true;
}

export function StopLetterRender({
	stopLetter,
	scale,
	defaultToDot,
}: StopLetterProps): JSX.Element {
	const dotChar = '●';

	let stopLetterData = getStopLetterAndSize(stopLetter);

	if (stopLetterData === undefined) {
		if (!defaultToDot) {
			return <></>;
		}

		stopLetterData = {
			stopLetterSize: 'single',
			stopLetter: dotChar,
		};
	}

	return (
		<div style={{ fontSize: `${scale}em` }} class={css.letterWrapper}>
			<div class={css[stopLetterData.stopLetterSize]}>
				{stopLetterData.stopLetter}
			</div>
		</div>
	);
}
