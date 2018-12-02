let nodepath = require("path");

let cwd = process.cwd();

module.exports = {
  Utils: nodepath.join(cwd, "utils"),
  Tasks: nodepath.join(cwd, "tasks"),
  Services: nodepath.join(cwd, "services")
};
