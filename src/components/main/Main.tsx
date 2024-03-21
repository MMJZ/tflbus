import { type JSX } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { StateContext } from '../../context';
import { type AppState } from '../../state/store';
import { StopPointPage } from '../stopPoint/StopPointPage';
import css from './main.module.css';
import { Search } from '../search/Search';
import { ErrorBoundary, Route, Router } from 'preact-iso';
import { LinePage } from '../line/LinePage';
import { Loading } from '../loading/Loading';

function Nothing(): JSX.Element {
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
		throw new Error('fucked it bro');
	}
	const state = _state;
	(document as unknown as { hackState: AppState }).hackState = state;

	const [loading, setLoading] = useState(false);

	return (
		<div class={css.wrapper}>
			<header class={css.header}>
				<a href="/">
					<h1>BusMupper</h1>
				</a>
				<Search />
			</header>
			<main class={css.main}>
				{loading && <Loading />}
				<ErrorBoundary>
					<Router
						onLoadStart={() => {
							setLoading(true);
						}}
						onLoadEnd={() => {
							setLoading(false);
						}}
						onRouteChange={() => {
							// window.scrollTo(window.scrollX, state.scrollY.peek())
						}}
					>
						<Route path="stopPoint/:id" component={StopPointPage} />
						<Route path="line/:id" component={LinePage} />
						<Route default component={Nothing} />
					</Router>
				</ErrorBoundary>
			</main>
			<footer class={css.footer}>
				<p>Not associated with TfL.</p>
				<button
					onClick={() => {
						state.stopPointCache.value = new Map();
						state.lineCache.value = new Map();
					}}
				>
					Clear cache
				</button>
			</footer>
		</div>
	);
}
