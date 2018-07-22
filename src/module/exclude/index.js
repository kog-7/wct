const fs=require("fs-extra");
const utils=require("../../utils.js");
let data = require("../../data.js");
let nodepath=require("path");
let promise_infoStore=require("../../services/promise_infoStore.js");


let exclude=function(){
  let {cmdStore}=data;
  let {content}=cmdStore;
  let {cmd,arg}=content;
  let value=cmd[1],cmdType=cmd[0];
  // let {cover}=arg;
//value如果微all表示所有库都不能包含。。
  let {doc}=arg;//doc包括文件和文件夹
// let excludeDir=dir||directory;

  return new Promise((resolve,reject)=>{
    if(!doc){
      utils.noLog(`you need use -doc to express which dir or file you want to exclude`);
      reject(`you need use -doc to express which dir or file you want to exclude`);
      return;
    }

    if (value === '*') {
      utils.noLog('please use wct exclude all -doc ..,* is not unavailable');
      reject();
      return;
    }


    promise_infoStore()
    .then((config)=>{
      let path=config.configUrl;
      fs.readJson(path)
      .then((obj)=>{
        let exclude=obj.exclude;
        if(!(typeof exclude==="object")){exclude=obj.exclude={};}
        exclude[value]=doc;
        fs.writeJson(path,obj)
        .then(()=>{
          utils.yesLog(`you exclude ${doc} when you push ${value},if doc is all,all lib will exclude ${doc}`);
          resolve();
        })
        .catch((err)=>{
          reject(err);
        });
      })
      .catch((err)=>{
        let obj={
          exclude:{}
        };
        obj.exclude[value]=doc;
        fs.writeJson(path,obj)
          .then(()=>{
            utils.yesLog(`you exclude ${doc} when you push ${value},if doc is all,all lib will exclude ${doc}`);
            resolve();
          })
          .catch((err)=>{
            reject(err);
          });
      })
    })
    .catch((err)=>{
      reject(err);
    })

  })

};


module.exports=exclude;
