const ifs = require('fs-extra');
//直接读取配置文件
const vm = require("vm");
// const pack = require("./pack");
const cwd = process.cwd();
const path = require("path");
// const analyse = require("./analyse");
const chalk = require("chalk");
let utils = require("./utils.js");
let branch=utils.branch;


class Config{
constructor(){
this.configStore = path.join(__dirname, "./config/store.json");
this.dir="";
this.store=null;
this.wctfile=null;
}
readConfig(cb){
 let {configStore}=this;

  ifs.readJson(configStore, (err, obj)=>{
    if (obj && (!obj.storeDir)) {
      console.log(chalk.yellow('please use wct -config yourpath point your store position'));
      return;
    }
    if (err) {
      console.log(err);
      return;
    }
    let dir = obj.storeDir;
    this.dir=dir;
    if(typeof cb==="function"){cb();}
  });
}
readStore(cb){
  let {dir}=this;
  var file = path.join(dir, "/store.js");
  ifs.readFile(file, "utf8", (err, cont)=>{
    if (err) {
      console.log(err);
    }
    var sandbox = {
      gbl: {}
    };
    cont=cont.trim();
    if (cont) {
      vm.createContext(sandbox);
      vm.runInContext(cont, sandbox);
    }
    this.store=sandbox.gbl;
    if(typeof cb==="function"){cb();}
  });
}
readWctfile(cb) {
  let {store,wctfile}=this;
  try {
    //清楚require缓存后读取
    wctfile = require(path.join(cwd, "./wctfile.js"));//读取运行路径下的wctfile文件
  } catch (e) {

  }
  this.wctfile=wctfile;
  if(typeof cb==="function"){cb();}
  // let allStore=Object.assign(store,wctfile);
}
ready(){
return new Promise((resolve,reject)=>{
  let {dir,store,wctfile}=this;
    let that=this;
  if(dir&&store&&wctfile){resolve();}
  else{
    branch()
    .get(function(){
      that.readConfig(this);
    })
    .get(function(){
      that.readStore(this);
    })
    .get(function(){
      that.readWctfile(this);
    })
    .get(function(){
      resolve();
    })
    .run();

  }
});





}

}


let config=new Config();

module.exports = config;
