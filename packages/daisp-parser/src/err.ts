export class ParseError implements Error {
  public readonly name;

  public get message() {
    if (this.location) {
      return this._message + ` at line ${this.location.line} column ${this.location.column}`;
    }
    return this._message;
  }

  constructor(
    private readonly _message: string,
    public readonly start: number,
    public location?: { readonly line: number; readonly column: number },
    public readonly cause?: string,
  ) {
    this.name = "ParseError";
  }
}

export function parseLocation(str: string, pos: number) {
  let line = 1,
    column = 1;
  for (let i = 0; i < str.length && i < pos; i++) {
    if (str[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  } else if (err instanceof String) {
    return err.toString();
  } else if (typeof err === "string") {
    return err;
  } else {
    return new String(err).toString();
  }
}
