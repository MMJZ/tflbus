import { type JSX } from 'preact';
import { type StopPoint } from '@model';
import css from './stopPoint.module.css';
import {
	getStopCallingBusData,
	getStopLetterAndSize,
	getStopNameLine,
	getStopTowardsLine,
} from './util';
import { Link } from '@components';

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

	return (
		<div
			style={{ fontSize: `${String(scale)}em` }}
			class={css.busStopRenderWrapper}
			aria-label={`Render of bus stop ${stopPoint.commonName}`}
		>
			<div class={css.indicators}>
				{stopLetterData !== undefined && (
					<div class={css.letterWrapper}>
						<div
							class={css[stopLetterData.stopLetterSize]}
							aria-label="Stop letter"
						>
							{stopLetterData.stopLetter}
						</div>
					</div>
				)}
				{compassDirection !== undefined && (
					<div
						class={`${css.compassWrapper} ${css[`dir${compassDirection.toLocaleLowerCase()}`]}`}
						aria-label={`Stop compass direction is ${compassDirection}`}
					>
						<div aria-hidden class={css.compass}>
							➤
						</div>
					</div>
				)}
			</div>
			<div class={css.stopView}>
				<div class={css.logoPanel} aria-hidden>
					<div class={css.logoTitleBar}>BUS STOP</div>
					<div class={css.logoRoundel} />
				</div>
				<div class={css.namePanel} aria-label="Stop name">
					<div class={css.nameLine}>{nameLines.firstLine}</div>
					{nameLines.secondLine !== undefined && (
						<div class={css.nameLine}>{nameLines.secondLine}</div>
					)}
					{nameLines.smallerLine !== undefined && (
						<div class={css.nameSmallerLine}>{nameLines.smallerLine}</div>
					)}
				</div>
				{towardsLines !== undefined && (
					<div class={css.towardsPanel} aria-label="Stop 'towards' details">
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
				<div class={css.eTileGrid} aria-label="Buses serving this stop">
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
							<Link
								route={`/line/${line.number}`}
								key={line.number}
								ariaLabel={`Line page for bus ${line.number}`}
							>
								<div class={`${css.eTile} ${cssClass ?? ''}`}>
									<div class={css.eTileMessage}>{message ?? ''}</div>
									<div class={css.eTileNumber}>{line.number}</div>
								</div>
							</Link>
						);
					})}
				</div>
				{lines.some((l) => l.specialStatus === 'Superloop') && (
					<div class={css.superloopWrapper}>
						<img src="/sls.svg" alt="SuperLoop logo" />
						<span>SUPERLOOP</span>
					</div>
				)}
			</div>
		</div>
	);
}
