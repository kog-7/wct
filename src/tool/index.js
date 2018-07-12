let fs = require("fs-extra");
let data = require("../data.js");
let nodepath=require("path");
let utils=require('../utils.js');
let inquirer=require('inquirer');

let typeAction=(content)=>{
  //只是以:为分隔符来区分相关内容
  let ind=content.indexOf(':');
  if(ind===-1){
    return false;
  }
  else{
    let lf=content.slice(0,ind),rt=content.slice(ind+1);
    return {
      type:lf,
      content:rt
    }
  }
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



let copyPaste=(copy,to,arg,resolve,reject)=>{
  // to=nodepath.join(to,nodepath.basename(copy));
  let {exclude,cover=[false]}=arg;

  fs.copy(copy,to,{overwrite:cover[0],filter:(sourcePath)=>{
    if((typeof exclude==='object')&&exclude.length>0){
      if(utils.matchArrayItem(exclude,sourcePath,utils.cwd)){
        return false;
      }
      else{
        return true;
      }
    }
    else{
      return true;
    }
  }})
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
  let {cmd,arg}=content;
  let [key,value]=cmd;//cmd是一个2位数组

  return new Promise((resolve, reject) => {
    let out=typeAction(key);



    if(out){
      if(out.type==="rm"){
        inquirer.prompt([{name:'confirm',choices:['yes','no'],type:'input',message:`are you sure to remove ${key}?yes/no`}]).then((ans)=>{
          if(ans.confirm==='yes'){
            utils.yesLog(`waiting...`);
            remove(out.content,resolve,reject);
          }
          else{
            return;
          }
        });
      }
      else if(out.type==="copy"){//使用wct copy:./a to:./b -exclude **/a.js来做
      let toObj=typeAction(value);
      if(toObj&&toObj.type==='to'){
        let copyUrl=out.content;
        let toUrl=toObj.content;
        copyUrl=utils.absPath(copyUrl);
        toUrl=utils.absPath(toUrl);
        copyPaste(copyUrl,toUrl,arg,resolve,reject);
      }
    }
  }
  else if(out===false){
    create(key,resolve,reject);
  }

});
};




module.exports = tool;
