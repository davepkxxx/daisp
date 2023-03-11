import {
  blockStatement,
  exportNamedDeclaration,
  functionDeclaration,
  identifier,
  numericLiteral,
  program,
  returnStatement,
} from "@babel/types";
import {
  Expression,
  FunctionDeclaration,
  Identifier,
  Node,
  NumericLiteral,
  Program,
  Statement,
} from "@daisp/types";
import { ExportDeclaration } from "daisp-tree";
import {
  EsExportNamedDeclaration,
  EsExpression,
  EsFunctionDeclaration,
  EsIdentifier,
  EsNode,
  EsNumericLiteral,
  EsProgram,
  EsStatement,
} from "./estree";

export function transform(node: Program): EsProgram {
  return convert(node);
}

function convert(node: ExportDeclaration): EsExportNamedDeclaration;
function convert(node: FunctionDeclaration): EsFunctionDeclaration;
function convert(node: Identifier): EsIdentifier;
function convert(node: NumericLiteral): EsNumericLiteral;
function convert(node: Program): EsProgram;
function convert(node: Expression): EsExpression;
function convert(node: Statement): EsStatement;
function convert(node: Node): EsNode {
  switch (node.type) {
    case "ExportDeclaration":
      return exportNamedDeclaration(convert(node.declaration));
    case "FunctionDeclaration": {
      return functionDeclaration(
        convert(node.id),
        [],
        blockStatement([returnStatement(convert(node.body))])
      );
    }
    case "Identifier":
      return identifier(node.name);
    case "NumericLiteral":
      return numericLiteral(node.value);
    case "Program":
      return program(node.body.map((stmt) => convert(stmt)));
  }
}
