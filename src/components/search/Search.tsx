import { type JSX } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { StateContext } from '../../context';
import { type AppState } from '../../state/store';
import {
	type SearchResult,
	type StopPoint,
	type QueryResult,
} from '../../model';
import { StopPointView } from '../stopPoint/StopPointView';

export function Search(): JSX.Element {
	const _state = useContext(StateContext);

	if (_state === undefined) {
		throw new Error('fucked it bro');
	}

	const state = _state;

	(document as unknown as { hackState: AppState }).hackState = state;

	const [searchTerm, setSearchTerm] = useState<string | undefined>('dalberg');
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

	const [selectedStopId, setSelectedStopId] = useState<string | undefined>(
		undefined,
	);
	const [stopPoint, setStopPoint] = useState<StopPoint | undefined>(undefined);

	function doSearch(): void {
		fetch(
			`https://api.tfl.gov.uk/StopPoint/Search?query=${searchTerm}&modes=bus`,
		)
			.then(async (response) => (await response.json()) as QueryResult)
			.then((json) => {
				setSearchResults(json.matches);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		setStopPoint(undefined);

		if (selectedStopId === undefined) {
			return;
		}

		fetch(
			`https://api.tfl.gov.uk/StopPoint/${selectedStopId}?includeCrowdingData=false`,
		)
			.then(async (response) => (await response.json()) as StopPoint)
			.then((json) => {
				setStopPoint(json);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [setStopPoint, selectedStopId]);

	return (
		<>
			<input
				type="search"
				value={searchTerm}
				onChange={(e) => {
					setSearchTerm((e.target as HTMLInputElement).value);
				}}
			/>

			<button onClick={doSearch}>Search</button>

			<ul>
				{searchResults.map((searchResult) => (
					<li
						key={searchResult.id}
						onClick={() => {
							setSelectedStopId(searchResult.id);
						}}
					>
						name: {searchResult.name} id: {searchResult.id}{' '}
					</li>
				))}
			</ul>

			{selectedStopId === undefined && <p>No stop selected</p>}
			{selectedStopId !== undefined && stopPoint === undefined && (
				<p>Loading stop info...</p>
			)}

			{stopPoint !== undefined && (
				<div style={{ margin: '10px' }}>
					<StopPointView stopPoint={stopPoint} />
				</div>
			)}
		</>
	);
}
