import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'scss-identity-proxy',
      enforce: 'pre',
      resolveId(source) {
        if (source.endsWith('.scss') || source.endsWith('.css')) {
          return '\0scss-proxy.js';
        }
        return null;
      },
      load(id) {
        if (id === '\0scss-proxy.js') {
          return 'export default new Proxy({}, { get: (_, key) => key === "__esModule" ? false : typeof key === "symbol" ? undefined : String(key) });';
        }
        return null;
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/__tests__/**/*.test.{ts,tsx}', 'dev/**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/__tests__/**',
        'src/setupTests.ts',
        'src/scss.d.ts',
        'src/types.ts',
        'src/**/index.ts',
      ],
    },
  },
});
