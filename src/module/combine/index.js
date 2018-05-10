const fs=require("fs-extra");
const utils=require("../../utils.js");
let data = require("../../data.js");
let nodepath=require("path");
let inquirer=require('inquirer');
let promise_parseObjectResource=require("../../services/promise_parseObjectResource.js");
let promise_infoStore=require("../../services/promise_infoStore.js");
let promise_log=require("../../services/promise_log.js");
const vm=require('vm');



let combine=function(){

  let loop=utils.branch();

  return new Promise((resolve,reject)=>{//arg wctfile/object/url/cover
    let {cmdStore}=data;
    let {content}=cmdStore;
    let {cmd,arg}=content;
    let value=cmd[1],cmdType=cmd[0];
    let {cover=[false],exclude=[],des=[''],commit=[''],type=[null]}=arg;
    cover=cover[0];
    cover=utils.toBoolean(cover);



    let createResource=function(obj){

      return new Promise((res,rej)=>{

        let storeMsg=this;
        let {path,config}=storeMsg;

        let allExclude=utils.concatExclude(value,exclude,config.exclude);//value为库的名字
        let rename=null;


        let  parseObject=(obj,rename)=>{
          promise_parseObjectResource({
            content:obj,
            storePath:path,
            dist:utils.cwd,
            exclude:allExclude,
            cover
          })
          .then(()=>{
            if(typeof obj==='object'){obj=JSON.stringify(obj);}
            utils.yesLog(`lib ${value} is update`);
            res();
          })
          .catch((err)=>{
            rej(err);
          });
        }

        parseObject(obj)


      })
    };










    loop
    .setError((err)=>{
      reject(err)
    })
    .setCallback(()=>{
      resolve();
    });







    let wctfileObject={};
    try{
      wctfileObject=require(nodepath.join(utils.cwd,'wctfile.js')).combine;
    }
    catch(e){
      reject(e);
      return;
    }

    var outWctObject=null;
    if(value&&(value in wctfileObject)){
      wctfileObject=wctfileObject[value];
    }



    loop
    .get(promise_infoStore,'')//查询value库的相关信息
    .get(createResource,wctfileObject)//对当前文件进行查询
    .run();





  });

}

module.exports=combine;
