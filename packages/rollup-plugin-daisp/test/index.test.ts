import { mkdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { resolve } from "path";
import { rollup } from "rollup";
import plugin from "../src";

describe("index", () => {
  const targetDir = resolve(__dirname, "..", "target");

  beforeEach(() => {
    try {
      statSync(targetDir);
    } catch (e) {
      mkdirSync(targetDir);
    }
  });

  test("transform function declaration", async () => {
    const daispFile = resolve(targetDir, "fn_decl.daisp");
    const jsFile = resolve(targetDir, "fn_decl.js");
    writeFileSync(daispFile, "(export (defn PI() 3.14))", "utf-8");

    const bundle = await rollup({
      input: daispFile,
      plugins: [plugin()],
    });
    await bundle.write({
      file: jsFile,
      format: "es",
    });
    await bundle.close();

    const target = readFileSync(jsFile, "utf-8");
    expect(/function PI\(\) \{\s+return 3.14;\s+\}/.test(target)).toBe(true);
    expect(/export \{ PI \};/.test(target)).toBe(true);
  });
});
