import { type ViteUserConfig, coverageConfigDefaults } from 'vitest/config';

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
      include: ['src/**/*.ts'],
      reporter: ['cobertura', 'text', 'html', 'lcov'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
        autoUpdate: true,
      },
      exclude: [
        ...coverageConfigDefaults.exclude,
        './*.config.{js,ts,mts}',
        'dist',
      ],
    },
  },
} satisfies ViteUserConfig;
