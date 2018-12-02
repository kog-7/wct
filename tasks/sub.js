let nodepath = require("path");
let config = require("map-path")("Services/config.js");
let cwd = process.cwd();
let fs = require("fs-extra");
let utils = require("map-path")("Utils");
let inquirer = require("inquirer");
let configUrl = config.configUrl;

let readConfig = function() {
  return fs.readJson(configUrl);
};

let readCmds = function() {
  let { store } = this;
  let configUrl = store.config.path;
  let cmdUrl = nodepath.join(configUrl, "cmds");
  return new Promise((resolve, reject) => {
    fs.readdir(cmdUrl, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
};

let exportCmds = function() {
  let { store } = this;
  let configUrl = store.config.path;
  let { data: files } = this;
  return new Promise((resolve, reject) => {
    let out = [];
    if (Array.isArray(files)) {
      files.forEach((name, ind) => {
        let cmdUrl = nodepath.join(configUrl, "cmds", name);
        out.push({
          callback: function() {
            return new Promise((resolve, reject) => {
              fs.stat(cmdUrl, (err, stats) => {
                if (err) {
                  reject(err);
                  return;
                }
                if (!stats.isFile()) {
                  reject(`${cmdUrl} is not file format`);
                  return;
                }

                try {
                  let config = require(cmdUrl);
                  resolve(config);
                } catch (e) {
                  reject(e);
                  return;
                }
              });
            });
          }
        });
      });
    }

    utils
      .branch(out)
      .then(({ store }) => {
        let out = [];
        for (let i in store) {
          out.push(store[i].name);
        }
        resolve(out);
      })
      .catch(err => {
        utils.consoleNo(err);
        reject();
      });
  });
};

let validCommand = function(commandName, url) {
  let { store, data } = this;
  let configUrl = store.config.path;

  return new Promise((resolve, reject) => {
    if (data.indexOf(commandName) !== -1) {
      inquirer
        .createPromptModule()([
          {
            name: "confirm",
            type: "input",
            message: `${commandName} is exit , cover it?`
          }
        ])
        .then(ans => {
          let conf = ans.confirm;
          if (conf === "yes") {
            resolve();
          } else {
            reject();
          }
        });
    } else {
      resolve();
    }
  });
};

let validContent = function(commandName, url) {
  return new Promise((resolve, reject) => {
    fs.stat(url, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      if (!stats.isFile()) {
        reject(`task ${url} must file`);
        return;
      }
      resolve();
    });
  });
};

let createCmd = function(commandName, optionArr = []) {
  let { store } = this;
  let configUrl = store.config.path;

  let newConfigUrl = configUrl.replace(/\\/gm, () => {
    return "\\" + "\\";
  });

  let cmd = `
      let nodepath=require('path');
      module.exports={
      options:${JSON.stringify(optionArr)},
      name:"${commandName}",
      action:function(arg,options){
      let url=nodepath.join('${newConfigUrl}','tasks',"${commandName}","index.js");
      return new Promise((resolve,reject)=>{
        
      try{
        require(url)(arg,options)
        .then((data)=>{
          resolve(data);
        })

      }
      catch(e){
        reject(e);
      }

      })
      }
      };
      `;

  let url = nodepath.join(configUrl, "cmds", commandName) + ".js";
  let { data: names } = this;
  return new Promise((resolve, reject) => {
    fs.writeFile(url, cmd, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

let createTask = function(commandName, url) {
  let { store } = this;
  let configUrl = store.config.path;
  //url must file
  return new Promise((resolve, reject) => {
    let copyUrl = nodepath.join(configUrl, "tasks", commandName, "index.js");
    fs.copy(url, copyUrl)
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
};

function sub(arg, allOption) {
  let { file, option } = allOption;
  let commandName = arg;
  return new Promise((resolve, reject) => {
    if (!commandName) {
      reject(`must sub a command name`);
      return;
    }
    let arr = [];

    if (typeof option === "string") {
      arr = option.split("+");
    }

    utils
      .branch([
        { callback: readConfig, name: "config" },
        { callback: readCmds },
        { callback: exportCmds },
        { callback: validCommand, props: [commandName, arr] },
        { callback: validContent, props: [commandName, file] },
        { callback: createCmd, props: [commandName, arr] },
        { callback: createTask, props: [commandName, file] }
      ])
      .then(data => {
        resolve(`${commandName} is configed`);
      })
      .catch(err => {
        if (err) {
          utils.consoleNo(err);
        }
      });
  });
}

module.exports = sub;
