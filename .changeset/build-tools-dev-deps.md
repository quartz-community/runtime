---
"@quartz-community/runtime": patch
---

Move `tsup` and `typescript` to `devDependencies`: they only build the package, so sites no longer install them (and esbuild, rollup) through plugins that depend on the runtime.
