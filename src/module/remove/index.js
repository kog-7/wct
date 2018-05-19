const fs=require("fs-extra");
const utils=require("../../utils.js");
// let data = require("../../data.js");
let nodepath=require("path");
let promise_infoStore=require("../../services/promise_infoStore.js");
let inquirer=require('inquirer');

let remove=function(data){
  // let {cmdStore}=data;
  // let {content}=cmdStore;
  let {cmd,arg}=data;
  let value=cmd[1],cmdType=cmd[0];

  return new Promise((resolve,reject)=>{
    promise_infoStore(value)//value是lib名字
    .then((config)=>{
      let path=config.path;

      utils.branch_stat(path)
      .then((type)=>{
        inquirer.prompt([{name:'confirm',choices:['yes','no'],type:'input',message:`are you sure to remove lib ${value} in ${path}?yes/no`}]).then((ans)=>{
          if(ans.confirm==='yes'){
            fs.remove(path)
            .then(()=>{
              utils.yesLog(`lib ${value} is removed`);
              resolve();
            })
            .catch((err)=>{
              reject(err);
            })
          }
          else{
            return;
          }
        });
      })
      .catch((err)=>{
          utils.noLog(`lib ${value} is not exist`);
        reject(err);
      })





    })
    .catch((err)=>{
      reject(err);
    })

  })

};


module.exports=remove;
