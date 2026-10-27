import c from 'tinyrainbow';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TestModule, Vitest } from 'vitest/node';
import TinyReporter from './index';

const createTestModule = (
  state: string,
  tests: { state: string; mode?: string }[] = [],
) =>
  ({
    state: () => state,
    children: {
      *allTests() {
        for (const test of tests) {
          yield {
            options: { mode: test.mode ?? 'run' },
            result: () => ({ state: test.state }),
          };
        }
      },
    },
  }) as unknown as TestModule;

const mockVitestContext = {
  logger: {
    log: vi.fn(),
    // biome-ignore lint/suspicious/noExplicitAny: it's a mock
  } as any,
} satisfies Partial<Vitest>;

describe('TinyReporter', () => {
  let reporter: TinyReporter;

  beforeEach(() => {
    reporter = new TinyReporter();
    vi.resetAllMocks();
    process.exitCode = undefined;
    reporter.onInit(mockVitestContext as Vitest);
  });

  it('should initialize context correctly', () => {
    expect(reporter.ctx).toBe(mockVitestContext);
  });

  it.each([[1], [2], [3]])(
    'should report PASS when there are %i passed test(s)',
    (passCount) => {
      reporter.onTestRunEnd(
        [
          createTestModule(
            'passed',
            Array.from({ length: passCount }, () => ({ state: 'passed' })),
          ),
        ],
        [],
      );

      expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
        `${c.green(c.bold(c.inverse(' \u2714 PASS ')))} ${c.green(
          'All tests passed',
        )}`,
      );
      expect(process.exitCode).not.toBe(1);
    },
  );

  it.each([[1], [2], [3]])(
    'should report FAIL with %i failed test(s)',
    (failCount) => {
      reporter.onTestRunEnd(
        [
          createTestModule(
            'failed',
            Array.from({ length: failCount }, () => ({ state: 'failed' })),
          ),
        ],
        [],
      );

      expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
        `${c.red(c.bold(c.inverse(' \u2716 FAIL ')))} ${c.red(
          `${failCount} test${failCount > 1 ? 's' : ''} failed`,
        )}`,
      );
      expect(process.exitCode).toBe(1);
    },
  );

  it.each([[1], [2], [3]])(
    'should report errors when there are %i error(s)',
    (errorCount) => {
      reporter.onTestRunEnd(
        [],
        Array.from({ length: errorCount }, (_, i) => ({
          message: `Error ${i + 1}`,
        })),
      );

      expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
        expect.stringContaining('Errors'),
        c.bold(c.red(`${errorCount} error${errorCount > 1 ? 's' : ''}`)),
      );
    },
  );

  it('should show "no tests" when empty', () => {
    reporter.onTestRunEnd([], []);

    expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
      expect.stringContaining('Test Files'),
      c.dim('no tests'),
    );
  });

  it.each([
    { mode: 'skip', label: 'skipped' },
    { mode: 'todo', label: 'todo' },
  ])('should display $label tests', ({ mode, label }) => {
    reporter.onTestRunEnd(
      [
        createTestModule('passed', [
          { state: 'passed' },
          { state: 'skipped', mode },
        ]),
      ],
      [],
    );

    const testSummaryCall = mockVitestContext.logger.log.mock.calls.find(
      (call: string[]) => call[0].includes('Tests'),
    );
    expect(testSummaryCall?.[1]).toContain(`1 ${label}`);
  });

  it('should summarize files and tests', () => {
    reporter.onTestRunEnd(
      [
        createTestModule('failed', [
          { state: 'passed' },
          { state: 'failed' },
          { state: 'failed' },
        ]),
        createTestModule('passed', [
          { state: 'passed' },
          { state: 'skipped', mode: 'skip' },
          { state: 'skipped', mode: 'todo' },
        ]),
        createTestModule('skipped'),
      ],
      [],
    );

    expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
      `${c.red(c.bold(c.inverse(' \u2716 FAIL ')))} ${c.red('2 tests failed')}`,
    );
    expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
      expect.stringContaining('Test Files'),
      [
        c.bold(c.red('1 failed')),
        c.bold(c.green('1 passed')),
        c.yellow('1 skipped'),
      ].join(c.dim(' | ')) + c.gray(' (3)'),
    );
    expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
      expect.stringContaining('Tests'),
      [
        c.bold(c.red('2 failed')),
        c.bold(c.green('2 passed')),
        c.yellow('1 skipped'),
        c.gray('1 todo'),
      ].join(c.dim(' | ')) + c.gray(' (6)'),
    );
  });
});
