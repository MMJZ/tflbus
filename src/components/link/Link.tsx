import { ComponentChildren, type JSX } from 'preact';
import { useLocation } from 'preact-iso';
import { KeyboardEventHandler } from 'preact/compat';

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

	const handler = () => {
		location.route(route, true);
		sideEffect?.();
	};

	return (
		<a
			href={route}
			onClick={handler}
			class={anchorClass}
			aria-label={ariaLabel}
		>
			{children}
		</a>
	);
}
