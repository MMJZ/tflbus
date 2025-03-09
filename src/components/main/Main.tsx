import { type JSX } from 'preact';
import { useContext, useRef, useState } from 'preact/hooks';
import { StateContext } from '@state';
import css from './main.module.css';
import {
	LandingPage,
	LinePage,
	Link,
	Loading,
	Search,
	StopPointPage,
} from '@components';
import { ErrorBoundary, Route, Router } from 'preact-iso';

export function Main(): JSX.Element {
	const _state = useContext(StateContext);
	if (_state === undefined) {
		throw new Error('No state context available');
	}
	const state = _state;
	const [loading, setLoading] = useState(false);
	const mainRef = useRef<HTMLElement | null>(null);

	const focusMain = () => {
		mainRef.current?.scrollIntoView(true);
		mainRef.current?.focus();
	};

	return (
		<div class={css.wrapper}>
			<header class={css.header}>
				<button
					onClick={() => {
						setTimeout(focusMain, 0);
					}}
					class={css.skip}
				>
					Skip to main content
				</button>
				<Link route="/" ariaLabel="Go to homepage">
					<h1>BusMupper</h1>
				</Link>
				<Search focusMain={focusMain} />
			</header>
			<main class={css.main} tabIndex={-1} ref={mainRef}>
				{loading && <Loading />}
				<ErrorBoundary>
					<Router
						onLoadStart={() => {
							setLoading(true);
						}}
						onLoadEnd={() => {
							setLoading(false);
						}}
						onRouteChange={console.log}
					>
						<Route path="stopPoint/:id" component={StopPointPage} />
						<Route path="line/:id" component={LinePage} />
						<Route default component={LandingPage} />
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
