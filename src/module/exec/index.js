const fs=require("fs-extra");
const utils=require("../../utils.js");
let data = require("../../data.js");
let nodepath=require("path");
let promise_infoStore=require("../../services/promise_infoStore.js");



let feature=[
'webq',
'cmd'
];

let exec=function(){
  let {cmdStore}=data;
  let {content}=cmdStore;
  let {cmd,arg}=content;
  let value=cmd[1],cmdType=cmd[0];
  let {nowrap,rename,cover=[false],type=[]}=arg;
  cover=cover[0];
  cover=utils.toBoolean(cover);
  return new Promise((resolve,reject)=>{

      if(feature.indexOf(type[0])===-1){
        utils.noLog(`not support type ${type}`);
        reject();
        return;
      }

    promise_infoStore(value)//value是lib名字
    .then((config)=>{//path为相关文件的位置。
      let path=config.path;//取到相关
      let url=nodepath.join(path,`${type}.json`);
      let execFun=require(`./${type}/index.js`);
      execFun(url,resolve,reject,arg);
    })
    .catch((err)=>{
      reject(err);
    })

  })

};


module.exports=exec;
