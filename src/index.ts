import { createColors } from 'tinyrainbow';
import type {
  Reporter,
  SerializedError,
  TestCase,
  TestModule,
  Vitest,
} from 'vitest/node';

const c = createColors();

export default class TinyReporter implements Reporter {
  // biome-ignore lint/style/noNonNullAssertion: Non-null assertion is allowed here because the onInit method is called before any other method
  ctx: Vitest = undefined!;
  protected verbose = false;

  onInit(ctx: Vitest) {
    this.ctx = ctx;
  }

  onTestRunEnd(
    testModules: ReadonlyArray<TestModule>,
    unhandledErrors: ReadonlyArray<SerializedError>,
  ) {
    const { logger } = this.ctx;
    const tests = testModules.flatMap((module) => [
      ...module.children.allTests(),
    ]);
    const failedTests = tests.filter(
      (t) => t.result().state === 'failed',
    ).length;

    const passed = !(failedTests + unhandledErrors.length);
    const status = passed ? '\u2714 PASS' : '\u2716 FAIL';
    const statusColor = passed ? c.green : c.red;

    logger.log(
      `${statusColor(c.bold(c.inverse(` ${status} `)))} ${statusColor(
        passed
          ? 'All tests passed'
          : `${failedTests} test${failedTests > 1 ? 's' : ''} failed`,
      )}`,
    );
    logger.log(
      this.padTitle('Test Files'),
      this.getModulesStateString(testModules),
    );
    logger.log(this.padTitle('Tests'), this.getTestsStateString(tests));

    if (unhandledErrors.length) {
      logger.log(
        this.padTitle('Errors'),
        c.bold(
          c.red(
            `${unhandledErrors.length} error${unhandledErrors.length > 1 ? 's' : ''}`,
          ),
        ),
      );
    }

    if (!passed) {
      process.exitCode = 1;
    }
  }

  padTitle = (str: string) => c.dim(`${str.padStart(11)} `);

  getModulesStateString(modules: ReadonlyArray<TestModule>) {
    if (!modules.length) {
      return c.dim('no tests');
    }

    const passed = modules.filter((m) => m.state() === 'passed').length;
    const failed = modules.filter((m) => m.state() === 'failed').length;
    const skipped = modules.filter((m) => m.state() === 'skipped').length;

    return (
      [
        failed && c.bold(c.red(`${failed} failed`)),
        passed && c.bold(c.green(`${passed} passed`)),
        skipped && c.yellow(`${skipped} skipped`),
      ]
        .filter(Boolean)
        .join(c.dim(' | ')) + c.gray(` (${modules.length})`)
    );
  }

  getTestsStateString(tests: ReadonlyArray<TestCase>) {
    if (!tests.length) {
      return c.dim('no tests');
    }

    const passed = tests.filter((t) => t.result().state === 'passed').length;
    const failed = tests.filter((t) => t.result().state === 'failed').length;
    const skipped = tests.filter((t) => t.options.mode === 'skip').length;
    const todo = tests.filter((t) => t.options.mode === 'todo').length;

    return (
      [
        failed && c.bold(c.red(`${failed} failed`)),
        passed && c.bold(c.green(`${passed} passed`)),
        skipped && c.yellow(`${skipped} skipped`),
        todo && c.gray(`${todo} todo`),
      ]
        .filter(Boolean)
        .join(c.dim(' | ')) + c.gray(` (${tests.length})`)
    );
  }
}
