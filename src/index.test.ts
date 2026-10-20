import { createColors } from 'tinyrainbow';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  SerializedError,
  TestCase,
  TestModule,
  Vitest,
} from 'vitest/node';
import TinyReporter from './index';

const c = createColors();

// biome-ignore lint/suspicious/noExplicitAny: it's a mock
const mockLogger = { log: vi.fn() } as any;

const mockVitestContext = {
  logger: mockLogger,
} satisfies Partial<Vitest>;

function createMockTest(
  state: 'passed' | 'failed' | 'skipped',
  mode: 'run' | 'skip' | 'todo' = 'run',
): TestCase {
  return {
    options: { mode },
    result: () => ({ state }),
    // biome-ignore lint/suspicious/noExplicitAny: it's a mock
  } as any;
}

function createMockModule(
  state: 'passed' | 'failed' | 'skipped',
  tests: TestCase[] = [],
): TestModule {
  return {
    state: () => state,
    children: {
      allTests: function* () {
        yield* tests;
      },
    },
    // biome-ignore lint/suspicious/noExplicitAny: it's a mock
  } as any;
}

describe('TinyReporter', () => {
  let reporter: TinyReporter;

  beforeEach(() => {
    reporter = new TinyReporter();
    vi.resetAllMocks();
    reporter.onInit(mockVitestContext as Vitest);
  });

  it('should initialize context correctly', () => {
    expect(reporter.ctx).toBe(mockVitestContext);
  });

  it.each([[1], [2], [3]])(
    'should report PASS when there are %i passed test(s)',
    (passCount) => {
      const tests = Array.from({ length: passCount }, () =>
        createMockTest('passed'),
      );
      reporter.onTestRunEnd(
        [createMockModule('passed', tests)],
        [] as ReadonlyArray<SerializedError>,
      );

      expect(mockLogger.log).toHaveBeenCalledWith(
        `${c.green(c.bold(c.inverse(' \u2714 PASS ')))} ${c.green(
          'All tests passed',
        )}`,
      );
    },
  );

  it.each([[1], [2], [3]])(
    'should report FAIL with %i failed test(s)',
    (failCount) => {
      const tests = Array.from({ length: failCount }, () =>
        createMockTest('failed'),
      );
      reporter.onTestRunEnd(
        [createMockModule('failed', tests)],
        [] as ReadonlyArray<SerializedError>,
      );

      expect(mockLogger.log).toHaveBeenCalledWith(
        `${c.red(c.bold(c.inverse(' \u2716 FAIL ')))} ${c.red(
          `${failCount} test${failCount > 1 ? 's' : ''} failed`,
        )}`,
      );
    },
  );

  it.each([[1], [2], [3]])(
    'should report errors when there are %i error(s)',
    (failCount) => {
      const errors = Array.from(
        { length: failCount },
        (_, i) =>
          ({ name: 'Error', message: `Error ${i + 1}` }) as SerializedError,
      );
      reporter.onTestRunEnd([], errors);

      expect(mockLogger.log).toHaveBeenCalledWith(
        expect.stringContaining('Errors'),
        c.bold(c.red(`${failCount} error${failCount > 1 ? 's' : ''}`)),
      );
    },
  );

  it('should show "no tests" when empty', () => {
    reporter.onTestRunEnd([], [] as ReadonlyArray<SerializedError>);

    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('Test Files'),
      c.dim('no tests'),
    );
  });

  it.each([
    { mode: 'skip', label: 'skipped' },
    { mode: 'todo', label: 'todo' },
  ] as const)('should display $label tests', ({ mode, label }) => {
    reporter.onTestRunEnd(
      [
        createMockModule('passed', [
          createMockTest('passed'),
          createMockTest('skipped', mode),
        ]),
      ],
      [] as ReadonlyArray<SerializedError>,
    );

    const testSummaryCall = mockLogger.log.mock.calls.find((call: string[]) =>
      call[0].includes('Tests'),
    );
    expect(testSummaryCall?.[1]).toContain(`1 ${label}`);
  });

  it('should display skipped test files', () => {
    reporter.onTestRunEnd(
      [
        createMockModule('passed', [createMockTest('passed')]),
        createMockModule('skipped', [createMockTest('skipped', 'skip')]),
      ],
      [] as ReadonlyArray<SerializedError>,
    );

    const fileSummaryCall = mockLogger.log.mock.calls.find((call: string[]) =>
      call[0].includes('Test Files'),
    );
    expect(fileSummaryCall?.[1]).toContain('1 passed');
    expect(fileSummaryCall?.[1]).toContain('1 skipped');
  });
});
