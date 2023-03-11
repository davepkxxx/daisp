import { Declaration, ExportDeclaration } from "daisp-tree";
import {
  Expression,
  FunctionDeclaration,
  Identifier,
  NumericLiteral,
  Program,
  Statement,
} from "./ast";

export function exportDeclaration(declaration: Declaration): ExportDeclaration {
  return {
    type: "ExportDeclaration",
    declaration,
  };
}

export function functionDeclaration(
  id: Identifier,
  body: Expression
): FunctionDeclaration {
  return {
    type: "FunctionDeclaration",
    id,
    body,
  };
}

export function identifier(name: string): Identifier {
  return {
    type: "Identifier",
    name,
  };
}

export function numericLiteral(value: number): NumericLiteral {
  return {
    type: "NumericLiteral",
    value,
  };
}

export function program(body: Statement[]): Program {
  return {
    type: "Program",
    body,
  };
}
