const fs=require("fs-extra");
const utils=require("../../utils.js");
// let data = require("../../data.js");
let nodepath=require("path");
let promise_infoStore=require("../../services/promise_infoStore.js");
let inquirer=require('inquirer');
let promise_log=require("../../services/promise_log.js");
let pull=function(data){
  // let {cmdStore}=data;
  // let {content}=cmdStore;
  let {cmd,arg}=data;
  let value=cmd[1],cmdType=cmd[0];
  let {wrap,rename,cover=[false]}=arg;
  cover=cover[0];
  cover=utils.toBoolean(cover);
  return new Promise((resolve,reject)=>{
    promise_infoStore(value)//value是lib名字
    .then((config)=>{
      let path=config.path;
      let aim=utils.cwd;
      let rootValue=value.split("/")[0];
      // if(wrap&&wrap[0]){aim=nodepath.join(aim,wrap[0]);}//包裹一层
      if(!wrap||wrap[0]!=='false'){
        aim=nodepath.join(aim,rootValue);
      }
      let basename=nodepath.basename(path);
      if(basename.indexOf('.')!==-1){
        aim=nodepath.join(aim,basename);
      }
      if(rename&&rename[0]){aim=utils.renamePath(aim,rename[0]);}

      fs.copy(path,aim,{overwrite:cover,filter:(ph)=>{
        let bpath=nodepath.basename(ph);
        if(bpath===".wctconfig.json"||bpath==="__webqStatic"){
          return false;
        }
        else{return true;}
      }},function(err){
        if(err){
          reject(err);
          return;
        }
        promise_log(nodepath.join(config.root,'store',rootValue),value,cmdType);
        utils.yesLog(`pull ${path} to ${aim}`);
        resolve();
      })

    })
    .catch((err)=>{
      reject(err);
    })

  })

};


module.exports=pull;
