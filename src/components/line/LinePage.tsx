import { type JSX } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import { StateContext } from '../../context';
import css from './line.module.css';
import { useLocation, useRoute } from 'preact-iso';
import { Loading } from '../loading/Loading';
import { StopLetterRender } from '../stopPoint/StopLetterRender';

export function LinePage(): JSX.Element {
	const _state = useContext(StateContext);
	if (_state === undefined) {
		throw new Error('No state context available');
	}
	const state = _state;
	const route = useRoute();
	const location = useLocation();

	useEffect(() => {
		const id = route.params.id;
		if (id !== undefined) {
			state.focussedLineId.value = id;
			state.focussedStopPointId.value = undefined;
		}
	}, [route, state.focussedLineId, state.focussedStopPointId]);

	const line = state.focussedLine.value;

	if (line === undefined) {
		return <Loading />;
	}

	// https://nominatim.openstreetmap.org/reverse?lat=51.452405&lon=0.128079&format=jsonv2&zoom=12

	return (
		<div class={css.wrapper}>
			<div class={css.titleBar}>
				<h2>{line.lineName}</h2>
			</div>
			{line.hasHiddenBranches && (
				<div class={css.hiddenWarning}>
					<span>
						This line has multiple branches. Some stops on some branches will be
						missing.
					</span>
				</div>
			)}
			<div class={css.routeGrid}>
				<div class={css.rounderRow}>
					<div class={css.firstCorner} />
					<div class={css.secondCorner} />
					<span />
				</div>
				{line.routeRows.map((row) => (
					<div key={row.parentId} class={css.mainRow}>
						{row.kind === 'inbound' ? (
							<>
								<div class={css.withLetter}>
									<a
										onClick={() => {
											location.route(`/stopPoint/${row.id}`, true);
										}}
									>
										<StopLetterRender
											stopLetter={row.stopLetter}
											scale={0.7}
											defaultToDot
										/>
									</a>
								</div>
								<div class={css.noStop} />
								<div class={css.name}>
									<a
										class={row.parentId === undefined ? css.noLink : ''}
										onClick={() => {
											if (row.parentId !== undefined) {
												location.route(`/stopPoint/${row.parentId}`, true);
											}
										}}
									>
										{row.name}
									</a>
								</div>
							</>
						) : row.kind === 'outbound' ? (
							<>
								<div class={css.noStop} />
								<div class={css.withLetter}>
									<a
										onClick={() => {
											location.route(`/stopPoint/${row.id}`, true);
										}}
									>
										<StopLetterRender
											stopLetter={row.stopLetter}
											scale={0.7}
											defaultToDot
										/>
									</a>
								</div>
								<div class={css.name}>
									<a
										class={row.parentId === undefined ? css.noLink : ''}
										onClick={() => {
											if (row.parentId !== undefined) {
												location.route(`/stopPoint/${row.parentId}`, true);
											}
										}}
									>
										{row.name}
									</a>
								</div>
							</>
						) : (
							<>
								<div class={css.withLetter}>
									<a
										onClick={() => {
											location.route(`/stopPoint/${row.inboundId}`, true);
										}}
									>
										<StopLetterRender
											stopLetter={row.inboundStopLetter}
											scale={0.7}
											defaultToDot
										/>
									</a>
								</div>
								<div class={css.withLetter}>
									<a
										onClick={() => {
											location.route(`/stopPoint/${row.outboundId}`, true);
										}}
									>
										<StopLetterRender
											stopLetter={row.outboundStopLetter}
											scale={0.7}
											defaultToDot
										/>
									</a>
								</div>
								<div class={css.name}>
									<a
										class={row.parentId === undefined ? css.noLink : ''}
										onClick={() => {
											if (row.parentId !== undefined) {
												location.route(`/stopPoint/${row.parentId}`, true);
											}
										}}
									>
										{row.inboundName}
									</a>
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
