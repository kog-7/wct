let ifs = require("fs-extra");
let path = require("path");
//不需要在wctfile里面定义的命令
let data=require("./data.js");
let utils = require('./utils.js');

//配置路径
let configStore = path.join(__dirname,"./config/store.json");
let cwd = process.cwd();

let branch=utils.branch;

// {name:"config",action:writeConfigStore,cmd:/(-config)|(--config)/g},
let writeConfigStore = function() {
  let url = data.get('name')[0];

  url=path.join(cwd,path.relative(cwd,url));




  let createConfig = function(cb) {
    ifs.ensureFile(path.join(url, "store.js"), function(err) {
      if (err) {
        console.log(err);
      } else {
        cb();
      }
    });
  };

  let read = function(cb) {
    ifs.readJson(configStore, "utf8", function(err, obj) {
      if (err) {
        // console.log(err);
        // return;
        console.log(`fix ${configStore} error`);
      }
      if(!obj){obj={};}
      obj.storeDir = url;

      cb(obj);
    });
  }

  let write = function(obj) {
    ifs.writeJson(configStore, obj, function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(url + " is configed,your file will send to " + url);
        return;
      }
    });
  };


  branch()
  .get(function(){
    createConfig(this)
  })
  .get(function(){
    read(this);
  })
  .get(function(obj){
    write(obj);
  })
  .run();
};


module.exports = {
  config:writeConfigStore
};
