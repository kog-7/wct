const nodepath=require("path");
const utils=require("../utils.js");
const fs=require("fs-extra");

let readConfig=function(name){
  return new Promise((resolve,reject)=>{
    fs.readJson(nodepath.join(__dirname,"../../config.json"))
    .then((obj)=>{
      // let path=nodepath.join(obj.path,name);
      let configUrl=nodepath.join(obj.path,'config.json');
      let path=nodepath.join(obj.path,'store',name);
      resolve({path,configUrl,root:obj.path});
    })
    .catch((err)=>{
    reject(`do not have config by use wct config.errMsg:${err}`);
    })
  });
};

let parseConfig=function(){
  let msg=this;
  return new Promise((resolve,reject)=>{
      let configUrl=msg.configUrl;
      fs.readJson(configUrl)
      .then((obj)=>{
        msg.config=obj;
        resolve(msg);
      })
      .catch((err)=>{
        msg.config={};//暂时不报错误
        resolve(msg);
      })
  });
}




let promise_infoStore=(name='')=>{
return new Promise((resolve,reject)=>{
let loop=utils.branch();
loop
.setError((err)=>{
  utils.noLog(err);
})
.setCallback((config)=>{
  resolve(config);
})
.get(readConfig,name)
.get(parseConfig)
.run();

});

}
module.exports=promise_infoStore;
