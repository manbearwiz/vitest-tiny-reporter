import c from 'tinyrainbow';
import type { RunnerTask, SerializedError } from 'vitest';
import type { Reporter, TestModule, Vitest } from 'vitest/node';

type Outcome = 'passed' | 'failed' | 'skipped' | 'todo' | 'pending' | 'queued';

const getTests = (tasks: RunnerTask[]): RunnerTask[] =>
  tasks.flatMap((task) =>
    task.type === 'suite' ? getTests(task.tasks) : [task],
  );

const getLegacyOutcome = (task: RunnerTask): Outcome => {
  if (task.mode === 'todo') return 'todo';
  if (task.mode === 'skip') return 'skipped';
  if (task.result?.state === 'pass') return 'passed';
  if (task.result?.state === 'fail') return 'failed';
  return 'pending';
};

export default class TinyReporter implements Reporter {
  // biome-ignore lint/style/noNonNullAssertion: Non-null assertion is allowed here because the onInit method is called before any other method
  ctx: Vitest = undefined!;
  protected verbose = false;

  onInit(ctx: Vitest) {
    this.ctx = ctx;
  }

  // Vitest 2 only: Vitest 3 calls both hooks, and Vitest 4+ only calls onTestRunEnd.
  onFinished(
    files = this.ctx.state.getFiles(),
    errors = this.ctx.state.getUnhandledErrors(),
  ) {
    if (Number.parseInt(this.ctx.version, 10) >= 3) {
      return;
    }

    this.printSummary(
      files.map(getLegacyOutcome),
      getTests(files).map(getLegacyOutcome),
      errors.length,
    );
  }

  onTestRunEnd(
    testModules: ReadonlyArray<TestModule>,
    unhandledErrors: ReadonlyArray<SerializedError>,
  ) {
    const tests = testModules.flatMap((testModule) =>
      Array.from(testModule.children.allTests()),
    );

    this.printSummary(
      testModules.map((testModule) => testModule.state()),
      tests.map((test) =>
        test.options.mode === 'todo' ? 'todo' : test.result().state,
      ),
      unhandledErrors.length,
    );
  }

  private printSummary(files: Outcome[], tests: Outcome[], errorCount: number) {
    const { logger } = this.ctx;
    const failedTests = tests.filter((i) => i === 'failed').length;

    const passed = !(failedTests + errorCount);
    const status = passed ? '\u2714 PASS' : '\u2716 FAIL';
    const statusColor = passed ? c.green : c.red;

    logger.log(
      `${statusColor(c.bold(c.inverse(` ${status} `)))} ${statusColor(
        passed
          ? 'All tests passed'
          : `${failedTests} test${failedTests > 1 ? 's' : ''} failed`,
      )}`,
    );
    logger.log(this.padTitle('Test Files'), this.formatOutcomes(files));
    logger.log(this.padTitle('Tests'), this.formatOutcomes(tests));

    if (errorCount) {
      logger.log(
        this.padTitle('Errors'),
        c.bold(c.red(`${errorCount} error${errorCount > 1 ? 's' : ''}`)),
      );
    }

    if (!passed) {
      process.exitCode = 1;
    }
  }

  padTitle = (str: string) => c.dim(`${str.padStart(11)} `);

  getStateString(tasks: RunnerTask[], name = 'tests') {
    return this.formatOutcomes(tasks.map(getLegacyOutcome), name);
  }

  private formatOutcomes(outcomes: Outcome[], name = 'tests') {
    if (!outcomes.length) {
      return c.dim(`no ${name}`);
    }

    const passed = outcomes.filter((i) => i === 'passed').length;
    const failed = outcomes.filter((i) => i === 'failed').length;
    const skipped = outcomes.filter((i) => i === 'skipped').length;
    const todo = outcomes.filter((i) => i === 'todo').length;

    return (
      [
        failed && c.bold(c.red(`${failed} failed`)),
        passed && c.bold(c.green(`${passed} passed`)),
        skipped && c.yellow(`${skipped} skipped`),
        todo && c.gray(`${todo} todo`),
      ]
        .filter(Boolean)
        .join(c.dim(' | ')) + c.gray(` (${outcomes.length})`)
    );
  }
}
