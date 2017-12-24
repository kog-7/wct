const ifs = require('fs-extra');
const path = require("path");
var cwd = process.cwd();



// var storeDir="../../../../wct_store890/data";


var getPath = function(url) {
  if (path.isAbsolute(url)) {
    return url;
  } else {
    return path.join(cwd, url);
  }
}


var run = function(name, toPath, aimPath, cover_link_wrap) { //topath表示当前toPath的位置，，后面这里可以改成比如git();这种
  var storeDir = global.storeDir;
  var cpUrl = path.join(storeDir, "/copy");
  var aim = path.join(cpUrl, name);
  aimPath = aimPath ? aimPath : cwd;

  // ifs.chmod(aim,0777,function(err){
  // if(err){
  //   console.log(err);return;
  // }
  aim = toPath ? aim + "," + encodeURIComponent(toPath) : aim;

  if (cover_link_wrap === "link") {
    var basename = path.basename(aim);
    aimPath = path.join(aimPath, path.basename(aim, path.extname(basename)));

    var exec = require('child_process').exec;
    exec("git clone https://github.com/angular/angular.js.git", function() {

    });

    ifs.link(aim, aimPath, function(err) {
      if (err) {
        console.log(err);
      }
      console.log("create and link " + name + " success");
    });
  } else {
    if (cover_link_wrap === "wrap") {
      var basename = path.basename(aim);
      aimPath = path.join(aimPath, path.basename(aim, path.extname(basename)));
      cover_link_wrap = false;
    }
    if (cover_link_wrap !== "cover") {
      cover_link_wrap = true;
    }
    ifs.copy(aim, aimPath, {
      overwrite: cover_link_wrap
    }, function(err) {
      if (err) {
        console.log(err);
      }
      console.log("create " + name + " success");
    });
  }


  // })




};



module.exports = run;
