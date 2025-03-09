import { ComponentChildren, type JSX } from 'preact';
import { useLocation } from 'preact-iso';

interface LinkProps {
	route: string;
	sideEffect?: () => void;
	children: ComponentChildren;
	anchorClass?: string;
	ariaLabel?: string;
	skipStateSave?: true;
}

export function Link({
	route,
	sideEffect,
	anchorClass,
	children,
	ariaLabel,
	skipStateSave,
}: LinkProps): JSX.Element {
	const location = useLocation();

	const handler = (event: MouseEvent) => {
		event.preventDefault();
		if (skipStateSave !== true) {
			history.pushState(undefined, '', route);
		}
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
