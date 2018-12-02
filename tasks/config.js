let nodepath = require("path");
let configOj = require("map-path")("Services/config.js");
let cwd = process.cwd();
let fs = require("fs-extra");

function config(url) {
  let newUrl = url;

  if (!nodepath.isAbsolute(url)) {
    newUrl = nodepath.join(cwd, url);
  }
  return new Promise((resolve, reject) => {
    fs.writeJson(configOj.configUrl, { path: newUrl })
      .then(() => {
        fs.ensureDirSync(newUrl);
        fs.ensureDirSync(nodepath.join(newUrl, "cmds"));
        fs.ensureDirSync(nodepath.join(newUrl, "tasks"));
        resolve(`${newUrl} is config to store action`);
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = config;
