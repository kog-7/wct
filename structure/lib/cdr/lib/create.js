//文件相关,,还不支持，取图片，字体这些静态的文件，要补上去。
var path = require("path");
var fs = require("fs-extra");
var rp = require("request");
var handle = require("./handleProcess.js")
var cwd = process.cwd();
var copy = require("../../tool/download.js");


var getPath = function(url) {
  if (path.isAbsolute(url)) {
    return url;
  } else {
    return path.join(cwd, url);
  }
};



var readCdn = function(val) { //字符串为cdn(angular.js)，返回http://cdn.b....
  // var cdnUrl = "http://cdn.bootcss.com/";
  val = val.slice(4, -1);
  //     // 取最后一个/后面的第一个.
  // var name=val.slice(val.lastIndexOf("/")+1)
  //     var name = name.slice(0, name.indexOf("."));
  //     var request = cdnUrl+path.join(name, val);
  return val;
};


var localReadWriteFile = function(src, aimSrc, cback, name, ifStore) {
  // var isFile=path.basename(src).indexOf(".")!==-1;
  if (ifStore === true) {
    copy(name, src, aimSrc);
  } else {
    fs.copy(getPath(src), aimSrc, function(err) {
      if (err) {
        console.log(err);
      }
      cback();
    });
  }

  // if(isFile){
  //   var readStream=fs.createReadStream(src);
  //   var writeStream=fs.createWriteStream(aimSrc);
  //   readStream.pipe(writeStream);
  //   readStream.on("end",function(){
  //     cback();
  //   });
  // }
  // else{
  //   fs.copy(src,aimSrc,function(err){
  //     if(err){console.log(err);}
  //     cback();
  //   });
  // }
};



var readWriteFile = function(value, aimSrc, cb, name, ifStore) { //输入 cdn(),url(),字符串, 运行cb(得到的字符)


  if (value.slice(0, 4) == "url(") { //使用url的
    var ph = value.slice(4, -1);
    localReadWriteFile(ph, aimSrc, cb, name, ifStore);
  } else if (value.slice(0, 4) == "cdn(") {
    var request = readCdn(value);
    rp(request).on('error', function(err) {
      if (err) console.log(err);
    }).on("end", function() {
      cb();
    }).pipe(fs.createWriteStream(aimSrc));
  } else { //普通字符串就直接房子福进去
    fs.writeFile(aimSrc, value, 'utf8', function(err) {
      // if(!err){console.log(msg.attr+" is create");}
      if (err) {
        console.log(err);
      }
      cb();
    });
  }
}



var createDirFile = function(url, next, cback, cover) { //cover表示是否覆盖,next表示运行下一步,判断是否存在
  fs.stat(getPath(url), function(err, stat) {
    if (cover !== true && !err) {
      next(); //直接运行下一步
    } else {
      var dirFile = url.indexOf(".") === -1 ? "ensureDir" : "ensureFile";
      fs[dirFile](getPath(url), function(err) {

        if (err && url !== ".") {
          console.log(url + " is exist");
        } else if (!err && url !== ".") {
          console.log(url + " is create");
        }
        cback(); //直接回调
      });
    }
  });
};



//currentOb是当前的一个进入对象，lastob是上次对象从哪里来，cb（），运行下一次内容
var create = function(cover, name, ifStore) {
  return function(currentOb, lastOb, cb) {
    var msg = handle(currentOb, lastOb);
    createDirFile(msg.attr, cb, function() {
      if (msg.value) {

        readWriteFile(msg.value, getPath(msg.attr), cb, name, ifStore);

      } else {
        cb();
      }
    }, cover);
  };
};

module.exports = function(ob, cover, name, ifStore) {
  ob.process = create(cover, name, ifStore);
};
