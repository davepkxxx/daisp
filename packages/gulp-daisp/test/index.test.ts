import { mkdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { dest, src } from "gulp";
import rename from "gulp-rename";
import { resolve as pathResolve } from "path";
import plugin from "../src";

describe("index", () => {
  describe("transform", () => {
    const rootDir = pathResolve(__dirname, "..");
    const targetDir = pathResolve(rootDir, "target");

    beforeEach(() => {
      try {
        statSync(targetDir);
      } catch (err) {
        mkdirSync(targetDir);
      }
    });

    test("transform function declaration", async () => {
      const source = pathResolve(targetDir, "fnDecl.daisp");
      writeFileSync(source, "(export (defn PI() 3.14))", "utf-8");

      src(source)
        .pipe(plugin())
        .pipe(
          rename({
            extname: ".js",
          })
        )
        .pipe(dest(targetDir));

      const target = readFileSync(pathResolve(targetDir, "fnDecl.js"), "utf8");
      expect(/export function PI\(\) \{\s+return 3.14;\s+\}/.test(target)).toBe(
        true
      );
    });
  });
});
