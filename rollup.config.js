const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const ts = require("@rollup/plugin-typescript");
const path = require("path");
const { defineConfig } = require("rollup");
const { default: dts } = require("rollup-plugin-dts");

/**
 * @param {import("find-package-json").PackageJSON} pkg
 * @param {import("rollup").RollupOptions[]} options
 * @returns {import("rollup").RollupOptions}
 */
function getConfig(pkg, ...options) {
  return options.reduce((ops, option) => ({ ...ops, ...option }), {
    input: "src/index.ts",
    plugins: [nodeResolve(), commonjs(), ts()],
    external: Object.getOwnPropertyNames(pkg.dependencies || {}),
  });
}

/**
 * @param {import("find-package-json").PackageJSON} pkg
 * @param {import("rollup").RollupOptions[]} ops
 * @returns {import("rollup").RollupOptions}
 */
module.exports.config = function (pkg, ...ops) {
  return defineConfig([
    getConfig(
      pkg,
      {
        output: [
          {
            file: pkg.main,
            format: "cjs",
            interop: "auto",
          },
          {
            file: pkg.module,
            format: "es",
          },
        ],
      },
      ...ops
    ),
    getConfig(
      pkg,
      {
        plugins: [dts()],
        output: {
          file: pkg.types,
        },
      },
      ...ops
    ),
  ]);
};
