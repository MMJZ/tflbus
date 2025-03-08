import { ComponentChildren, type JSX } from 'preact';
import { useLocation } from 'preact-iso';
import { KeyboardEventHandler } from 'preact/compat';

interface LinkProps {
	route: string;
	sideEffect?: () => void;
	children: ComponentChildren;
	anchorClass?: string;
}

export function Link({
	route,
	sideEffect,
	anchorClass,
	children,
}: LinkProps): JSX.Element {
	const location = useLocation();

	const handler = () => {
		history.pushState({}, '', route);
		location.route(route, true);
		sideEffect?.();
	};

	const onKeyUp: KeyboardEventHandler<HTMLAnchorElement> = (event) => {
		event.preventDefault();
		if (event.key === 'Enter' || event.key === ' ') {
			handler();
		}
	};

	const handleKeyDownSpace: KeyboardEventHandler<HTMLAnchorElement> = (
		event,
	) => {
		if (event.key === ' ') {
			event.preventDefault();
		}
	};

	return (
		<a
			href={route}
			onKeyUp={onKeyUp}
			onKeyDown={handleKeyDownSpace}
			onClick={handler}
			class={anchorClass}
		>
			{children}
		</a>
	);
}
