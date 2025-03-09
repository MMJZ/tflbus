import { type JSX } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import { StateContext } from '@state';
import css from './line.module.css';
import { useRoute } from 'preact-iso';
import { Link, Loading, StopLetterRender } from '@components';

export function LinePage(): JSX.Element {
	const _state = useContext(StateContext);
	if (_state === undefined) {
		throw new Error('No state context available');
	}
	const state = _state;
	const route = useRoute();

	useEffect(() => {
		const id = 'id' in route.params ? route.params.id : undefined;
		if (id !== undefined) {
			state.focussedLineId.value = id;
			state.focussedStopPointId.value = undefined;
		}
	}, [route, state.focussedLineId, state.focussedStopPointId]);

	const line = state.focussedLine.value;

	useEffect(() => {
		document.title =
			line === undefined
				? `Loading route ${state.focussedLineId.peek() ?? ''} — BusMupper`
				: `Route ${line.lineName} — BusMupper`;
	}, [line, state]);

	if (line === undefined) {
		return <Loading />;
	}

	// https://nominatim.openstreetmap.org/reverse?lat=51.452405&lon=0.128079&format=jsonv2&zoom=12

	return (
		<div class={css.wrapper}>
			<div class={css.titleBar}>
				<h2 aria-label={`Bus route ${line.lineName}`}>{line.lineName}</h2>
			</div>
			{line.hasHiddenBranches && (
				<div class={css.hiddenWarning}>
					<span>
						This line has multiple branches. Some stops on some branches will be
						missing.
					</span>
				</div>
			)}

			{/* <div>
				MISSING
				<br />
				{line.missingStops.map(([o, i]) => <div key={o?.id ?? i?.id}>{o?.id ?? 'X'} | {i?.id ?? 'X'} | {o?.name ?? i?.name}</div>)}
				MISSING
			</div> */}

			<div class={css.routeGrid}>
				<div class={css.rounderRow}>
					<div class={css.firstCorner} />
					<div class={css.secondCorner} />
					<span />
				</div>
				{line.routeRows.map((row) => (
					<div
						key={row.parentId}
						class={css.mainRow}
						aria-label={`Stop group ${row.kind === 'shared' ? row.inboundName : row.name}`}
					>
						{row.kind === 'inbound' ? (
							<>
								<div class={css.withLetter}>
									<Link
										route={`/stopPoint/${row.id}`}
										ariaLabel={`Inbound stop point ${row.name}`}
									>
										<StopLetterRender
											stopLetter={row.stopLetter}
											scale={0.7}
											defaultToDot
										/>
									</Link>
								</div>
								<div class={css.noStop} />
								<div class={css.name}>
									{row.parentId === undefined ? (
										<span class={css.noLink}>{row.name}</span>
									) : (
										<Link route={`/stopPoint/${row.parentId}`}>{row.name}</Link>
									)}
								</div>
							</>
						) : row.kind === 'outbound' ? (
							<>
								<div class={css.noStop} />
								<div class={css.withLetter}>
									<Link
										route={`/stopPoint/${row.id}`}
										ariaLabel={`Outbound stop point ${row.name}`}
									>
										<StopLetterRender
											stopLetter={row.stopLetter}
											scale={0.7}
											defaultToDot
										/>
									</Link>
								</div>
								<div class={css.name}>
									{row.parentId === undefined ? (
										<span class={css.noLink}>{row.name}</span>
									) : (
										<Link route={`/stopPoint/${row.parentId}`}>{row.name}</Link>
									)}
								</div>
							</>
						) : (
							<>
								<div class={css.withLetter}>
									<Link
										route={`/stopPoint/${row.inboundId}`}
										ariaLabel={`Inbound stop point ${row.inboundName}`}
									>
										<StopLetterRender
											stopLetter={row.inboundStopLetter}
											scale={0.7}
											defaultToDot
										/>
									</Link>
								</div>
								<div class={css.withLetter}>
									<Link
										route={`/stopPoint/${row.outboundId}`}
										ariaLabel={`Outbound stop point ${row.outboundName}`}
									>
										<StopLetterRender
											stopLetter={row.outboundStopLetter}
											scale={0.7}
											defaultToDot
										/>
									</Link>
								</div>
								<div class={css.name}>
									{row.parentId === undefined ? (
										<span class={css.noLink}>{row.inboundName}</span>
									) : (
										<Link
											route={`/stopPoint/${row.parentId}`}
											ariaLabel={`Stop group ${row.inboundName}`}
										>
											{row.inboundName}
										</Link>
									)}
								</div>
							</>
						)}
					</div>
				))}
				<div class={css.rounderRow}>
					<div class={css.thirdCorner} />
					<div class={css.fourthCorner} />
					<span />
				</div>
			</div>
		</div>
	);
}
