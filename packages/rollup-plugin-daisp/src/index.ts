import generate from "@babel/generator";
import { parse } from "@daisp/parser";
import { transform } from "@daisp/transform";
import { Plugin } from "rollup";

export default function daisp(): Plugin {
  return {
    name: "daisp",
    transform(code) {
      return generate(transform(parse(code))).code;
    },
  };
}
