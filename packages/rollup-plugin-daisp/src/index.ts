import { compile } from "@daisp/compile";
import { type Plugin } from "rollup";

export default function (): Plugin {
  return {
    name: "daisp",
    transform(code) {
      return compile(code).code;
    },
  };
}
