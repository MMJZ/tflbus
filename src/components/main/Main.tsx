import { type JSX } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { StateContext } from '../../context';
import { type AppState } from '../../state/store';
import { StopPointPage } from '../stopPoint/StopPointPage';
import css from './main.module.css';
import { Search } from '../search/Search';
import { ErrorBoundary, Route, Router } from 'preact-iso';

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
				<Search />
			</header>
			<main>
				{loading && <>loading</>}
				<ErrorBoundary>
					<Router
						onLoadStart={() => {
							setLoading(true);
						}}
						onLoadEnd={() => {
							setLoading(false);
						}}
					>
						<Route path="/stopPoint/:id" component={StopPointPage} />
						<Route path="/line/:id" component={StopPointPage} />
						<Route default component={StopPointPage} />
					</Router>
				</ErrorBoundary>
			</main>
			<footer class={css.footer}>footer</footer>
		</div>
	);
}
