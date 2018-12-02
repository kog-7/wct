let chalk = require("chalk");
let branch = require("./branch");
let consoleYes = (msg = "") => {
  console.log(chalk.green(msg));
};
let consoleNo = (msg = "") => {
  console.log(chalk.red(msg));
};

module.exports = {
  consoleYes,
  consoleNo,
  branch
};
