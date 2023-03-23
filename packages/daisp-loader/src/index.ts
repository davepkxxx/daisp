import { compile } from "@daisp/compile";
import { type LoaderDefinitionFunction } from "webpack";

const loader: LoaderDefinitionFunction = function (content: string) {
  return compile(content).code;
};

export default loader;
