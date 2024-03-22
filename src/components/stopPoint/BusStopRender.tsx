import { type JSX } from 'preact';
import { type StopPoint } from '../../model';
import css from './stopPoint.module.css';
import {
	getStopCallingBusData,
	getStopLetterAndSize,
	getStopNameLine,
	getStopTowardsLine,
} from './util';
import { useLocation } from 'preact-iso';

interface StopPointProps {
	stopPoint: StopPoint;
	scale: number;
}

export function BusStopRender({
	stopPoint,
	scale,
}: StopPointProps): JSX.Element {
	const towards = stopPoint.additionalProperties.find(
		(p) => p.key === 'Towards',
	)?.value;

	const compassDirection = stopPoint.additionalProperties.find(
		(p) => p.key === 'CompassPoint',
	)?.value;

	const nameLines = getStopNameLine(stopPoint.commonName);
	const towardsLines = getStopTowardsLine(towards);
	const lines = getStopCallingBusData(stopPoint);
	const stopLetterData = getStopLetterAndSize(stopPoint.stopLetter);
	const location = useLocation();

	return (
		<div style={{ fontSize: `${scale}em` }} class={css.busStopRenderWrapper}>
			<div class={css.indicators}>
				{stopLetterData !== undefined && (
					<div class={css.letterWrapper}>
						<div class={css[stopLetterData.stopLetterSize]}>
							{stopLetterData.stopLetter}
						</div>
					</div>
				)}
				{compassDirection !== undefined && (
					<div
						class={`${css.compassWrapper} ${css[`dir${compassDirection.toLocaleLowerCase()}`]}`}
					>
						<div class={css.compass}>➤</div>
					</div>
				)}
			</div>
			<div class={css.stopView}>
				<div class={css.logoPanel}>
					<div class={css.logoTitleBar}>BUS STOP</div>
					<div class={css.logoRoundel} />
				</div>
				<div class={css.namePanel}>
					<div class={css.nameLine}>{nameLines.firstLine}</div>
					{nameLines.secondLine !== undefined && (
						<div class={css.nameLine}>{nameLines.secondLine}</div>
					)}
					{nameLines.smallerLine !== undefined && (
						<div class={css.nameSmallerLine}>{nameLines.smallerLine}</div>
					)}
				</div>
				{towardsLines !== undefined && (
					<div class={css.towardsPanel}>
						{towardsLines.firstLine !== undefined && (
							<div class={css.towardsLine}>{towardsLines.firstLine}</div>
						)}
						{towardsLines.secondLine !== undefined && (
							<div class={css.towardsLine}>{towardsLines.secondLine}</div>
						)}
						{towardsLines.largerLine !== undefined && (
							<div class={css.towardsLargerLine}>{towardsLines.largerLine}</div>
						)}
					</div>
				)}
				<div class={css.eTileGrid}>
					{lines.map((line) => {
						let cssClass: string | undefined;
						let message: string | undefined;

						switch (line.specialStatus) {
							case 'NightBus':
								cssClass = css.nightETile;
								message = 'Night Bus';
								break;
							case 'Superloop':
								cssClass = css.superloopETile;
								message = 'Express';
								break;
						}

						return (
							<a
								onClick={() => {
									location.route(`/line/${line.number}`, true);
								}}
								key={line.number}
							>
								<div class={`${css.eTile} ${cssClass ?? ''}`}>
									<div class={css.eTileMessage}>{message ?? ''}</div>
									<div class={css.eTileNumber}>{line.number}</div>
								</div>
							</a>
						);
					})}
				</div>
				{lines.some((l) => l.specialStatus === 'Superloop') && (
					<div class={css.superloopWrapper}>
						<img src="/sls.svg" />
						<span>SUPERLOOP</span>
					</div>
				)}
			</div>
		</div>
	);
}
