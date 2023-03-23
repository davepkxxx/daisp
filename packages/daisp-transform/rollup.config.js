const { config } = require("../../rollup.config");
const pkg = require("./package.json");

module.exports = config(pkg);
