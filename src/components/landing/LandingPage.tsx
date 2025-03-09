import { StateContext } from '@state';
import { Link } from '@components';
import { JSX } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import css from './landing.module.css';

interface LandingPageProps {
	focusMain: () => void;
}

export function LandingPage({ focusMain }: LandingPageProps): JSX.Element {
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
		<div class={css.wrapper}>
			<h2>BusMupper Quick Guide</h2>
			<p>
				BusMupper uses{' '}
				<a href="https://www.data.gov.uk/dataset/ff93ffc1-6656-47d8-9155-85ea0b8f2251/naptan">
					NAPTAN data
				</a>{' '}
				to visualise London Bus routes and stops.
			</p>
			<div>
				<div>
					<h3>Search by Line</h3>
					<p>View a complete bus route</p>
					<h4>Examples:</h4>
					<ul aria-label="Example bus routes">
						{['3', '51', 'b13', 'sl6'].map((route) => (
							<li>
								<Link
									route={`/line/${route}`}
									sideEffect={focusMain}
									ariaLabel={`Go to bus route ${route}`}
								>
									<h4>{route.toLocaleUpperCase()}</h4>
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h3>Search by stop name</h3>
					<p>View the hierarchy of a stop point</p>
					<h4>Examples:</h4>
					<ul aria-label="Example stop points">
						{[
							['HUBBRX', 'Brixton'],
							['490G000125', 'Alers Road'],
							['490G00003975', 'Bexleyheath Clock Tower'],
						].map(([id, name]) => (
							<li>
								<Link
									route={`/stopPoint/${id}`}
									sideEffect={focusMain}
									ariaLabel={`Go to stop ${name}`}
								>
									<h4>{name}</h4>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
