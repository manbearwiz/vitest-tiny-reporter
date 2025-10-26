import c from 'tinyrainbow';
import { type RunnerTask, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Vitest } from 'vitest/node';
import TinyReporter from './index';

const mockVitestContext = {
  state: {
    getFiles: vi.fn().mockReturnValue([]),
    getUnhandledErrors: vi.fn().mockReturnValue([]),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } as any,
  logger: {
    log: vi.fn(),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } as any,
} satisfies Partial<Vitest>;

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
      mockVitestContext.state.getFiles.mockReturnValueOnce(
        Array.from(
          { length: passCount },
          () => ({ result: { state: 'pass' }, type: 'test' }) as RunnerTask,
        ),
      );
      mockVitestContext.state.getUnhandledErrors.mockReturnValueOnce([]);
      reporter.onFinished();

      expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
        `${c.green(c.bold(c.inverse(' \u2714 PASS ')))} ${c.green(
          'All tests passed',
        )}`,
      );
    },
  );

  it.each([[1], [2], [3]])(
    'should report FAIL with %i failed test(s)',
    (failCount) => {
      mockVitestContext.state.getFiles.mockReturnValueOnce(
        Array.from(
          { length: failCount },
          () => ({ result: { state: 'fail' }, type: 'test' }) as RunnerTask,
        ),
      );
      mockVitestContext.state.getUnhandledErrors.mockReturnValueOnce([]);
      reporter.onFinished();

      expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
        `${c.red(c.bold(c.inverse(' \u2716 FAIL ')))} ${c.red(
          `${failCount} test${failCount > 1 ? 's' : ''} failed`,
        )}`,
      );
    },
  );

  it.each([[1], [2], [3]])(
    'should report errors when there are %i error(s)',
    (failCount) => {
      mockVitestContext.state.getFiles.mockReturnValueOnce([]);
      mockVitestContext.state.getUnhandledErrors.mockReturnValueOnce(
        Array.from(
          { length: failCount },
          (_, i) => new Error(`Error ${i + 1}`),
        ),
      );
      reporter.onFinished();

      expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
        expect.stringContaining('Errors'),
        c.bold(c.red(`${failCount} error${failCount > 1 ? 's' : ''}`)),
      );
    },
  );

  it('should show "no tests" when empty', () => {
    mockVitestContext.state.getFiles.mockReturnValueOnce([]);
    mockVitestContext.state.getUnhandledErrors.mockReturnValueOnce([]);
    reporter.onFinished();

    expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
      expect.stringContaining('Test Files'),
      c.dim('no tests'),
    );
  });

  it.each([
    { mode: 'skip', label: 'skipped' },
    { mode: 'todo', label: 'todo' },
  ])('should display $label tests', ({ mode, label }) => {
    mockVitestContext.state.getFiles.mockReturnValueOnce([
      { result: { state: 'pass' }, mode: 'run', type: 'test' } as RunnerTask,
      { mode, type: 'test' } as RunnerTask,
    ]);
    mockVitestContext.state.getUnhandledErrors.mockReturnValueOnce([]);
    reporter.onFinished();

    const testSummaryCall = mockVitestContext.logger.log.mock.calls.find(
      (call: string[]) => call[0].includes('Tests'),
    );
    expect(testSummaryCall?.[1]).toContain(`1 ${label}`);
  });
});
