import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import ts from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

/**
 * @type {import("rollup").RollupOptions}
 */
const defaultOps = {
  input: "src/index.ts",
  plugins: [commonjs(), nodeResolve(), ts()],
};

/**
 * @param {import("find-package-json").PackageJSON} pkg
 * @param {import("rollup").RollupOptions} ops
 * @returns {import("rollup").RollupOptions}
 */
export function config(pkg, ops) {
  /**
   * @type {import("rollup").RollupOptions}
   */
  const commonOps = { ...defaultOps, ...ops };
  return defineConfig([
    {
      ...commonOps,
      output: [
        {
          file: pkg.main,
          format: "cjs",
        },
        {
          file: pkg.module,
          format: "es",
        },
      ],
    },
    {
      ...commonOps,
      plugins: [dts()],
      output: {
        file: pkg.types,
      },
    },
  ]);
}
