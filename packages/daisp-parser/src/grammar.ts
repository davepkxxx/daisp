import {
  DECLARATION_TYPES,
  exportDeclaration,
  Expression,
  ExpressionType,
  EXPRESSION_TYPES,
  FunctionDeclaration,
  functionDeclaration,
  Identifier,
  identifier,
  Node,
  NodeType,
  NumericLiteral,
  numericLiteral,
  Program,
  program,
  Statement,
  StatementType,
  STATEMENT_TYPES,
} from "@daisp/types";
import { Declaration, DeclarationType, ExportDeclaration } from "daisp-tree";
import { errorMessage, ParseError, parseLocation } from "./err";
import { script2tokens, Token, TokenType } from "./token";

type GrammarNodeType = "NodeList" | "TokenNode";

interface GrammarNode {
  type: GrammarNodeType;
  start: number;
  end: number;
}

export interface GrammarNodeList extends GrammarNode {
  type: "NodeList";
  items: (GrammarNode | Node)[];
}

export function toNodeListItems(
  items: (GrammarNode | Node)[]
): (GrammarNode | Node)[] {
  return items.reduce((res, item) => {
    if (item.type === "NodeList") {
      res.push(...(item as GrammarNodeList).items);
    } else {
      res.push(item);
    }
    return res;
  }, [] as (GrammarNode | Node)[]);
}

export interface TokenNode extends GrammarNode {
  type: "TokenNode";
  token: Token;
}

export enum GrammarType {
  Prog = "prog",
  Stmt = "stmt",
  ExportDecl = "exportDecl",
  Decl = "decl",
  FnDecl = "fnDecl",
  Expr = "expr",
  Id = "id",
  Num = "num",
}

abstract class MatchPattern {
  abstract match(
    tokens: Token[],
    start: number
  ): { end: number; node: Node | GrammarNode };
}

class GrammarPattern extends MatchPattern {
  constructor(private value: GrammarType) {
    super();
  }

  public match(
    tokens: Token[],
    start: number
  ): { end: number; node: Node | GrammarNode } {
    try {
      const { end, node } = type2pattern(this.value).match(tokens, start);
      return {
        end,
        node: this._convert(node),
      };
    } catch (err) {
      if (err instanceof ParseError) {
        throw err;
      } else {
        throw new ParseError(errorMessage(err), tokens[start].start);
      }
    }
  }

  private _convert(source: Node | GrammarNode): Node | GrammarNode {
    switch (this.value) {
      case GrammarType.Prog:
        return program(
          this._filterNodes((source as GrammarNodeList).items, "Statement")
        );
      case GrammarType.ExportDecl:
        return exportDeclaration(
          this._filterNodes((source as GrammarNodeList).items, "Declaration")[0]
        );
      case GrammarType.FnDecl: {
        const { items } = source as GrammarNodeList;
        return functionDeclaration(
          this._filterNodes(items, "Identifier")[0],
          this._filterNodes(items, "Expression")[1]
        );
      }
      case GrammarType.Id:
        return identifier((source as TokenNode).token.raw);
      case GrammarType.Num:
        return numericLiteral(parseFloat((source as TokenNode).token.raw));
      default:
        return source;
    }
  }

  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "Expression"
  ): Expression[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "ExportDeclaration"
  ): ExportDeclaration[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "Declaration"
  ): Declaration[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "FunctionDeclaration"
  ): FunctionDeclaration[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "NodeList"
  ): GrammarNodeList[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "Identifier"
  ): Identifier[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "NumericLiteral"
  ): NumericLiteral[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "Program"
  ): Program[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "Statement"
  ): Statement[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type: "TokenNode"
  ): TokenNode[];
  private _filterNodes(
    items: (GrammarNode | Node)[],
    type:
      | GrammarNodeType
      | NodeType
      | "Declaration"
      | "Expression"
      | "Statement"
  ): (Node | GrammarNode)[] {
    return items.filter((item) => {
      switch (type) {
        case "Declaration":
          return DECLARATION_TYPES.includes(item.type as DeclarationType);
        case "Expression":
          return EXPRESSION_TYPES.includes(item.type as ExpressionType);
        case "Statement":
          return STATEMENT_TYPES.includes(item.type as StatementType);
        default:
          return item.type === type;
      }
    });
  }
}

class TokenPattern extends MatchPattern {
  constructor(private value: TokenType) {
    super();
  }

  public match(
    tokens: Token[],
    start: number
  ): { end: number; node: TokenNode } {
    if (tokens[start]?.type === this.value) {
      return {
        end: start + 1,
        node: {
          type: "TokenNode",
          start,
          end: start + 1,
          token: tokens[start],
        },
      };
    }
    throw new ParseError(`Missing token '${this.value}'`, tokens[start].start);
  }
}

