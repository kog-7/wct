
var ifs=require("fs-extra");
var path=require("path");
var recall=require("../../tool/recur.js");
var utils=require("./utils.js");
var handle = require("./handleProcess.js")
var collect=utils.collect;
var cwd=process.cwd();

var processFun = function(currentOb, lastOb, lastMsg,cb) {
  handle(currentOb, lastOb);
  cb();
};


var removeFile = function(url,dist) {//有的可能是copy的部分内容，为文件夹


  var that = this;
  ifs.stat(url, function(err, stats) {
    if (err) {
      that();
      return;
    }
    ifs.remove(path.join(dist,url), function(err) {
      if (!err) {
        console.log(url + " is removed")
      }
      else{
        console.log(err);
      }
      that();
    })
  });
};



var removeDir = function(url, dist,cb) {
  if(path.join(cwd,url)===cwd){return;}
  ifs.readdir(url, function(err, files) {
    if (err) {
      cb();
      console.log(url + " is not exit");
      return;
    }
    if (!files || files.length === 0) {
      ifs.remove(path.join(dist,url), function(err) {

        if (!err) {
          console.log(url + " is removed")
        }
        else{
          console.log(err);
        }
        cb();
      })
    } else {
      cb();
    }
  });
};



var createTrace=function(dist){
  return function(pa, child, cb){
    var arr = [];
    var args = [];
    child.forEach(function(ob, ind) {
      var attr = ob.attr;
      arr.push(removeFile);
      args.push([ob.attr,dist]);
    });
    var col = collect();
    arr.forEach(function(f, ind) {
      col.get(f);
    });
    col.setCallback(function() {//所有文件删除后，删除文件夹
      removeDir(pa.attr,dist, cb);
    }).go(args);

  }
}



var remove=function(opt){
  let {src:obj,dist,callback}=opt;
  var ob={config:obj,callback: function() {
    if(typeof callback==="function"){callback();}
  },
  process:processFun,
  trace:createTrace(dist)
};
recall(ob);
}

module.exports=remove;
