const fs=require("fs-extra");
const utils=require("../../utils.js");
let data = require("../../data.js");
let nodepath=require("path");
let inquirer=require('inquirer');
let promise_parseObjectResource=require("../../services/promise_parseObjectResource.js");
let promise_infoStore=require("../../services/promise_infoStore.js");
let promise_log=require("../../services/promise_log.js");
const vm=require('vm');
let argsHandle=require('./argsHandle.js');


let push=function(){

  let loop=utils.branch();

  return new Promise((resolve,reject)=>{//arg wctfile/object/url/cover
    let {cmdStore}=data;
    let {content}=cmdStore;
    let {cmd,arg}=content;
    let value=cmd[1],cmdType=cmd[0];
    let {cover=[false],exclude=[],des=[''],commit=[''],type=[null],append=[false],part=false,wrap=[false]}=arg;
    cover=cover[0];
    append=append[0];
    wrap=wrap[0];
    cover=utils.toBoolean(cover);
    append=utils.toBoolean(append);


    let createResource=function(obj){
      return new Promise((res,rej)=>{

        let storeMsg=this;
        let {path,config}=storeMsg;//path表示要上传的路径,config表示全局配置，first表示是否为第一次上传，会检查path里面的目录
        //拿出exclude
        let allExclude=utils.concatExclude(value,exclude,config.exclude);//value为库的名字
        let rename=null;
        let {types,part:partHandle}=argsHandle;
        let typeIndex=utils.objectArrayInclude(types,type[0],'key');



        let  parseObject=(obj,rename)=>{

          promise_parseObjectResource({
            content:obj,
            dist:path,
            exclude:allExclude,
            cover,
            wrap,
            append,
            rename
          })
          .then(()=>{
            promise_log(path,value,cmdType,des[0],commit[0],type[0]);//给文件库value打上日志。
            if(typeof obj==='object'){obj=JSON.stringify(obj);}
            utils.yesLog(`lib ${value} is update`);
            res();
          })
          .catch((err)=>{
            rej(err);
          });
        }


        if(typeIndex!==-1){
          obj=types[typeIndex]
          .change(obj)
          .then((out)=>{
            if(out===false){
              utils.noLog(`there is a error in  type ${type[0]},you need ${types[typeIndex].des}`);
              rej();
            }
            else{
              rename=types[typeIndex].rename;
              parseObject(out,rename);
            }
          })
          .catch((err)=>{
            rej(err);
          })
        }
        else if(part[0]===true||part[0]==='true'){//part 情况存在
          obj=partHandle
          .change(obj)
          .then((out)=>{
            if(out===false){
              utils.noLog(`there is a error in  type ${type[0]},you need ${partHandle.des}`);
              rej();
            }
            else{
              rename=partHandle.rename;
              parseObject(out,rename);
            }
          })
          .catch((err)=>{
            rej(err);
          })

        }
        else{
          parseObject(obj,rename);
        }

      })
    };


    loop
    .setError((err)=>{
      reject(err)
    })
    .setCallback(()=>{
      resolve();
    })



    if(utils.includeKeys(arg,['url'])===false){
      inquirer.prompt([{name:'confirm',choices:['yes','no'],type:'input',message:`are you sure to push current project : ${utils.cwd}?yes/no`}]).then((ans)=>{
        if(ans.confirm==='yes'){
          loop
          .get(promise_infoStore,value)//查询value库的相关信息
          .get(createResource,`url:${utils.cwd}`)//对当前文件进行查询
          .run();
        }
        else{
          return;
        }
      });
    }
    else if(arg.url){//url的-字符问题
      let {url}=arg;//参数值都是数组
      loop
      .get(promise_infoStore,value)//查询value库的相关信息
      .get(createResource,`url:${url[0]}`)//对当前文件进行查询
      .run();
    }
  });

}

module.exports=push;
