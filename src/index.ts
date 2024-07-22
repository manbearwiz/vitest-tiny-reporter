import { getTests } from '@vitest/runner/utils';
import c from 'tinyrainbow';
import type { Task, Vitest } from 'vitest';
import type { Reporter } from 'vitest/reporters';

export class TinyReporter implements Reporter {
  // biome-ignore lint/style/noNonNullAssertion: Non-null assertion is allowed here because the onInit method is called before any other method
  ctx: Vitest = undefined!;
  protected verbose = false;

  onInit(ctx: Vitest) {
    this.ctx = ctx;
  }

  onFinished(
    files = this.ctx.state.getFiles(),
    errors = this.ctx.state.getUnhandledErrors(),
  ) {
    const { logger } = this.ctx;
    const tests = getTests(files);
    const failedTests = tests.filter((i) => i.result?.state === 'fail').length;

    const passed = !(failedTests + errors.length);
    const status = passed ? '\u2714 PASS' : '\u2716 FAIL';
    const statusColor = passed ? c.green : c.red;

    logger.log(
      `${statusColor(c.bold(c.inverse(` ${status} `)))} ${statusColor(
        passed
          ? 'All tests passed'
          : `${failedTests} test${failedTests > 1 ? 's' : ''} failed`,
      )}`,
    );
    logger.log(this.padTitle('Test Files'), this.getStateString(files));
    logger.log(this.padTitle('Tests'), this.getStateString(tests));

    if (errors.length) {
      logger.log(
        this.padTitle('Errors'),
        c.bold(c.red(`${errors.length} error${errors.length > 1 ? 's' : ''}`)),
      );
    }

    if (!passed) {
      process.exitCode = 1;
    }
  }

  padTitle = (str: string) => c.dim(`${str.padStart(11)} `);

  getStateString(tasks: Task[], name = 'tests') {
    if (!tasks.length) {
      return c.dim(`no ${name}`);
    }

    const passed = tasks.filter((i) => i.result?.state === 'pass').length;
    const failed = tasks.filter((i) => i.result?.state === 'fail').length;
    const skipped = tasks.filter((i) => i.mode === 'skip').length;
    const todo = tasks.filter((i) => i.mode === 'todo').length;

    return (
      [
        failed && c.bold(c.red(`${failed} failed`)),
        passed && c.bold(c.green(`${passed} passed`)),
        skipped && c.yellow(`${skipped} skipped`),
        todo && c.gray(`${todo} todo`),
      ]
        .filter(Boolean)
        .join(c.dim(' | ')) + c.gray(` (${tasks.length})`)
    );
  }
}

export default TinyReporter;
