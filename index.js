#!/usr/bin/env node

var program = require("commander");
let fs = require("fs-extra");
let cwd=process.cwd();
let innerCmds=[
  'where','config','sub'
]


require("map-path").setRoot(__dirname);
let utils = require("map-path")("Utils");
let config = require("map-path")("Services/config.js");
let nodepath = require("path");
let configUrl = config.configUrl;
let commandType=process.argv[2];
program.version("1.0.0", "-v, --version");


let transformOption=(vals)=>{
if(vals===undefined){
  return [];
}
let out=[];
out=vals.split(',');
return out;
};


let readConfig = function() {
  return new Promise((resolve, reject) => {

    fs.readJson(configUrl)
      .then(obj => {
        if(utils.ifEmptyObject(obj)){
          resolve();
        }
        else{
          resolve(obj);
        }
        
      })
      .catch((e) => {
        resolve();
      });
  });
};

let checkConfig = function() {
  let { data, jump } = this;

 
  return new Promise((resolve, reject) => {

   if(['sub','config'].indexOf(commandType)!==-1){
      jump('parse');
      return;
    }

    if (typeof data === "object") {
      // let path = data.path;
      resolve();
    } else {
      jump("parse");
    }
  });
};

let useExtra = function() {//read extra cmds,first read files
  let { store ,jump} = this;
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
  let url = store.config.path;//配置的信息

  return new Promise((resolve, reject) => {
    for (let ph of data) {
   
      let path = nodepath.join(url, "cmds", ph);
      try {
        let config = require(path);
        let { options=[], name, action } = config;

        if(innerCmds.indexOf(name)!==-1){
          continue;
        }

        let out = program.command(`${name} [args...]`);

        options.forEach((opt, ind) => {//
          let ar = opt.split("=");
          let o = ar[0];
          let des=ar[1]||'';
          out = out.option(`-${o},--${o} [opts]`, `${des}`,transformOption);
        });


        let res=out.action(action);
    
        // if(typeof res==="object"&&typeof res.then==='function'){
        //   res
        //   .then((info)=>{
        //     console.log(info,123)
        //     if(typeof info==="string"){
        //       utils.consoleYes(info);
        //     }
        //   })
        //   .catch((e)=>{
        //     utils.consoleNo(e);
        //   });
        // }
        // else if(typeof res==="string"){
        //   utils.consoleYes(res);
        // }



      } catch (e) {
        // reject(e);
        utils.consoleNo(e);
      }
    }
    resolve();
  });
};

let parse = function() {
 let {store}=this;
 let config=store.config;


  program
    .command("config [args]")
    .action(function(args=[]) {
      let url=args[0];
      require("map-path")("Tasks/config.js")(url)
        .then(msg => {
          utils.consoleYes(msg);
        })
        .catch(err => {
          utils.consoleNo(err);
        });
    });



  program
    .command("where")
    .action(function(args=[]) {
      if(typeof config==="object"){
        utils.consoleYes(`store in ${config.path}`);
      }
    });



  program
    .command("sub [args...]")
    .option("-o, --option [opts]", "config options",transformOption)
    // .option("-f, --file [opts]", "get task file via url",transformOption)
    // .option("-d, --dir [opts]", "get task dir via url,index.js is root file",transformOption)
    .action(function(args=[], optionObject) {
      if(!config){
        utils.consoleNo('no config path,pls use wct config pathUrl');
        return;
      }
      let name=args[0];
      let dir=args[1]||cwd;
      let {option}=optionObject;
      if(innerCmds.indexOf(name)!==-1){
        utils.consoleNo(`can't sub inner cmds ${name}`);
        return;
      }

      require("map-path")("Tasks/sub.js")(name, {
        dir,
        option: option
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
