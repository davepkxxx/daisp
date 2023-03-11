import { script2tokens, Token, TokenType } from "../src/token";

function expectToken(
  token: Token,
  type: TokenType,
  start: number,
  raw: string
): void;
function expectToken(
  token: Token,
  type: TokenType,
  start: number,
  length: number
): void;
function expectToken(
  token: Token,
  type: TokenType,
  start: number,
  raw: string | number
) {
  expect(token?.type).toBe(type);
  expect(token?.start).toBe(start);
  if (typeof raw === "number") {
    expect(token?.end).toBe(start + raw);
    expect(token?.raw.length).toBe(raw);
  } else {
    expect(token?.end).toBe(start + raw.length);
    expect(token?.raw).toBe(raw);
  }
}

describe("token", () => {
  describe("parse(string)", () => {
    test("unexpected character", () => {
      expect(() =>
        script2tokens(
          `
        (defn PI~ ()
          3.14)
      `,
          0
        )
      ).toThrow(new Error("unexpected character '~' at line 2 column 17"));
    });

    test("parse function declaration", () => {
      const tokens = script2tokens(
        `
        (defn PI ()
          3.14)
      `,
        0
      );
      expect(tokens.length).toBe(12);
      expectToken(tokens[0], TokenType.Skip, 0, 9);
      expectToken(tokens[1], TokenType.ParenL, 9, "(");
      expectToken(tokens[2], TokenType.Defn, 10, "defn");
      expectToken(tokens[3], TokenType.Skip, 14, 1);
      expectToken(tokens[4], TokenType.Id, 15, "PI");
      expectToken(tokens[5], TokenType.Skip, 17, 1);
      expectToken(tokens[6], TokenType.ParenL, 18, "(");
      expectToken(tokens[7], TokenType.ParenR, 19, ")");
      expectToken(tokens[8], TokenType.Skip, 20, 11);
      expectToken(tokens[9], TokenType.Num, 31, "3.14");
      expectToken(tokens[10], TokenType.ParenR, 35, ")");
      expectToken(tokens[11], TokenType.Skip, 36, 7);
    });
  });
});
