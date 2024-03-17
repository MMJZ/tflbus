import { type JSX } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { StateContext } from '../../context';
import { type AppState } from '../../state/store';
import { StopPointPage } from '../stopPoint/StopPointPage';
import css from './main.module.css';
import { Search } from '../search/Search';
import { ErrorBoundary, Route, Router } from 'preact-iso';
import { LinePage } from '../line/LinePage';

function Nothing(): JSX.Element {
	const [things, setThings] = useState<string[]>([]);

	useEffect(() => {
		fetch('https://api.tfl.gov.uk/Line/Route')
			.then(
				async (response) =>
					(await response.json()) as Array<{
						name: string;
						routeSections: object[];
					}>,
			)
			.then((hmmhmm) => {
				setThings(
					hmmhmm.filter((h) => h.routeSections.length > 2).map((h) => h.name),
				);
			});
	}, [setThings]);

	return <>Nothing {things.join(',')}</>;
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
					<h1>Probus</h1>
				</a>
				<button
					onClick={() => {
						state.stopPointCache.value = new Map();
						state.lineCache.value = new Map();
					}}
				>
					Clear cache
				</button>
				<Search />
			</header>
			<main class={css.main}>
				{loading && <>loading</>}
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
			<footer class={css.footer}>footer</footer>
		</div>
	);
}
