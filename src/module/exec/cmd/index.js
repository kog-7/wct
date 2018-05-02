const fs=require("fs-extra");
const utils=require("../../../utils.js");
const exec = require('child_process').exec;
let nodepath=require("path");


let run=function(url,resolve,reject,arg){
  let {cover=[false],port=[8090],open=[true],type,browser=''}=arg;
  fs.readJson(url)
  .then(function(arr){
    if(!Array.isArray(arr)==='array'){
      utils.noLog(`format in ${url} must be array,the right format is [{name:'webname',des:'xxx',link:'https://...'}]`);
      return;
    }

    let loop=utils.branch().setCallback(function(){
      utils.yesLog(`all cmd run over`);
    });

    arr.forEach((cmd,ind)=>{
      if(!(typeof cmd==='object')){
        utils.noLog(`${cmd} must be a object maybe like {cmd:'start https://google.com'}`);
        return;
      }
      let cmder=cmd.cmd;

      loop.get(()=>{
        return new Promise((resolve,reject)=>{

          exec(`${cmder}`,function(err,msgOut,errOut){
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

          setTimeout(function () {
            utils.yesLog(`${cmder} runed`);
            resolve();
          }, 2800);

        });
      });

    });



    loop.run();

  })
  .catch(function(err){
    utils.noLog(`config info in ${url} has error`);
    console.log(err);
  });


};


module.exports=run;
