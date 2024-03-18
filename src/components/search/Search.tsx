import { type JSX } from 'preact';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { StateContext } from '../../context';
import { type AppState } from '../../state/store';
import css from './search.module.css';
import {
	type SearchResult,
	type StopPoint,
	type QueryResult,
} from '../../model';

function debounce<T>(wait: number, fn: (arg: T) => void): (arg: T) => void {
	let timeoutId: number | undefined;
	return (arg: T) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			fn(arg);
		}, wait);
	};
}

export function Search(): JSX.Element {
	const _state = useContext(StateContext);
	if (_state === undefined) {
		throw new Error('fucked it bro');
	}
	const state = _state;
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [matchedLines, setMatchedLines] = useState<string[]>([]);

	const doSearch = useCallback(
		debounce<string>(300, (searchTerm) => {
			if (searchTerm.length > 0) {
				const lines = (state.lineList.value ?? []).filter((i) =>
					i.includes(searchTerm),
				);
				lines.sort((a, b) => a.length - b.length);
				setMatchedLines(lines.slice(0, 20));
			}

			if (searchTerm.length < 3) {
				return;
			}

			setIsSearching(true);
			fetch(
				`https://api.tfl.gov.uk/StopPoint/Search?query=${searchTerm}&modes=bus`,
			)
				.then(async (response) => (await response.json()) as QueryResult)
				.then((json) => {
					setSearchResults(json.matches);
					setIsSearching(false);
				})
				.catch((err) => {
					console.log(err);
					setIsSearching(false);
				});
		}),
		[setSearchResults, setIsSearching],
	);

	return (
		<div class={css.wrapper}>
			<div class={css.searchBox}>
				<input
					placeholder="Search..."
					type="search"
					onInput={(e) => {
						const searchTerm = (e.target as HTMLInputElement).value;
						doSearch(searchTerm);
					}}
					onBlur={(e) => {
						const searchTerm = (e.target as HTMLInputElement).value;
						if (searchTerm.length === 0) {
							setSearchResults([]);
							setMatchedLines([]);
						}
					}}
				/>
			</div>
			{isSearching && <div>loading</div>}
			{matchedLines.length > 0 && (
				<ul class={css.matchedLines}>
					{matchedLines.map((matchedLine) => (
						<li key={matchedLine}>
							<a href={`/line/${matchedLine}`}>
								<h4>{matchedLine.toLocaleUpperCase()}</h4>
							</a>
						</li>
					))}
				</ul>
			)}
			{searchResults.length > 0 && (
				<ul class={css.searchResults}>
					{searchResults.map((searchResult) => (
						<li key={searchResult.id}>
							<a href={`/stopPoint/${searchResult.id}`}>
								<h4>{searchResult.name}</h4>
								<h6>{searchResult.id}</h6>
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
