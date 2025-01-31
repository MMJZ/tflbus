import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
	plugins: [preact()],
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
