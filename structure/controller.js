const ifs = require('fs-extra');
//直接读取配置文件
const vm = require("vm");
// const pack = require("./pack");
const cwd = process.cwd();
const path = require("path");
const analyse = require("./analyse");
const feature = require("./feature");
// const util = require('util');
const chalk=require("chalk");
var utils = require("./utils.js");
var cmdParse = require("./lib/tool/cmdParse.js");
// var storeDir="../../wct_store890/data";

var configHandle=require("./configHandle.js");

var configStore = path.join(__dirname,"./config/store.json");

var miniExtend = function(aob, ob) {
    var i = null;
    for (i in ob) {
        if (!(i in aob)) {
            aob[i] = ob[i];
        }
    }
    return aob;
}

var runSandbox = function(sandbox) { //把sandbox里面有函数属性的先开包运行返回
    var attr = null,
        temp = null;
    for (attr in sandbox) {
        temp = sandbox[attr];
        if (typeof temp === "function") {
            sandbox[attr] = temp();
        }
    }
    return sandbox;
};






var run = function(args) {
    var out = "";
//argument为首要命令后的其他命令的内容，所有的内容都为，name是参数，type是具体命令
    var cmdObj = cmdParse(args);
    var core = cmdObj.core;

    var cmdType=core.type,cmdNames=core.name;

    var checkConfigCmd=function(){
      var that=this;
      var tf=false;

      configHandle.forEach(function(cf,ind){
        if(cf.cmd.test(cmdType)){
          cf.action(cmdNames);
          tf=true;
        }
      });
      if(tf===false){//没有配置运行
        that.next();
      }
    };


    var readConfig=function(){
      var that=this;
        ifs.readJson(configStore,function(err,obj){

          if(obj&&(!obj.storeDir)){
            console.log(chalk.yellow('please use wct -config yourpath point your store position'));
            return;
          }
          if(err){
            console.log(err);
            return;
          }
          var dir=obj.storeDir;
          global.storeDir=dir;
          that.next(dir);
        });
    };

    var read1 = function(obj) {
        var that = this;
        var dir=obj.flow[0];
        ifs.stat(file,function(err,stat){
            if(err){

                ifs.ensureFile(file,function(e){

                    if(e){
                        console.log(e);
                        return;
                    }
                    else{
                        that.next(that,dir);
                    }
                });
            }
            else{
                that.next(that,dir);
            }

        });

    };


    var readStore=function(obj){
      var storeDir=obj.flow[0];
      var that=this;
          var file = path.join(storeDir,"/store.js");

        ifs.readFile(file, "utf8", function (err, cont) {
            if (err) {
                console.log(err);
            }
            // out+=cont+"\n";
            out = cont;

            var sandbox = {
                gbl: {}
            };
            if (cont.trim()) {
                vm.createContext(sandbox);
                vm.runInContext(out, sandbox);
            }
            that.next(sandbox);
        });

    }

    var read2 = function(contArg) {
        var lastCont = contArg.flow[0] ? contArg.flow[0].gbl : {};
        var wctfile = {};
        try {
            wctfile = require(path.join(cwd, "./wctfile.js"));
        } catch (e) {

        }


        //给lastCont做标注
        var storeConfigList = [],
            temp = null;
        var allConfig={};

        var wctfileOb=JSON.parse(JSON.stringify(wctfile));

        for (var attr in lastCont) {
          storeConfigList.push(attr);
            if (!(attr in wctfile)) {//合并所有变量
                // storeConfigList.push(attr); //单独包括在全局存储中的
                wctfile[attr] = lastCont[attr];
            }
        }

        analyse.apply(null, [cmdObj, runSandbox(wctfile), storeConfigList,runSandbox(wctfileOb)]);
    };

    var sync = new utils.sync();
    sync.get(checkConfigCmd).get(readConfig).get(read1).get(readStore).get(read2).go();

}

// console.log(create.config);
//vm是两个不同的环境，但是，他们都操作了createConfig
module.exports = function(args) { //如果只有命令行参数
    run(args)
};
