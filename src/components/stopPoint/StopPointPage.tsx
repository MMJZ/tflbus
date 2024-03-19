import { type JSX } from 'preact';
import { useRoute } from 'preact-iso';
import { useContext, useEffect } from 'preact/hooks';
import { StateContext } from '../../context';
import { StopPointView } from './StopPointView';
import { Loading } from '../loading/Loading';

export function StopPointPage(): JSX.Element {
	const _state = useContext(StateContext);

	if (_state === undefined) {
		throw new Error('fucked it bro');
	}

	const state = _state;
	const route = useRoute();

	useEffect(() => {
		const id = route.params.id;
		if (id !== undefined) {
			state.focussedStopPointId.value = id;
		}
	}, [route, state.focussedStopPointId]);

	const focussedStopPoint = state.focussedStopPoint.value;
	const focussedStopPointPath = state.focussedStopPointPath.value ?? [];

	return focussedStopPoint !== undefined ? (
		<StopPointView
			stopPointData={focussedStopPoint}
			focussedStopPointPath={focussedStopPointPath}
		/>
	) : (
		<Loading />
	);
}
