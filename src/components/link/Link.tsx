import { ComponentChildren, type JSX } from 'preact';
import { useLocation } from 'preact-iso';

interface LinkProps {
	route: string;
	sideEffect?: () => void;
	children: ComponentChildren;
	anchorClass?: string;
	ariaLabel?: string;
}

export function Link({
	route,
	sideEffect,
	anchorClass,
	children,
	ariaLabel,
}: LinkProps): JSX.Element {
	const location = useLocation();

	const handler = (event: MouseEvent) => {
		event.preventDefault();
		history.pushState(undefined, '', route);
		location.route(route, true);
		sideEffect?.();
	};

	return (
		<a
			href={route}
			class={anchorClass}
			aria-label={ariaLabel}
			onClick={handler}
		>
			{children}
		</a>
	);
}
