import { compile } from "../src";

describe("index", () => {
  describe("loader", () => {
    test("load function declaration", async () => {
      expect(
        /export function PI\(\) \{\s+return 3.14;\s+\}/.test(
          compile("(export (defn PI() 3.14))").code
        )
      ).toBe(true);
    });
  });
});
