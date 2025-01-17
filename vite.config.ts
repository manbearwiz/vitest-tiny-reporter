import type { UserConfig } from 'vite';

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
        statements: 87.71,
        branches: 84,
        functions: 100,
        lines: 87.71,
        autoUpdate: true,
      },
      exclude: ['./*.config.{js,ts,mts}', 'dist'],
    },
  },
} satisfies UserConfig;
