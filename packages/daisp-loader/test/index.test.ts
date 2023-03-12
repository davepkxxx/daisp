import { mkdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { resolve as pathResolve } from "path";
import webpack from "webpack";

describe("index", () => {
  describe("loader", () => {
    const rootDir = pathResolve(__dirname, "..");
    const targetDir = pathResolve(rootDir, "target");

    beforeEach(() => {
      try {
        statSync(targetDir);
      } catch (err) {
        mkdirSync(targetDir);
      }
    });

    test("load function declaration", async () => {
      const source = pathResolve(targetDir, "fnDecl.daisp");
      writeFileSync(source, "(export (defn PI() 3.14))", "utf-8");

      const compiler = webpack({
        mode: "production",
        entry: {
          fnDecl: source,
        },
        output: {
          path: targetDir,
          filename: "[name].js",
          library: "PI",
        },
        module: {
          rules: [
            {
              test: /\.daisp$/,
              use: {
                loader: pathResolve(rootDir, "src", "index.ts"),
              },
            },
          ],
        },
        optimization: {
          minimize: false,
          splitChunks: false,
        },
      });

      await new Promise<void>((resolve, reject) => {
        compiler.run((err, stats) => {
          if (err) {
            reject(err);
          } else if (stats?.hasErrors()) {
            reject(stats.toJson().errors);
          } else {
            compiler.close((err) => {
              if (err) {
                console.error(err);
              }
            });
            resolve();
          }
        });
      });

      const target = readFileSync(pathResolve(targetDir, "fnDecl.js"), "utf8");
      expect(/function PI\(\) \{\s+return 3.14;\s+\}/.test(target)).toBe(true);
      expect(/PI = __webpack_exports__;/.test(target)).toBe(true);
    });
  });
});
