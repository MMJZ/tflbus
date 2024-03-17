import { type JSX, render } from 'preact';
import { Main } from './components/main/Main';
import { createAppState } from './state/store';
import { StateContext } from './context';
import { LocationProvider } from 'preact-iso';

const appElement = document.getElementById('app');

if (appElement === null) {
	throw new Error("Failed to find 'app' in DOM");
}

function App(): JSX.Element {
	return (
		<LocationProvider>
			<StateContext.Provider value={createAppState()}>
				<Main />
			</StateContext.Provider>
		</LocationProvider>
	);
}

render(<App />, appElement);
