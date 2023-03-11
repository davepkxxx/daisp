interface BaseNode {
  type: string;
  start?: number;
  end?: number;
}

export type NodeType = "Program" | StatementType;

export type Node = Program | Statement;

export interface Program extends BaseNode {
  type: "Program";
  body: Statement[];
}

export type StatementType =
  | "ExportDeclaration"
  | DeclarationType
  | ExpressionType;

export type Statement = Declaration | ExportDeclaration | Expression;

export interface ExportDeclaration {
  type: "ExportDeclaration";
  declaration: Declaration;
}

export type DeclarationType = "FunctionDeclaration";

export type Declaration = FunctionDeclaration;

export interface FunctionDeclaration extends BaseNode {
  type: "FunctionDeclaration";
  id: Identifier;
  body: Expression;
}

export type ExpressionType = "Identifier" | "NumericLiteral";

export type Expression = Identifier | NumericLiteral;

export interface Identifier extends BaseNode {
  type: "Identifier";
  name: string;
}

export interface NumericLiteral extends BaseNode {
  type: "NumericLiteral";
  value: number;
}
