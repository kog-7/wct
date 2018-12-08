let nodepath = require("path");
let config = require("map-path")("Services/config.js");
let cwd = process.cwd();
let fs = require("fs-extra");
let utils = require("map-path")("Utils");
let inquirer = require("inquirer");
let configUrl = config.configUrl;
const spawn = require('cross-spawn');
var commandExists = require('command-exists');
const rimraf = require('rimraf');
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
    if (out.length === 0) {
      resolve(out);
      return;
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
            message: `${commandName} is exit , cover it? yes/no`
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
        // console.log(err,999)
        reject(err);
        return;
      }
      if (!stats.isFile()&&!stats.isDirectory()) {
        reject(`task ${url} must file or dir`);
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

let createTaskByDir=function(commandName,url){
 let { store } = this;
  let configUrl = store.config.path;
  //url must file
  return new Promise((resolve, reject) => {

    let copyUrl = nodepath.join(configUrl, "tasks", commandName);
    let rootFile = nodepath.join(url,'index.js');
    let rootStates=fs.statSync(rootFile);
    if(!rootStates.isFile()){
      reject('no index.js');
      return;
    }

    fs.copy(url, copyUrl)
      .then(() => {
        try{
        let stats=fs.statSync(nodepath.join(copyUrl,'package.json'));
        if(stats.isFile()){
          utils.consoleYes('npm install start');
        spawn.sync('rm',['-rf','./node_modules'],{cwd:copyUrl});
      rimraf.sync(nodepath.join(copyUrl,'node_modules'));
// console.log(99)

        

        // if (commandExists.sync('yarnpkg')) {
        //   spawn.sync('yarnpkg', [ 'add'], { stdio: 'inherit',cwd: copyUrl });
        // } else {
          spawn.sync('npm', ['install', '--save',
        '--save-exact',
        '--loglevel',
        'error'], { stdio: 'inherit',cwd: copyUrl });
        // }
          
          
        }
        }
        catch(e){
         
        }
        resolve();
      })
      .catch(err => {
        reject(err);
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
        let out=require(url)(arg,options);
        if(typeof out==="object"&&typeof out.then==="function"){
          out.then((data)=>{
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })

        }
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








function sub(arg, allOption) {
  let { file, option,dir} = allOption;
  let commandName = arg;
  if(dir===true){dir='./';}
  return new Promise((resolve, reject) => {
    if (!commandName) {
      reject(`must sub a command name`);
      return;
    }

if(typeof file==="string"){


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
        { callback: createTask, props: [commandName, file] },
        { callback: createCmd, props: [commandName, arr] },
        
      ])
      .then(data => {
        resolve(`${commandName} is configed`);
      })
      .catch(err => {
        if (err) {
          utils.consoleNo(err);
        }
      });
}
else if(typeof dir==="string"){

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
        { callback: validContent, props: [commandName, dir] },
        { callback: createTaskByDir, props: [commandName, dir] },
        { callback: createCmd, props: [commandName, arr] },
        
      ])
      .then(data => {
        resolve(`${commandName} is configed`);
      })
      .catch(err => {
        if (err) {
          utils.consoleNo(err);
        }
      });

}



  });
}

module.exports = sub;
