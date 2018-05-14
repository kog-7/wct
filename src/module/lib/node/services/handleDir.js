//
// const fs=require("fs-extra");
// let nodepath=require("path");
let utils=require("../utils.js");
const explore=utils.explore;


let promise_parseObjectResource=(opt)=>{
  return new Promise((resolve,reject)=>{
    let {done=function(){},root,process,fail=function(){}}=opt;
    if(!root){
      utils.noLog(`no root:${root} dir`);
      return;
    }
      let exp=new explore();
      exp.setCallback(done);
      exp.setError(fail);
    
      //rename用于特殊的push type，主要针对单file类型,转为固定可以被识别的文件名
      exp.parse(process).run({input:{root}});
    });

  };




  module.exports=promise_parseObjectResource;
