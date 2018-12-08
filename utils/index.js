let chalk = require("chalk");
let branch = require("./branch");
let consoleYes = (msg = "") => {
  console.log(chalk.green(msg));
};
let consoleNo = (msg = "") => {
  console.log(chalk.red(msg));
};

let ifEmptyObject=(obj)=>{
let keys=Object.keys(obj);
if(keys.length===0){return true;}
return false;
};

module.exports = {
  ifEmptyObject,
  consoleYes,
  consoleNo,
  branch
};
