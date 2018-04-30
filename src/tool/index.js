let fs = require("fs-extra");
let data = require("../data.js");
let nodepath=require("path");
let utils=require('../utils.js');
let inquirer=require('inquirer');

let typeAction=(content)=>{

  if(content.indexOf('rm:')===0){
    return {
      type:'remove',
      content:content.slice(3)
    }
  }
  else if(content.indexOf("copy:")===0){
    if(content.indexOf("=")!==-1){
      let toIndex=content.indexOf("to:");
      return {
        type:'copy',
        content:{
          copy:content.slice(5,toIndex-1),
          to:content.slice(toIndex+3)
        }
      }
    }
    else{
      utils.noLog(`${content} syn error`);
      return null;
    }
  }
  return false;
};

let create=(content,resolve,reject)=>{
  if (nodepath.basename(content).indexOf('.') === -1) {
    fs.ensureDir(content)
    .then(() => {
      utils.yesLog(`${content} is created`)
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  } else {
    fs.ensureFile(content)
    .then(() => {
      utils.yesLog(`${content} is created`)
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  }
}

let remove=(content,resolve,reject)=>{
  utils.branch_stat(content).then(()=>{
    fs.remove(content).then(()=>{
      utils.yesLog(`${content} is removed`);
      resolve();
    })
    .catch((err)=>{
      reject(err);
    })
  })
  .catch((err)=>{
    utils.noLog(`${JSON.stringify(err)} happen`);
  });
}

let copyPaste=(copy,to,resolve,reject)=>{
to=nodepath.join(to,nodepath.basename(copy));

  fs.copy(copy,to)
  .then(()=>{
    utils.yesLog(`${copy} is copy to ${to}`);
    resolve();
  })
  .catch((err)=>{
    reject(err);
  });


};

let tool = () => {
  let { cmdStore } = data;
  let { content } = cmdStore;
  return new Promise((resolve, reject) => {
    let out=typeAction(content);
    if(out){
      if(out.type==="remove"){
        inquirer.prompt([{name:'confirm',choices:['yes','no'],type:'input',message:`are you sure to remove ${content}?yes/no`}]).then((ans)=>{
          if(ans.confirm==='yes'){
            utils.yesLog(`waiting...`);
            remove(out.content,resolve,reject);
          }
          else{
            return;
          }
        });
      }
      else if(out.type==="copy"){
        copyPaste(out.content.copy,out.content.to,resolve,reject);
      }
    }
    else if(out===false){
      create(content,resolve,reject);
    }
  });
};




module.exports = tool;
