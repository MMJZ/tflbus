import { type JSX } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { StateContext } from '../../context';
import { type AppState } from '../../state/store';
import css from './line.module.css';
import {
	type SearchResult,
	type StopPoint,
	type QueryResult,
} from '../../model';
import { useRoute } from 'preact-iso';

const dotChar = '●';

export function LinePage(): JSX.Element {
	const _state = useContext(StateContext);
	if (_state === undefined) {
		throw new Error('fucked it bro');
	}
	const state = _state;
	const route = useRoute();

	useEffect(() => {
		const id = route.params.id;
		if (id !== undefined) {
			state.focussedLineId.value = id;
		}
	}, [route, state.focussedLineId]);

	const line = state.focussedLine.value;

	if (line === undefined) {
		return <>loading</>;
	}

	return (
		<div class={css.wrapper}>
			<div class={css.titleBar}>
				<h2>{line.outboundRoute.lineName}</h2>
			</div>
			<div class={css.routeGrid}>
				<div class={css.rounderRow}>
					<div class={css.firstCorner}></div>
					<div class={css.secondCorner}></div>
					<span></span>
				</div>
				{line.routeRows.map((row) => (
					<div key={row.parentId} class={css.mainRow}>
						{row.kind === 'inbound' ? (
							<>
								<div class={css.withLetter}>
									<a href={`/stopPoint/${row.id}`}>
										<div class={css.letterWrapper}>
											<span>{row.stopLetter ?? dotChar}</span>
										</div>
									</a>
								</div>
								<div class={css.noStop}></div>
								<div class={css.name}>
									<a href={`/stopPoint/${row.parentId}`}>{row.name}</a>
								</div>
							</>
						) : row.kind === 'outbound' ? (
							<>
								<div class={css.noStop}></div>
								<div class={css.withLetter}>
									<a href={`/stopPoint/${row.id}`}>
										<div class={css.letterWrapper}>
											<span>{row.stopLetter ?? dotChar}</span>
										</div>
									</a>
								</div>
								<div class={css.name}>
									<a href={`/stopPoint/${row.parentId}`}>{row.name}</a>
								</div>
							</>
						) : (
							<>
								<div class={css.withLetter}>
									<a href={`/stopPoint/${row.inboundId}`}>
										<div class={css.letterWrapper}>
											<span>{row.inboundStopLetter ?? dotChar}</span>
										</div>
									</a>
								</div>
								<div class={css.withLetter}>
									<a href={`/stopPoint/${row.outboundId}`}>
										<div class={css.letterWrapper}>
											<span>{row.outboundStopLetter ?? dotChar}</span>
										</div>
									</a>
								</div>
								<div class={css.name}>
									<a href={`/stopPoint/${row.parentId}`}>{row.inboundName}</a>
								</div>
							</>
						)}
					</div>
				))}
				<div class={css.rounderRow}>
					<div class={css.thirdCorner}></div>
					<div class={css.fourthCorner}></div>
					<span></span>
				</div>
			</div>
		</div>
	);
}