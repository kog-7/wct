const fs=require("fs-extra");
const utils=require("../../utils.js");
// let data = require("../../data.js");
let nodepath=require("path");
let promise_infoStore=require("../../services/promise_infoStore.js");
let inquirer=require('inquirer');

let link=function(data){
  // let {cmdStore}=data;
  // let {content}=cmdStore;
  let {cmd,arg}=data;
  let value=cmd[1],cmdType=cmd[0];
  let {wrap,rename}=arg;
  return new Promise((resolve,reject)=>{
    promise_infoStore(value)//value是lib名字
    .then((config)=>{

      let path=config.path;
      let aim=utils.cwd;

      if(wrap&&wrap[0]){aim=nodepath.join(aim,wrap[0]);}//包裹一层
      if(rename&&rename[0]){aim=utils.renamePath(aim,rename[0]);}

      fs.symlink(path,aim,function(err){
        if(err){
          reject(err);
          return;
        }
        resolve();
      })

    })
    .catch((err)=>{
      reject(err);
    })

  })

};


module.exports=link;
