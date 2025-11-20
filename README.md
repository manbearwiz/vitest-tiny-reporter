# vitest-tiny-reporter

[![npm](https://img.shields.io/npm/v/vitest-tiny-reporter?style=flat-square)](https://www.npmjs.com/package/vitest-tiny-reporter?activeTab=versions)
[![install size](https://flat.badgen.net/packagephobia/install/vitest-tiny-reporter)](https://packagephobia.com/result?p=vitest-tiny-reporter)
[![NPM](https://img.shields.io/npm/l/vitest-tiny-reporter?style=flat-square)](https://raw.githubusercontent.com/manbearwiz/vitest-tiny-reporter/master/LICENSE)
[![npm](https://img.shields.io/npm/dt/vitest-tiny-reporter?style=flat-square)](https://www.npmjs.com/package/vitest-tiny-reporter)
[![GitHub issues](https://img.shields.io/github/issues/manbearwiz/vitest-tiny-reporter?style=flat-square)](https://github.com/manbearwiz/vitest-tiny-reporter/issues)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release&style=flat-square)](https://github.com/semantic-release/semantic-release)

A minimal reporter for [Vitest](https://github.com/vitest-dev/vitest) that provides only the essential information about test runs. Perfect for CI/CD pipelines, git hooks, and AI agent contexts where concise output is crucial.

## Why?

- **Cleaner output** in tools like lefthook that run multiple checks in parallel
- **Fewer tokens** when using AI agents to analyze test results (~90% reduction)
- **Faster to read** for humans scanning multiple test outputs
- **Essential info only** - no verbose timing breakdowns or file paths

## Installation

```sh
npm install --save-dev vitest-tiny-reporter
```

## Usage

You can specify the reporter in your `vitest.config.ts`:

```ts
import type { UserConfig } from "vitest/config";
import TinyReporter from "vitest-tiny-reporter";

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

### With vitest-tiny-reporter

<img width="272" alt="image" src="https://github.com/user-attachments/assets/312c4f5d-e56f-4662-bf2b-d395339031ce">

```sh
$ npx vitest run --reporter=vitest-tiny-reporter
 ✖ FAIL  1 test failed
 Test Files  1 failed (1)
      Tests  1 failed | 17 passed (18)
```

### With default reporter

<img width="272" alt="image" src="https://github.com/user-attachments/assets/b68d930d-05f8-4281-8b14-9f8843e7dfb4">

```sh
$ npx vitest run --reporter=default

 RUN  v3.2.4 /Users/username/project

 ❯ src/example.test.ts (18 tests | 1 failed) 19ms
   ✓ test-suite > should throw error when not initialized 1ms
   ✓ test-suite > when no key > initialize > should not initialize client 1ms
   ✓ test-suite > when authenticated > initialize > should use user context 2ms
   ✓ test-suite > when authenticated > get > should return true when true 1ms
   ✓ test-suite > when authenticated > get > should return false when false 0ms
   ✓ test-suite > when authenticated > get > should return default value when undefined 0ms
   ✓ test-suite > when authenticated > get > should return default value on string values 0ms
   ✓ test-suite > when authenticated > get > should return details 5ms
   ✓ test-suite > when authenticated > changeUser > should change user when valid 1ms
   ✓ test-suite > when authenticated > changeUser > should reject when user is invalid 1ms
   ✓ test-suite > when authenticated > changeUser > should call changeUser with tenant slug 0ms
   ✓ test-suite > when authenticated > changeUser > should call changeUser with tenant object 0ms
   × test-suite > when authenticated > should call close 1ms
     → expected "spy" to not be called at all, but actually been called 2 times

Received:

  1st spy call:

    Array []

  2nd spy call:

    Array []


Number of calls: 2

   ✓ test-suite > when authenticated > should log an error when calling track 0ms
   ✓ test-suite > when authenticated > should call onUpdate 1ms
   ✓ test-suite > when anonymous > initialize > should use anonymous context 0ms
   ✓ test-suite > when anonymous > get > should return value 3ms
   ✓ test-suite > when standalone > get > should return value 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/example.test.ts > test-suite > when authenticated > should call close
AssertionError: expected "spy" to not be called at all, but actually been called 2 times

Received:

  1st spy call:

    Array []

  2nd spy call:

    Array []


Number of calls: 2

 ❯ src/example.test.ts:209:36
    207|     it('should call close', async () => {
    208|       await flags.close();
    209|       expect(mockClient.close).not.toHaveBeenCalled();
       |                                    ^
    210|     });
    211|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 17 passed (18)
   Start at  22:06:43
   Duration  439ms (transform 44ms, setup 0ms, collect 101ms, tests 19ms, environment 103ms, prepare 51ms)
```
