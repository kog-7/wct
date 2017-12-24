//文件相关
var path = require("path");
var fs = require("fs-extra");
var handle = require("./handleProcess.js")
var utils = require("./utils.js");
var collect = utils.collect;
var cwd=process.cwd();


// con
var processFun = function(currentOb, lastOb, cb) {
    handle(currentOb, lastOb);
    cb();
};


var getPath=function(url){
if(path.isAbsolute(url)){
  return url;
}
else{return path.join(cwd,url);}
};

var removeFile = function(url) {//有的可能是copy的部分内容，为文件夹
    var that = this;



    fs.stat(url, function(err, stats) {

        if (err) {
            // console.log(url + " is not exit");
            that();
            return;
        }
        // if (!stats.isFile()) {

            // that();
            // return;
        // }
        fs.remove(getPath(url), function(err) {
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


var removeDir = function(url, cb) {
if(path.join(cwd,url)===cwd){return;}


    fs.readdir(url, function(err, files) {
        if (err) {
            cb();
            console.log(url + " is not exit");
            return;
        }
        if (!files || files.length === 0) {
            fs.remove(getPath(url), function(err) {

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


//currentOb是当前的一个进入对象，lastob是上次对象从哪里来，cb（），运行下一次内容
var remove = function(pa, child, cb) {
    var arr = [];
    var args = [];
    child.forEach(function(ob, ind) {
        var attr = ob.attr;
        arr.push(removeFile);
        args.push([ob.attr]);
    });
    var col = collect();
    arr.forEach(function(f, ind) {
        col.get(f);
    });
    col.setCallback(function() {//所有文件删除后，删除文件夹
        removeDir(pa.attr, cb);
    }).go(args);
}



module.exports = function(ob,baseUrl) {

    ob.process = processFun, ob.trace = remove;
}
