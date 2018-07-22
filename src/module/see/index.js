const fs=require("fs-extra");
const utils=require("../../utils.js");
let data = require("../../data.js");
let nodepath=require("path");
let promise_infoStore=require("../../services/promise_infoStore.js");
let inquirer=require('inquirer');

let pull=function(){
  let {cmdStore}=data;
  let {content}=cmdStore;
  let {cmd,arg}=content;
  let value=cmd[1],cmdType=cmd[0];
  let {wrap,rename,cover=false,filter=[],f=[]}=arg;
  filter=filter[0]||f[0];
  return new Promise((resolve,reject)=>{
    promise_infoStore()//value是lib名字
    .then((config)=>{

    if (value === '*') {
      utils.noLog('please use wct see all,* is not unavailable');
      reject();
      return;
    }

      if(value==="all"){
        let path=config.path;
        fs.readdir(path,function(err,files){
          if(err){
            reject(err);
          }
          else{
            let str="";
            utils.yesLog(`you have ${files.length} lib total,as follows:\n`);
            for(let i in files){
              let fil=files[i];
              if(filter){
                let reg=new RegExp(filter,'gm');
                if(!reg.test(fil)){continue;}
              }

              fs.readJson(nodepath.join(path,fil,'.wctconfig.json'))
                .then((obj)=>{
                  console.log(`lib:${fil}  description:${obj.description||'no des'}  last action:${JSON.stringify(obj.log[obj.log.length-1])}`);
                })
                .catch((err)=>{
                  console.log(`lib:${fil}`);
                })
            }
            resolve();
          }
        })
      }
      else if(value==='exclude'){
        let path=config.configUrl;
        fs.readJson(path)
        .then((obj)=>{
          let str="";
          let ex=obj.exclude;
          for(let i in ex){
            str+="lib:"+i+" exclude > "+ex[i].join(",")+"\n  ";
          }
          console.log(`you have exclude:\n ${str}`);
          resolve();
        })
        .catch((err)=>{
          reject(err);
        })
      }
      else if(value==='store'){
          console.log(`you have store: ${config.path}`);
          resolve();
      }
      else{
        utils.noLog(`can use wct see all or wct see exclude`);
        reject();
      }
    })
    .catch((err)=>{
      reject(err);
    })
  })
};


module.exports=pull;
