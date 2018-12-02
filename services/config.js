let nodepath = require("path");
let cwd = process.cwd();
module.exports = {
  configUrl: nodepath.join(cwd, "config.json")
};
