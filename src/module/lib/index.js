const fs=require("fs-extra");
const utils=require("../../utils.js");
let data = require("../../data.js");
let nodepath=require("path");
let promise_infoStore=require("../../services/promise_infoStore.js");
let inquirer=require('inquirer');
const exec = require('child_process').exec;



let lib=function(){
  let {cmdStore}=data;
  let {content}=cmdStore;
  let {cmd,arg}=content;
  let value=cmd[1],cmdType=cmd[0];
  let {wrap,rename,browser=[]}=arg;
  return new Promise((resolve,reject)=>{


    promise_infoStore()//value是lib名字
    .then((config)=>{

      if(value==='*'){
        let path=config.path;
        if(!path){
          utils.noLog(`no config store path or store path is not variable`);
          reject();
        };


        let execOb=exec(`node ${nodepath.join(__dirname,'./node/bin/www')} ${path} ${browser}`,function(err,msgOut,errOut){
          if(err){
            console.log(err);
          }
          if(msgOut){
            console.log(msgOut);
          }
          if(errOut){
            console.log(errOut);
          }

        });

        execOb.stdout.on('data', function(data) {
            console.log(data);
        });



      }
      else {
        utils.noLog(`${value} can't be use ,use * to open`);
        reject();
      }


    })
    .catch((err)=>{
      reject(err);
    })
  })
};


module.exports=lib;
