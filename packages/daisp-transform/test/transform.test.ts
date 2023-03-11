import {
  ExportNamedDeclaration,
  FunctionDeclaration,
  isBlockStatement,
  isExportNamedDeclaration,
  isFunctionDeclaration,
  isIdentifier,
  isNumericLiteral,
  isProgram,
  isReturnStatement,
  NumericLiteral,
  ReturnStatement,
} from "@babel/types";
import {
  functionDeclaration,
  identifier,
  numericLiteral,
  program,
} from "@daisp/types";
import { exportDeclaration } from "@daisp/types/src";
import { transform } from "../src/transform";

describe("transform", () => {
  it("transform function declaration", () => {
    const prog = transform(
      program([
        exportDeclaration(
          functionDeclaration(identifier("PI"), numericLiteral(3.14))
        ),
      ])
    );
    expect(isProgram(prog)).toBe(true);
    expect(prog.body.length).toBe(1);
    const exportDecl = prog.body[0] as ExportNamedDeclaration;
    expect(isExportNamedDeclaration(exportDecl)).toBe(true);
    const fnDecl = exportDecl.declaration as FunctionDeclaration;
    expect(isFunctionDeclaration(fnDecl)).toBe(true);
    expect(isIdentifier(fnDecl.id)).toBe(true);
    expect(fnDecl.id?.name).toBe("PI");
    expect(isBlockStatement(fnDecl.body)).toBe(true);
    expect(fnDecl.body.body.length).toBe(1);
    const ret = fnDecl.body.body[0] as ReturnStatement;
    expect(isReturnStatement(ret)).toBe(true);
    const num = ret.argument as NumericLiteral;
    expect(isNumericLiteral(num)).toBe(true);
    expect(num.value).toBe(3.14);
  });
});
