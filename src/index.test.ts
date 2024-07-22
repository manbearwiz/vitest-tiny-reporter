import c from 'tinyrainbow';
import {
  type Task,
  type Vitest,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { TinyReporter } from './index';

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

  it('should log a pass message when all tests pass', () => {
    mockVitestContext.state.getFiles.mockReturnValueOnce([
      {
        result: { state: 'pass' },
        type: 'test',
      } as Task,
      {
        result: { state: 'pass' },
        type: 'test',
      } as Task,
    ]);
    mockVitestContext.state.getUnhandledErrors.mockReturnValueOnce([]);
    reporter.onFinished();

    expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
      `${c.green(c.bold(c.inverse(' \u2714 PASS ')))} ${c.green(
        'All tests passed',
      )}`,
    );
  });

  it('should log a fail message when some tests fail', () => {
    mockVitestContext.state.getFiles.mockReturnValueOnce([
      {
        result: { state: 'fail' },
        type: 'test',
      } as Task,
    ]);
    mockVitestContext.state.getUnhandledErrors.mockReturnValueOnce([]);
    reporter.onFinished();

    expect(mockVitestContext.logger.log).toHaveBeenCalledWith(
      `${c.red(c.bold(c.inverse(' \u2716 FAIL ')))} ${c.red('1 test failed')}`,
    );
  });
});
