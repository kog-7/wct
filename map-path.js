let nodepath = require("path");

let cwd = __dirname;

module.exports = {
  Utils: nodepath.join(cwd, "utils"),
  Tasks: nodepath.join(cwd, "tasks"),
  Services: nodepath.join(cwd, "services")
};
