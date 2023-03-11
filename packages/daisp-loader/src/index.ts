import generate from "@babel/generator";
import { parse } from "@daisp/parser";
import { transform } from "@daisp/transform";
import { type LoaderDefinitionFunction } from "webpack";

const loader: LoaderDefinitionFunction = function (content: string) {
  return generate(transform(parse(content))).code;
};

export default loader;
