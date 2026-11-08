## 1.0.1

### Patch Changes

- 4fd2f7c: Move `tsup` and `typescript` to `devDependencies`: they only build the package, so sites no longer install them (and esbuild, rollup) through plugins that depend on the runtime.

## 1.0.0

### Major Changes

- Stable 1.0 release. All `@quartz-community/*` dependencies now use `^1.0.0` ranges.

  Pre-1.0 caret ranges pinned the minor version (`^0.2.1` means `>=0.2.1 <0.3.0`), so
  published fixes to shared packages could never be resolved by dependents. Moving the
  ecosystem to 1.0 makes caret ranges behave conventionally.
