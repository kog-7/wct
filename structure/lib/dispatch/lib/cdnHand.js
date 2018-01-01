var ifs = require("fs-extra");
var rp = require("request");
var path = require("path");
var parseArg = require("../parseArg.js");

var cdnFun = function(opt) {

  let {src,dist,callback,args,name="",type=""}=opt;
  var arg = parseArg(args);

  //如下的wrap以后可能用
  if ("wrap" in arg) { //值没有，但是-wrap有的话
    var wrap = arg.wrap;
    wrap = wrap ? wrap : name;
    name=wrap;
    dist = path.join(dist, wrap);
  }

  if ("rename" in arg) { //值没有，但是-wrap有的话
    var rename = arg.rename;
    name=rename;
    dist = path.join(dist, rename);
  }
  if(!name){//如果没有名字
    name=path.basename(src);
   dist=path.join(dist,name);
  }


  // var basename = path.basename(dist);

  // console.log(dist);
  // if(basename.indexOf(".")===-1){//为文件夹
  //   dist=path.join(dist,basenameSrc);
  // }

  rp(src).on('error', function(err) {
    if (err) console.log(err);
  }).on("end", function() {
    console.log(src + " cdn is pipe to " + dist);
    if (typeof callback === "function") {
      callback();
    }
  }).pipe(ifs.createWriteStream(path.join(dist)));

}



module.exports = cdnFun;
