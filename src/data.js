let utils=require('./utils.js');
let {cmdParse}=utils;
let fs=require("fs-extra");
let nodepath=require("path");



//data控制整个

let data={
  cmdStore:null,
  configStore:null,
  feature:['config','exclude','link','pull','push','remove','see','rename','exec'],
  readCmd(arg){
    return new Promise((resolve,reject)=>{
      if(this.cmdStore){resolve();}
      else{
        let type=cmdParse.type(arg);
        let res=null;
        if(type==='multiple'){
          res=cmdParse.parse(arg);
        }
        else if(type==='1'){
          res=arg[0];
        }
        let cmdStore= {
          type,content:res
        }
        this.cmdStore=cmdStore;
        resolve(cmdStore);
      }
    });
  },
  readConfig(arg){
    return new Promise((resolve,reject)=>{
      let path=nodepath.join(utils.cwd,'wctfile.js');
      let loop=utils.branch();
      loop.get(utils.branch_ifFile,path)
      .setCallback(()=>{
        let config=require(path);
        this.configStore=config;
        resolve(config);
      })
      .setError(()=>{
        utils.noLog(`do not have wctfile.js in ${utils.cwd}`);
        reject();
      })
      .run();
    });
  }
}

module.exports=data;
