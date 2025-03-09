import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [preact(), tsconfigPaths()],
	css: {
		modules: {
			localsConvention: 'camelCase',
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		css: {
			modules: {
				classNameStrategy: 'non-scoped',
			},
		},
		setupFiles: ['./vitest-setup.ts'],
	},
});
