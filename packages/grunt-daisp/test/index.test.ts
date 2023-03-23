import { mkdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { initConfig, loadTasks, task } from "grunt";
import { resolve as pathResolve } from "path";

describe("daisp", () => {
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

    test("compile function declaration", async () => {
      const source = pathResolve(targetDir, "fnDecl.daisp");
      writeFileSync(source, "(export (defn PI() 3.14))", "utf-8");

      initConfig({
        daisp: {
          compile: {
            src: [source],
            dest: targetDir,
          },
        },
      });
      loadTasks(pathResolve(rootDir, "dist"));
      task.run("daisp");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      task["start"]();

      const target = readFileSync(pathResolve(targetDir, "fnDecl.js"), "utf8");
      expect(/export function PI\(\) \{\s+return 3.14;\s+\}/.test(target)).toBe(
        true
      );
    });
  });
});
