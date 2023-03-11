import { config } from "../../rollup.config.js";
import pkg from "./package.json" assert { type: "json" };

export default config(pkg, {
  external: ["@daisp/types"],
});
