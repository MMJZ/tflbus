import { type JSX } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { StateContext } from '@state';
import css from './main.module.css';
import { LinePage, Link, Loading, Search, StopPointPage } from '@components';
import { ErrorBoundary, Route, Router } from 'preact-iso';

function Nothing(): JSX.Element {
	const _state = useContext(StateContext);
	if (_state === undefined) {
		throw new Error('No state context available');
	}
	const state = _state;

	useEffect(() => {
		state.focussedLineId.value = undefined;
		state.focussedStopPointId.value = undefined;
	}, [state.focussedLineId, state.focussedStopPointId]);

	useEffect(() => {
		document.title = 'Home — BusMupper';
	}, []);

	return (
		<div class={css.nothingWrapper}>
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="800px"
					height="800px"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="800px"
					height="800px"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						d="M12 20L12 4M12 4L18 10M12 4L6 10"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
		</div>
	);
}

export function Main(): JSX.Element {
	const _state = useContext(StateContext);
	if (_state === undefined) {
		throw new Error('No state context available');
	}
	const state = _state;
	const [loading, setLoading] = useState(false);

	return (
		<div class={css.wrapper}>
			<header class={css.header}>
				<Link route="#main" anchorClass={css.skip} skipStateSave>
					Skip to main content
				</Link>
				<Link route="/" ariaLabel="Go to homepage">
					<h1>BusMupper</h1>
				</Link>
				<Search />
			</header>
			<main id="main" class={css.main}>
				{loading && <Loading />}
				<ErrorBoundary>
					<Router
						onLoadStart={() => {
							setLoading(true);
						}}
						onLoadEnd={() => {
							setLoading(false);
						}}
					>
						<Route path="stopPoint/:id" component={StopPointPage} />
						<Route path="line/:id" component={LinePage} />
						<Route default component={Nothing} />
					</Router>
				</ErrorBoundary>
			</main>
			<footer class={css.footer}>
				<div>
					<p>
						Powered by TfL Open Data. Contains OS data © Crown copyright and
						database rights 2016. Geomni UK Map data © and database rights
						2019.
					</p>
				</div>
				<button
					onClick={() => {
						state.stopPointCache.value = [];
						state.lineCache.value = new Map();
					}}
				>
					Clear cache
				</button>
			</footer>
		</div>
	);
}
