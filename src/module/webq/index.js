const fs=require("fs-extra");
const utils=require("../../utils.js");
let data = require("../../data.js");
let nodepath=require("path");
let promise_infoStore=require("../../services/promise_infoStore.js");
let inquirer=require('inquirer');
let promise_log=require("../../services/promise_log.js");
let browserSync=require('browser-sync').create();


let pull=function(){
  let {cmdStore}=data;
  let {content}=cmdStore;
  let {cmd,arg}=content;
  let value=cmd[1],cmdType=cmd[0];
  let {nowrap,rename,cover=[false],port=[8090],open=[true]}=arg;
  cover=cover[0];
  cover=utils.toBoolean(cover);
  return new Promise((resolve,reject)=>{
    promise_infoStore(value)//value是lib名字
    .then((config)=>{
      let path=config.path;
      
      let url=nodepath.join(path,'webq.json');


      fs.readJson(url)
      .then(function(arr){
        if(!Array.isArray(arr)==='array'){
          utils.noLog(`format in ${url} must be array,the right format is [{name:'webname',des:'xxx',link:'https://...'}]`);
          return;
        }

        fs.writeFile(nodepath.join(__dirname,'./__webqStatic/config.js'),`window.webqConfig=${JSON.stringify(arr)}`,function(err){
          if(err){
            reject(err);
            return;
          }
          else{

            browserSync.init({
              port:port[0],
              open:open[0],
              server:{
                baseDir:nodepath.join(__dirname,'./__webqStatic'),
                index:'index.html'
              }
            });
            utils.yesLog(`${port[0]} is opened for webq`);
            utils.msgLog(`some website use X-Frame-Options which not let iframe,you can use iframe allow plugin in you browser`);
            resolve();
          }

        });

      })
      .catch(function(err){
        utils.noLog(`config info in ${url} has error`);
        console.log(err);
      });


    })
    .catch((err)=>{
      reject(err);
    })

  })

};


module.exports=pull;
