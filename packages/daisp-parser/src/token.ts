import { ParseError, parseLocation } from "./err";

export interface Token {
  readonly type: TokenType;
  readonly start: number;
  readonly end: number;
  readonly raw: string;
}

export enum TokenType {
  Defn = "DEFN",
  Export = "EXPORT",
  ParenL = "PAREN_L",
  ParenR = "PAREN_R",
  Num = "NUM",
  Id = "ID",
  Skip = "SKIP",
}

export const tokenTypes = [
  TokenType.Defn,
  TokenType.Export,
  TokenType.ParenL,
  TokenType.ParenR,
  TokenType.Num,
  TokenType.Id,
  TokenType.Skip,
];

function token2pattern(type: TokenType) {
  switch (type) {
    case TokenType.Defn:
      return /^defn/;
    case TokenType.Export:
      return /^export/;
    case TokenType.ParenL:
      return /^\(/;
    case TokenType.ParenR:
      return /^\)/;
    case TokenType.Num:
      return /^\d+(.[\d]+)?/;
    case TokenType.Id:
      return /^[a-zA-Z_](\w*)/;
    case TokenType.Skip:
      return /^\s+/;
  }
}

export function script2tokens(script: string, start: number): Token[] {
  if (start < script.length) {
    const part = script.substring(start);
    for (const type of tokenTypes) {
      const raw = token2pattern(type).exec(part)?.[0];
      if (raw?.length) {
        const end = start + raw.length;
        return [
          {
            type,
            start,
            end,
            raw,
          },
          ...script2tokens(script, end),
        ];
      }
    }
    throw new ParseError(
      `unexpected character '${script[start]}'`,
      start,
      parseLocation(script, start)
    );
  } else {
    return [];
  }
}
