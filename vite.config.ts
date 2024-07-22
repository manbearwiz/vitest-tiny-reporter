import type { UserConfig } from 'vitest/config';

export default {
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'vitest-tiny-reporter',
    },
    rollupOptions: {
      external: ['tinyrainbow'],
      output: {
        globals: {
          tinyrainbow: 'tinyrainbow',
        },
      },
    },
    sourcemap: true,
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['cobertura', 'text', 'html', 'lcov'],
      thresholds: {
        statements: 93.8,
        branches: 82.75,
        functions: 100,
        lines: 93.8,
        autoUpdate: true,
      },
      exclude: ['./*.config.{js,ts,mts}', 'dist'],
    },
  },
} satisfies UserConfig;
