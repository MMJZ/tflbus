import { type JSX } from 'preact';
import { useRoute } from 'preact-iso';
import { useContext, useEffect } from 'preact/hooks';
import { StateContext } from '@state';
import { Loading, StopPointView } from '@components';

export function StopPointPage(): JSX.Element {
	const _state = useContext(StateContext);

	if (_state === undefined) {
		throw new Error('No state context available');
	}

	const state = _state;
	const route = useRoute();

	useEffect(() => {
		const id = 'id' in route.params ? route.params.id : undefined;
		if (id !== undefined) {
			state.focussedStopPointId.value = id;
			state.focussedLineId.value = undefined;
		}
	}, [route, state.focussedLineId, state.focussedStopPointId]);

	const focussedStopPoint = state.focussedStopPoint.value;
	const focussedStopPointPath = state.focussedStopPointPath.value ?? [];

	useEffect(() => {
		document.title =
			focussedStopPoint === undefined
				? `Loading stop point — BusMupper`
				: `Stop point ${focussedStopPoint.commonName} — BusMupper`;
	}, [focussedStopPoint, state]);

	return focussedStopPoint !== undefined ? (
		<StopPointView
			stopPointData={focussedStopPoint}
			focussedStopPointPath={focussedStopPointPath}
		/>
	) : (
		<Loading />
	);
}
