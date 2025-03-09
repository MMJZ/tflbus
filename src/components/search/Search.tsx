import { type JSX } from 'preact';
import { useContext, useMemo, useState } from 'preact/hooks';
import { StateContext } from '@state';
import css from './search.module.css';
import { type SearchResult, type QueryResult } from '@model';
import { Link, Loading } from '@components';

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
	const [isExpanded, setIsExpanded] = useState(false);

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
					.catch((err: unknown) => {
						console.log(err);
						setIsSearching(false);
					});
			}),
		[setSearchResults, setIsSearching, state.lineList],
	);

	const displayedSearchResults = useMemo(
		() => (isExpanded ? searchResults : searchResults.slice(0, 5)),
		[isExpanded, searchResults],
	);

	return (
		<div class={css.wrapper}>
			<div class={css.searchBox}>
				<input
					placeholder="Search by stop name or bus number"
					type="search"
					onInput={(e) => {
						const searchTerm = e.currentTarget.value;
						doSearch(searchTerm);
					}}
					onBlur={(e) => {
						const searchTerm = e.currentTarget.value;
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
							<Link
								route={`/line/${matchedLine}`}
								sideEffect={() => {
									document.getElementsByTagName('main')[0].scrollIntoView(true);
									document.getElementsByTagName('main')[0].focus();
								}}
								ariaLabel={`Go to bus route ${matchedLine}`}
							>
								<h4>{matchedLine.toLocaleUpperCase()}</h4>
							</Link>
						</li>
					))}
				</ul>
			)}
			{displayedSearchResults.length > 0 && (
				<ul class={css.searchResults}>
					{displayedSearchResults.map((searchResult) => (
						<li key={searchResult.id}>
							<Link
								route={`/stopPoint/${searchResult.id}`}
								sideEffect={() => {
									document.getElementsByTagName('main')[0].scrollIntoView(true);
									document.getElementsByTagName('main')[0].focus();
								}}
								ariaLabel={`Go to stop point ${searchResult.name} ${searchResult.towards !== undefined ? `towards ${searchResult.towards}` : ''}`}
							>
								<div>
									<h4>{searchResult.name}</h4>
									{searchResult.towards !== undefined && (
										<h5>➤ {searchResult.towards}</h5>
									)}
								</div>
								<h6>{searchResult.id}</h6>
							</Link>
						</li>
					))}
				</ul>
			)}
			{searchResults.length > 5 && (
				<button
					onClick={() => {
						setIsExpanded(!isExpanded);
					}}
				>
					{isExpanded ? 'Show fewer' : 'Show more'}
				</button>
			)}
		</div>
	);
}