class AndPattern extends MatchPattern {
  constructor(private value: MatchPattern[]) {
    super();
  }

  public match(
    tokens: Token[],
    start: number
  ): { end: number; node: GrammarNodeList } {
    let i = start;
    const nodes: (GrammarNode | Node)[] = [];
    for (const pattern of this.value) {
      const { end, node } = pattern.match(tokens, i);
      i = end;
      nodes.push(node);
    }
    return {
      end: i,
      node: {
        type: "NodeList",
        start,
        end: i,
        items: toNodeListItems(nodes),
      },
    };
  }
}

class OrPattern extends MatchPattern {
  constructor(private value: MatchPattern[]) {
    super();
  }

  public match(
    tokens: Token[],
    start: number
  ): { end: number; node: GrammarNode | Node } {
    for (const pattern of this.value) {
      try {
        return pattern.match(tokens, start);
      } catch {
        /* empty */
      }
    }
    throw new ParseError(
      `unexpected token '${tokens[0].raw}'`,
      tokens[start].start
    );
  }
}

class AnyPattern extends MatchPattern {
  constructor(private value: MatchPattern) {
    super();
  }

  public match(
    tokens: Token[],
    start: number
  ): { end: number; node: GrammarNodeList } {
    let i = start;
    const nodes: (GrammarNode | Node)[] = [];
    while (i < tokens.length) {
      try {
        const { end, node } = this.value.match(tokens, i);
        i = end;
        nodes.push(node);
      } catch {
        break;
      }
    }
    return {
      end: i,
      node: {
        type: "NodeList",
        start,
        end: i,
        items: toNodeListItems(nodes),
      },
    };
  }
}

enum LogicLetter {
  Or = "|",
  Any = "*",
}

function type2pattern(value: GrammarType): MatchPattern {
  switch (value) {
    case GrammarType.Prog:
      return grammar2pattern("stmt*");
    case GrammarType.Stmt:
      return grammar2pattern("exportDecl | decl | expr");
    case GrammarType.ExportDecl:
      return grammar2pattern("PAREN_L EXPORT decl PAREN_R");
    case GrammarType.Decl:
      return grammar2pattern("fnDecl");
    case GrammarType.FnDecl:
      return grammar2pattern("PAREN_L DEFN id PAREN_L PAREN_R expr PAREN_R");
    case GrammarType.Expr:
      return grammar2pattern("num");
    case GrammarType.Id:
      return grammar2pattern("ID");
    case GrammarType.Num:
      return grammar2pattern("NUM");
  }
}

function grammar2pattern(grammar: string): MatchPattern {
  const regex = /\w+|\||\*/g;
  const letters: (LogicLetter | GrammarType | TokenType)[] = [];
  for (let arr = regex.exec(grammar); arr; arr = regex.exec(grammar)) {
    letters.push(arr[0] as LogicLetter | GrammarType | TokenType);
  }
  const pattern = letters2pattern(letters, 0);
  return pattern;
  // return letters2pattern(letters, 0);
}

function letters2pattern(
  letters: (LogicLetter | GrammarType | TokenType)[],
  start: number
): MatchPattern {
  let pattern = letter2pattern(letters[start++] as GrammarType | TokenType);
  if (start < letters.length) {
    if (letters[start] === LogicLetter.Any) {
      pattern = new AnyPattern(pattern);
      start++;
    }

    if (start < letters.length) {
      if (letters[start] === LogicLetter.Or) {
        return new OrPattern([pattern, letters2pattern(letters, start + 1)]);
      } else {
        return new AndPattern([pattern, letters2pattern(letters, start)]);
      }
    }
  }

  return pattern;
}

function letter2pattern(letter: GrammarType | TokenType): MatchPattern {
  switch (letter) {
    case GrammarType.Prog:
    case GrammarType.Stmt:
    case GrammarType.ExportDecl:
    case GrammarType.Decl:
    case GrammarType.FnDecl:
    case GrammarType.Expr:
    case GrammarType.Id:
    case GrammarType.Num:
      return new GrammarPattern(letter);
    default:
      return new TokenPattern(letter);
  }
}

export function parse(script: string): Program {
  const tokens = script2tokens(script, 0).filter(
    (token) => token.type !== TokenType.Skip
  );

  try {
    const { end, node } = letter2pattern(GrammarType.Prog).match(tokens, 0);

    if (end < tokens.length) {
      throw new ParseError(
        `unexpected character '${tokens[end].raw}'`,
        end,
        parseLocation(script, tokens[end].start)
      );
    }

    return node as Program;
  } catch (err) {
    if (err instanceof ParseError) {
      err.location = parseLocation(script, err.start);
    }
    throw err;
  }
}
