let utils=require("../utils.js");
let nodepath=require("path");


let create=()=>{

  let path=nodepath.join(utils.cwd,'wctfile.js');
  let dir=nodepath.basename(utils.cwd);

  return new Promise((resolve,reject)=>{
    let loop=utils.branch();
    utils.branch_ifFile(path).then(()=>{
      utils.noLog('wctfile.js is exited');
    })
    .catch(()=>{//如果不是file
      utils.branch_writeFile(path,`module.exports={push:{\n//${dir}:'url(./)'}\n}};`).then(()=>{
          resolve();
        }).catch((err)=>{
          reject(err)
        })
      });

    });

  };



  module.exports=create;
