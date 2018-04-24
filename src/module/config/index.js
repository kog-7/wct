const fs=require("fs-extra");
const utils=require("../../utils.js");
let data = require("../../data.js");
let nodepath=require("path");

let config=function(){
  return new Promise((resolve,reject)=>{
    let {cmdStore}=data;
    let {content}=cmdStore;
    let {cmd,arg}=content;
    let value=utils.absPath(cmd[1]);
    let loop=utils.branch();
    let nowConfigPath=nodepath.join(__dirname,"../../../config.json");
    loop
    .setCallback((obj)=>{//config to aim dir store dir
      let newObj=Object.assign({},obj);
      // newObj.path=nodepath.join(newObj.path,"store");
     fs.writeJson(nowConfigPath,newObj)
     .then(()=>{utils.yesLog(`${obj.path} is configed,the data will store in ${obj.path}`);resolve()})
     .catch((err)=>{reject(err)});
   })
    .setError((err)=>{
      reject(err);
    })
    .get(utils.branch_readJson,nowConfigPath)
    .get(function(ph){
      let obj=this;
      return new Promise((res,rej)=>{
        let newPath=obj.path=nodepath.normalize(ph);
        utils.yesLog(`notice:${newPath} will store your push content,it will not be covered if you config same directory again`);
        utils.branch_stat(newPath)
        .then((type)=>{
          if(type==="file"){rej(`${newPath} is a exit file,must config directory`);}
          else{
            fs.copy(nodepath.join(__dirname,"../../../storeConfig"),newPath,{overwrite:false})//不覆盖复制
            .then(()=>{
              res(obj);
            })
            .catch(()=>{
              res(obj);//也会下去
            })
          }
        })
        .catch(()=>{//错误表示没有文件，这一块后面改成async
          fs.copy(nodepath.join(__dirname,"../../../storeConfig"),newPath,{overwrite:false})
          .then(()=>{
            res(obj);
          })
          .catch(()=>{
            res(obj);//也会下去
          })
        })
      });
    },value);



    utils.branch_ifFile(nowConfigPath)
    .then(()=>{
      loop.run();
    })
    .catch((err)=>{
      utils.branch_writeFile(nowConfigPath,'{}')
      .then(()=>{
        loop.run();
      })
      .catch((err)=>{
        reject(err);
      })
    });





  });



};


module.exports=config;
