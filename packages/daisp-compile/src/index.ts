import generate from "@babel/generator";
import { parse } from "@daisp/parser";
import { transform } from "@daisp/transform";

export function compile(content: string) {
  return generate(transform(parse(content)));
}
