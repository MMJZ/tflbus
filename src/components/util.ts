import { type LocationHook } from 'preact-iso';

export function changeRoute(location: LocationHook, url: string): void {
	history.pushState({}, '', url);
	location.route(url, true);
}
