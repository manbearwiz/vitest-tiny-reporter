import type { UserConfig } from 'vitest/config';

export default {
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['cobertura', 'text', 'html', 'lcov'],
      thresholds: {
        statements: 95.9,
        branches: 89.65,
        functions: 100,
        lines: 95.9,
        autoUpdate: true,
      },
      exclude: ['./*.config.{js,ts,mts}', 'dist'],
    },
  },
} satisfies UserConfig;
