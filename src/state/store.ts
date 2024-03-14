import { type Signal, signal } from '@preact/signals';

export interface AppState {
	isConnected: Signal<boolean>;
}

export function createAppState(): AppState {
	const isConnected = signal(false);

	return {
		isConnected,
	};
}
