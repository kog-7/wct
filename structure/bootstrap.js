let data=require("./data.js");
let feature=require("./feature");
//功能类
let configDeal=require('./configHandle.js');
let extraCommandDeal=require('./extraCommand.js');
let commandDeal=require('./command.js');

let configRun=require("./config.js");
let tips = require("./lib/tips/index.js");


module.exports=()=>{
  let type=data.get("type");
  let name=data.get("name");
  let {base,config,extra}=feature;

  if(!type){//如果只是小工具使用
      tips(name[0]);
      return;
  }

  //配置的内容
  config.forEach((obj,ind)=>{
    let {cmd,name:actionName}=obj;
    if(cmd.test(type)){
      configDeal[actionName]();
    }
  });


  //额外命令行的内容,再config准备好的时候才运行。被运行的内容，依赖config
  extra.forEach((obj,ind)=>{
    let {cmd,name:actionName}=obj;
    if(cmd.test(type)){
      configRun.ready().then(()=>{
        extraCommandDeal[actionName]();
      });
    }
  });

  //基础命令内容
  base.forEach((obj,ind)=>{
    let {cmd,name:actionName}=obj;
    if(cmd.test(type)){
      configRun.ready().then(()=>{
        commandDeal[actionName]();
      });
    }

  });


}
