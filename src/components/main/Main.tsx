import { type JSX } from 'preact';
import { useContext } from 'preact/hooks';
import { StateContext } from '../../context';
import { type AppState } from '../../state/store';
import { StopPointView } from '../stopPoint/StopPointView';
import css from './main.module.css';
import { Search } from '../search/Search';
import { ErrorBoundary, Router, Route } from 'preact-iso';

export function Main(): JSX.Element {
	const _state = useContext(StateContext);

	if (_state === undefined) {
		throw new Error('fucked it bro');
	}

	const state = _state;

	(document as unknown as { hackState: AppState }).hackState = state;

	return (
		<div class={css.wrapper}>
			<header class={css.header}>
				<Search />
			</header>
			<main>
				<ErrorBoundary>
					<Router>
						<Route path="/stopPoint/:id" component={StopPointView} />
						<Route path="/line/:id" component={StopPointView} />
						<Route component={StopPointView} />
					</Router>
				</ErrorBoundary>
			</main>
			<footer class={css.footer}>footer</footer>
		</div>
	);
}
