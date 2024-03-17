import { type JSX } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { StateContext } from '../../context';
import { type AppState } from '../../state/store';
import css from './search.module.css';
import {
	type SearchResult,
	type StopPoint,
	type QueryResult,
} from '../../model';

export function Search(): JSX.Element {
	const _state = useContext(StateContext);

	if (_state === undefined) {
		throw new Error('fucked it bro');
	}

	const state = _state;

	(document as unknown as { hackState: AppState }).hackState = state;

	const [searchTerm, setSearchTerm] = useState<string | undefined>('kellet');
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

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

	return (
		<div class={css.wrapper}>
			<div class={css.searchBox}>
				<input
					type="search"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm((e.target as HTMLInputElement).value);
					}}
				/>
				<button onClick={doSearch}>Search</button>
			</div>
			<ul>
				{searchResults.map((searchResult) => (
					<li key={searchResult.id}>
						<a href={`/stopPoint/${searchResult.id}`}>
							<h4>{searchResult.name}</h4>
							<h6>{searchResult.id}</h6>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
