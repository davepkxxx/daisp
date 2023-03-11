import { mkdirSync, statSync, writeFileSync } from "fs";
import { createFsFromVolume, IFs, Volume } from "memfs";
import { resolve as pathResolve } from "path";
import webpack from "webpack";

describe("index", () => {
  describe("loader", () => {
    const rootDir = pathResolve(__dirname, "..");
    const targetDir = pathResolve(rootDir, "target");
    let fs: IFs;

    beforeEach(() => {
      fs = createFsFromVolume(new Volume());
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
          main: source,
        },
        output: {
          path: "/",
          filename: "main.js",
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
      compiler.outputFileSystem = fs;

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

      const target = fs.readFileSync("/main.js", "utf8").toString();
      expect(/function PI\(\) \{\s+return 3.14;\s+\}/.test(target)).toBe(true);
      expect(/PI = __webpack_exports__;/.test(target)).toBe(true);
    });
  });
});
