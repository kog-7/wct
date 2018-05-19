const fs=require("fs-extra");
const utils=require("../../utils.js");
// let data = require("../../data.js");
let nodepath=require("path");
let promise_infoStore=require("../../services/promise_infoStore.js");
let inquirer=require('inquirer');
let promise_log=require("../../services/promise_log.js");


let rename=function(data){
  // let {cmdStore}=data;
  // let {content}=cmdStore;
  let {cmd,arg}=data;
  let value=cmd[1],cmdType=cmd[0];
  let {rename}=arg;

  return new Promise((resolve,reject)=>{
    promise_infoStore(value)//value是lib名字
    .then((config)=>{
      let path=config.path;
      let aim="";
      if(rename&&rename[0]){aim=utils.renamePath(path,rename[0]);}
      else{
        utils.noLog(`do not set -rename for change name`);
        reject();
        return;
      }

      fs.rename(path,aim,function(err){
        if(err){
          reject(err);
          return;
        }

        utils.yesLog(`rename ${path} to ${aim}`);
        resolve();
      })

    })
    .catch((err)=>{
      reject(err);
    })

  })

};


module.exports=rename;
