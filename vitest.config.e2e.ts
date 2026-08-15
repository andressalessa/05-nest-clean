
import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['**/*.e2e-spec.ts'],
        globals: true,
        root: './',
        setupFiles: ['./src/test/setup-e2e.ts']
    },
    plugins: [
        swc.vite({
            module: { type: 'es6' },
        }),
    ],
    resolve: {
        tsconfigPaths: true,
        alias: {
            'src': resolve(__dirname, './src'),
        },
    },
});
