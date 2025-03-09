import { type JSX, render } from 'preact';
import { Main } from '@components';
import { LocationProvider } from 'preact-iso';
import { createAppState, StateContext } from '@state';
import 'what-input';

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
