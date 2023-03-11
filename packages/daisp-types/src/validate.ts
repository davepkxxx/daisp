import {
  DECLARATION_TYPES,
  EXPRESSION_TYPES,
  NODE_TYPES,
  STATEMENT_TYPES,
} from "./ast";

export function isExportDeclaration(node: any) {
  return node?.type === "ExportDeclaration";
}

export function isDeclaration(node: any) {
  return DECLARATION_TYPES.includes(node?.type);
}

export function isExpression(node: any) {
  return EXPRESSION_TYPES.includes(node?.type);
}

export function isFunctionDeclaration(node: any) {
  return node?.type === "FunctionDeclaration";
}

export function isIdentifier(node: any) {
  return node?.type === "Identifier";
}

export function isNumericLiteral(node: any) {
  return node?.type === "NumericLiteral";
}

export function isNode(node: any) {
  return NODE_TYPES.includes(node?.type);
}

export function isProgram(node: any) {
  return node?.type === "Program";
}

export function isStatement(node: any) {
  return STATEMENT_TYPES.includes(node?.type);
}
