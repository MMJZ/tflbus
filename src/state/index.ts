import { createContext } from 'preact';
import { type AppState } from './store';

export * from './store';

export const StateContext = createContext<AppState | undefined>(undefined);
