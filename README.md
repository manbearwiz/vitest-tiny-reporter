# vitest-tiny-reporter

[![npm](https://img.shields.io/npm/v/vitest-tiny-reporter?style=flat-square)](https://www.npmjs.com/package/vitest-tiny-reporter?activeTab=versions)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vitest-tiny-reporter?style=flat-square)](https://bundlephobia.com/package/vitest-tiny-reporter)
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

## Output

The output will look like this:

```sh
$ vitest
 ✖ FAIL  1 test failed
 Test Files  1 failed (1)
      Tests  1 failed | 10 passed (11)
```
