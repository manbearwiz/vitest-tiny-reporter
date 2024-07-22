import type { UserConfig } from 'vitest/config';

export default {
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['cobertura', 'text', 'html', 'lcov'],
      thresholds: {
        statements: 93.75,
        branches: 82.14,
        functions: 100,
        lines: 93.75,
        autoUpdate: true,
      },
      exclude: ['./*.config.{js,ts,mts}', 'dist'],
    },
  },
} satisfies UserConfig;
