# vitest-tiny-reporter

[![npm](https://img.shields.io/npm/v/vitest-tiny-reporter?style=flat-square)](https://www.npmjs.com/package/vitest-tiny-reporter?activeTab=versions)
[![install size](https://flat.badgen.net/packagephobia/install/vitest-tiny-reporter)](https://packagephobia.com/result?p=vitest-tiny-reporter)
[![NPM](https://img.shields.io/npm/l/vitest-tiny-reporter?style=flat-square)](https://raw.githubusercontent.com/manbearwiz/vitest-tiny-reporter/master/LICENSE)
[![npm](https://img.shields.io/npm/dt/vitest-tiny-reporter?style=flat-square)](https://www.npmjs.com/package/vitest-tiny-reporter)
[![GitHub issues](https://img.shields.io/github/issues/manbearwiz/vitest-tiny-reporter?style=flat-square)](https://github.com/manbearwiz/vitest-tiny-reporter/issues)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release&style=flat-square)](https://github.com/semantic-release/semantic-release)

`vitest-tiny-reporter` is a minimal reporter for [Vitest](https://github.com/vitest-dev/vitest) that provides the most essential information about the test run. This is very useful with tools like lefthook that run several checks in parallel, where you want to see the test results without scrolling through a lot of output.

## Installation

```sh
npm install --save vitest-tiny-reporter
```

## Usage

You can specify the reporter in your `vitest.config.ts`:

```ts
import type { UserConfig } from 'vitest/config';
import TinyReporter from 'vite-tiny-reporter';

export default {
  test: {
    reporters: [new TinyReporter()],
  },
} satisfies UserConfig;
```

Or you can use the reporter from the command line:

```sh
vitest --reporter vitest-tiny-reporter
```

Or with lefthook:

```yml
pre-commit:
  parallel: true
  commands:
    test:
      glob: "*.ts"
      run: npx vitest related --reporter=vitest-tiny-reporter --run {staged_files}
      fail_text: "Tests failed"
      env:
        TERM: dumb
```

## Output

### Shell

In a shell, the output will look like this:

```sh
$ vitest
 ✖ FAIL  1 test failed
 Test Files  1 failed (1)
      Tests  1 failed | 10 passed (11)
```

### VSCode

When used with lefthook and committing in the VSCode UI, `vitest-tiny-reporter` shows actual usefull information.

Default reporter:

<img width="272" alt="image" src="https://github.com/user-attachments/assets/b68d930d-05f8-4281-8b14-9f8843e7dfb4">

Tiny reporter:

<img width="272" alt="image" src="https://github.com/user-attachments/assets/312c4f5d-e56f-4662-bf2b-d395339031ce">
