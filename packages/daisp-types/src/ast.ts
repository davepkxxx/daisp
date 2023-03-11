import {
  DeclarationType,
  ExpressionType,
  NodeType,
  StatementType,
} from "daisp-tree";

export const DECLARATION_TYPES: DeclarationType[] = ["FunctionDeclaration"];
export const EXPRESSION_TYPES: ExpressionType[] = [
  "Identifier",
  "NumericLiteral",
];
export const STATEMENT_TYPES: StatementType[] = (
  ["ExportDeclaration"] as StatementType[]
)
  .concat(DECLARATION_TYPES)
  .concat(EXPRESSION_TYPES);
export const NODE_TYPES: NodeType[] = (["Program"] as NodeType[]).concat(
  STATEMENT_TYPES
);

export {
  Expression,
  ExpressionType,
  FunctionDeclaration,
  Identifier,
  NumericLiteral,
  Node,
  NodeType,
  Program,
  Statement,
  StatementType,
} from "daisp-tree";
