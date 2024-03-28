import { type JSX } from 'preact';
import { useContext, useMemo, useState } from 'preact/hooks';
import { StateContext } from '../../context';
import css from './search.module.css';
import { type SearchResult, type QueryResult } from '../../model';
import { Loading } from '../loading/Loading';
import { useLocation } from 'preact-iso';
import { changeRoute } from '../util';

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
		throw new Error('No state context available');
	}
	const state = _state;
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [matchedLines, setMatchedLines] = useState<string[]>([]);
	const location = useLocation();

	const doSearch = useMemo(
		() =>
			debounce<string>(300, (searchTerm) => {
				if (searchTerm.length > 0) {
					const cleanedSearchTerm = searchTerm.toLocaleUpperCase();
					const lines = (state.lineList.value ?? []).filter((i) =>
						i.includes(cleanedSearchTerm),
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
		[setSearchResults, setIsSearching, state.lineList],
	);

	return (
		<div class={css.wrapper}>
			<div class={css.searchBox}>
				<input
					autofocus
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
			{isSearching && <Loading />}
			{matchedLines.length > 0 && (
				<ul class={css.matchedLines}>
					{matchedLines.map((matchedLine) => (
						<li key={matchedLine}>
							<a
								onClick={() => {
									changeRoute(location, `/line/${matchedLine}`);
								}}
							>
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
							<a
								onClick={() => {
									changeRoute(location, `/stopPoint/${searchResult.id}`);
								}}
							>
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
