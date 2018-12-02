#!/usr/bin/env node

var program = require("commander");
let fs = require("fs-extra");

require("map-path").setRoot(__dirname);
let utils = require("map-path")("Utils");
let config = require("map-path")("Services/config.js");
let nodepath = require("path");
let configUrl = config.configUrl;

program.version("1.0.0", "-v, --version");

let readConfig = function() {
  return new Promise((resolve, reject) => {
    fs.readJson(configUrl)
      .then(obj => {
        resolve(obj);
      })
      .catch(() => {
        resolve();
      });
  });
};

let checkConfig = function() {
  let { data, jump } = this;
  return new Promise((resolve, reject) => {
    if (typeof data === "object") {
      // let path = data.path;
      resolve();
    } else {
      jump("parse");
    }
  });
};

let useExtra = function() {
  let { store } = this;
  let url = store.config.path;
  return new Promise((resolve, reject) => {
    let newUrl = nodepath.join(url, "cmds");
    fs.stat(newUrl, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      if (!stats.isDirectory()) {
        reject("must directory");
        return;
      }
      fs.readdir(newUrl, (err, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(files);
      });
    });
  });
};

let parseExtra = function() {
  let { store, data } = this;
  let url = store.config.path;
  return new Promise((resolve, reject) => {
    for (let ph of data) {
      let path = nodepath.join(url, "cmds", ph);
      try {
        let config = require(path);
        let { options, name, action } = config;

        let out = program.command(`${name} <arg>`);

        options.forEach((opt, ind) => {
          let ar = opt.split("=");
          let o = ar[0];
          let detail = ar[1] || o;
          out = out.option(`-${o},--${detail} <opt>`, `${detail}`);
        });
        out.action(action);
      } catch (e) {
        // reject(e);
        utils.consoleNo(e);
      }
    }
    resolve();
  });
};

let parse = function() {
  program
    .command("config <url>")
    // .option("-r, --recursive <dir>", "Remove recursively")
    .action(function(url, cmd) {
      require("map-path")("Tasks/config.js")(url)
        .then(msg => {
          utils.consoleYes(msg);
        })
        .catch(err => {
          utils.consoleNo(err);
        });
    });

  program
    .command("sub <arg>")
    .option("-o, --opt <option>", "config options")
    .option("-f, --file <option>", "get task file via url")
    .action(function(arg, allOption) {
      require("map-path")("Tasks/sub.js")(arg, {
        file: allOption.file,
        option: allOption.opt
      })
        .then(msg => {
          utils.consoleYes(msg);
        })
        .catch(err => {
          utils.consoleNo(err);
        });
    });
  return;
};

utils
  .branch([
    { callback: readConfig, name: "config" },
    { callback: checkConfig },
    { callback: useExtra },
    { callback: parseExtra },
    { callback: parse, name: "parse" }
  ])
  .then(data => {
    program.parse(process.argv);
  })
  .catch(err => {
    utils.consoleNo(err);
  });
