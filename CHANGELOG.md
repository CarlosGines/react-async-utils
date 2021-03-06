## 0.14.0 (Oct 29, 2019)

### 🚀 New features

- New check to stop runaway effects. If you use `useAsyncData` hook unproperly, causing an infinite lop, now you will get an error explaining what happened and how to address it.

### 💥 Breaking changes

- `render` method has been moved to an `Async` class method.
  - `render(someAsync, { ... }` becomes `someAsync.render({ ... })`
- Now all `Async` classes use the generic `Payload` param:

```typescript
export type Async<Payload> =
  | InitAsync<Payload>
  | InProgressAsync<Payload>
  | SuccessAsync<Payload>
  | ErrorAsync<Payload>;
```

## 0.13.3 (Oct 28, 2019)

### 🏠 Internal

- Updated dependencies.
- Migrated from `npm` to `yarn`

## 0.13.2 (May 3, 2019)

### 🐛 Bug fixes

- Fixed clean up on `useAsyncTask` and `useManyAsyncTasks`.

## 0.13.1 (May 3, 2019)

### 🐛 Bug fixes

- Fixed typing for `getPayload`, and added tests for it.

### 📝 Documentation

- Minimal updates to README.

## 0.13.0 (Apr 24, 2019)

### 🚀 New features

- New `useManyAsyncTasks` hook. It works exactly the same way `useAsyncTask` does, but this hook can be used to track multiple async tasks of the same type. Instead of returning an `AsyncTask`, it returns an `AsyncTask` getter. Use any key as input to obtain the associated `AsyncTask`.

### 💥 Breaking changes

- `useAsyncTask` tasks don't get aborted when triggered multiple times or on component unmounting, only via the provided `abort` function. State updates still get cancelled on component unmounting.
- `useAsyncData` and `useAsyncTask` now return an object (an `AsyncData` or an `AsyncTask`) instead of a tuple. These objects are an `Async` including extra methods, like `refresh`, `trigger` or `abort`.
- Many helper methods have been moved to class methods or constructors.
  - `newInit(aborted)` becomes `new InitAsync(aborted)`...
  - `isInit(someAsync)` becomes `someAsync.isInit()`...
  - `getPayload(someAsync)` becomes `someAsync.getPayload()`.
  - `getError(someAsync)` becomes `someAsync.getError()`.

### 📝 Documentation

- Updated and extended README.

## 0.12.1 (Mar 31, 2019)

### 📝 Documentation

- Fixed outdated intro in README.

## 0.12.0 (Mar 31, 2019)

This version is a major API update, to better match how the library is used. Main change: we have split `useAsyncTask` hook in 2: `useAsyncData` for data fetching use cases and `useAsyncTask` for data mutation use cases. See the docs on README.md to better understand them.

### 🚀 New features

- New `useAsyncData` hook. Similar to previous hook, with subtle differences. It runs a `getData` async task **as an effect by default**. I can be re-triggered and reset manually, and it provides a `disable` option to keep the effect —and manual triggers— inactive.

### 💥 Breaking changes

- `useAsyncTask` is different to previous version. I receives a `getTask` function that provides the `AbortSignal` and returns a function with any args that will be the async task. It is **never run as an effect**. You can only trigger it manually with the returned "trigger" function, and **you can provide any args to the task via the trigger function** args (they are forwarded).
- `task` helper method renamed to `triggerTask`.

### 📝 Documentation

- Updated README parts related to hooks. Minors everywhere in README too.

### 🏠 Internal

- Migrated tests to Typescript.

## 0.11.0 (Mar 22, 2019)

### 💥 Breaking changes

- The `AbortSignal` that `useAsyncTask` provides as input parameter of the input function, is now optional. This is because its availability depends on browser compatibility.

### 🐛 Bug fixes

- Fixed broken IE compatibility because of `AbortController`.
- Fixed undesired transition from `SuccessAsync` to `InProgressAsync` when the task from `useAsyncTask` is triggered as an effect. Now it transitions to an invalidated `SuccessAsync`.

### 📝 Documentation

