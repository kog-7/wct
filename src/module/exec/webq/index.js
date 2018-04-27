const fs=require("fs-extra");
const utils=require("../../../utils.js");

let nodepath=require("path");
let browserSync=require('browser-sync').create();


let run=function(url,resolve,reject,arg){
  let {cover=[false],port=[8090],open=[true],type}=arg;
      fs.readJson(url)
      .then(function(arr){
        if(!Array.isArray(arr)==='array'){
          utils.noLog(`format in ${url} must be array,the right format is [{name:'webname',des:'xxx',link:'https://...'}]`);
          return;
        }

        fs.writeFile(nodepath.join(__dirname,'./webapp/config.js'),`window.webqConfig=${JSON.stringify(arr)}`,function(err){
          if(err){
            reject(err);
            return;
          }
          else{
            browserSync.init({
              port:port[0],
              open:open[0],
              server:{
                baseDir:nodepath.join(__dirname,'./webapp'),
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


};


module.exports=run;
