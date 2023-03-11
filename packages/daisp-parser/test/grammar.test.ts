import {
  FunctionDeclaration,
  isExportDeclaration,
  isFunctionDeclaration,
  isIdentifier,
  isNumericLiteral,
  isProgram,
  NumericLiteral,
  Program,
} from "@daisp/types";
import { ExportDeclaration } from "daisp-tree";
import { parse } from "../src/grammar";

describe("grammar", () => {
  test("parse(string)", () => {
    const prog = parse(`
      (export
        (defn PI ()
          3.14))
    `);
    expect(isProgram(prog)).toBe(true);
    expect(prog.body.length).toBe(1);
    expect(isExportDeclaration(prog.body[0])).toBe(true);
    const exprtDecl = prog.body[0] as ExportDeclaration;
    expect(isFunctionDeclaration(exprtDecl.declaration)).toBe(true);
    const fnDecl = exprtDecl.declaration as FunctionDeclaration;
    expect(isIdentifier(fnDecl.id)).toBe(true);
    expect(fnDecl.id.name).toBe("PI");
    expect(isNumericLiteral(fnDecl.body)).toBe(true);
    const num = fnDecl.body as NumericLiteral;
    expect(num.value).toBe(3.14);
  });
});