- Updated `useAsyncTask` in API Reference in README.

## 0.10.3 (Mar 21, 2019)

### 🐛 Bug fixes

- Fixed bug in `AsyncViewContainer` return type, preventing Typescript compilation.

### 📝 Documentation

- Added `useAsyncTask` to API Reference in README.

## 0.10.2 (Mar 19, 2019)

### 🚀 New features

- Typescript source files included in package bundle to enable "Go to Definition" inspection.

### 📝 Documentation

- README minimal updates. Added the turtle! 🐢
- CHANGELOG style enhanced.

### 🏠 Internal

- Added more tests to `render` function.
- Dropped source maps in package bundle.

## 0.10.1 (Mar 18, 2019)

### 📝 Documentation

- README badges updated.

### 🏠 Internal

- Added Travis CI and coveralls coverage report.

## 0.10.0 (Mar 17, 2019)

This is a relevant new verion. We have reached a more stable version of `useAsyncTask` hook: it finally meets `exhaustive-deps` rule, avoiding some bugs and making its API more intuitive. There are also new features regarding aborting tasks and race conditions. We have also added tests.

### 🚀 New features

- `useAsyncTask` handles race condition prevention.
- `useAsyncTask` provides an `AbortSignal` at the input function to make it abortable.
- Added `aborted` substate to `InitAsync`. Adapted helper methods, `render` and `useAsyncTask` accordingly.

### 💥 Breaking changes

- Updated `useAsyncTask`:
  - New boolean `triggerAsEffect` option instead of `autoTriggerWith` to trigger the async task automatcally.
  - Removed `onChange` option.

### 🐛 Bug fixes

- Fixed `errorRender` not being rendered at `AsyncViewContainer` in some cases.
- Fixed `AsyncViewContainer` properly accepting `null` as render props.

### 📝 Documentation

- README updated.

### 🏠 Internal

- Added tests.

## 0.9.0 (Mar 7, 2019)

### 🚀 New features

- Prevented racing conditions in `useAsyncData` when triggering an Async task times.
- Prevented undesired state updates from `useAsyncData` when reseting an `InProgress` Async.

### 💥 Breaking changes

- Renamed `useAsyncData` to `useAsyncTask`
- The `trigger` function returned by `useAsyncData` and the helper method `task` now return a promise of the resulting `Async` instead of `void`.

### 🐛 Bug fixes

- Deleted `useAsyncData` broken infinite loops detection in auto-trigger effect. We might add a new one in the future.

### 📝 Documentation

- README updated.

## 0.8.0 (Mar 4, 2019)

Big refactor for the sake of simplicity and understandability. Significantly revamped README.md to to explain the library more clearly.

### 🚀 New features

- `useAsyncData` now detects, prevents and logs (`console.error`) infinite loops caused by inappropriate dependencies for the auto-trigger effect.

### 💥 Breaking changes

- `useAsyncData`: always returns new trigger and reset functions. Dependencies in 3rd arg only affect the auto-trigger effect now.
- `AsyncViewContainer`: renamed most props to be more consistent and descriptive.
- `render`: args 2 to 5 (render functions) have become just one single arg: an object with one optional property per render function.
- Helper functions:
  - Now exported directly at top level, instead of under the `async` object.
  - Renamed many of them, and merged some of them into one.

### 📝 Documentation

- README updated.

## 0.7.1 (Mar 1, 2019)

### 🚀 New features

- `useAsyncData` hook now accepts a 3rd parameter as dependencies for the hook, overriding the first 2 parameters as dependencies.
- `AsyncViewContainer` render props accept `null` to render nothing.

### 📝 Documentation

- README updated.

## 0.7.0 (Feb 28, 2019)

### 💥 Breaking changes

- `useAsyncData` hook now includes all inputs as dependencies. Be specially careful if you use `autoTriggerWith`, since it might trigger `getData` on every render.

### 🚀 New features

- `render` accepts `null` as parameter to render nothing at the corresponding async state render.

### 📝 Documentation

- README updated.

# Previous Releases

Not documented: too early stages.
