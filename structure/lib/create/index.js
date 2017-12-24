
var ifs=require("fs-extra");
var path=require("path");
var recall=require("../tool/recur.js");

var parseType=require("./lib/parseType.js");
var renderContent=require("./lib/renderContent.js");

var createDirFile = function(url,cover, next) { //cover表示是否覆盖,next表示运行下一步,判断是否存在
  var basename=path.basename(url);


   ifs.stat(url, function(err, stat) {
        if (cover !== true && !err) {
            next(); //直接运行下一步,因为有了文件
        } else {
            var dirFile = basename.indexOf(".") === -1 ? "ensureDir" : "ensureFile";
            ifs[dirFile](url, function(err) {

              if(err){console.log(url + " is exist");}
              else{console.log(url + " is create");}
              next();
            });
        }
    });



};

//currentOb是当前的一个进入对象，lastob是上次对象从哪里来，cb（），运行下一次内容
var createProcess = function(dist,cover) {
    return function(currentOb, lastOb,lastMsg,cb) {
        // var msg=handle(currentOb,lastOb);
        var attr=currentOb.attr,content=currentOb.content;

        var out=parseType(attr,content,dist,lastMsg);

// console.log(out);
        var value=out.value;
        var nowPath=out.nowPath,allPath=out.allPath,nextPath=out.nextPath;
        var pathType=out.pathType;

        if(pathType==="none"){cb(nextPath);}
        else if(pathType==="create"||pathType==="root"){

          createDirFile(allPath,cover,function(){
            cb(nextPath);
          });
        }
        else if(pathType==="render"){
          renderContent(allPath,value,cover,function(){
            cb(nextPath);
          })
        }
    };
};



var create=function(obj,dist,cover,cback){
  var ob={config:obj,callback: function() {
    if(typeof cback==="function"){cback();}
  },
  process:createProcess(dist,cover)
};
recall(ob);
};

module.exports=create;
