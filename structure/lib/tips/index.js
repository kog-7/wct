var ifs=require("fs-extra");
var cwd=process.cwd();
var getPath=function(url){
if(path.isAbsolute(url)){
  return url;
}
else{
  return path.join(cwd,url);
}
}

//存入比如直接运行，等小工具代码
var emptyStr = '//配置wct\n\n\n\n\nmodule.exports={}';
var createWctFile = function() {
    var newPh = getPath("./wctfile.js");
    ifs.stat(newPh, function(err) {
        if (err) {
            ifs.writeFile(newPh, emptyStr, "utf8", function(err) {
                if (err) {
                    console.log(err);
                }
                console.log("wctfile is created");
            });
        } else {
            console.log("wctfile is exit");
        }
    });
};



var createDirFile = function(cmdName) {
    if (path.basename(cmdName).indexOf("\.") !== -1) {
        ifs.ensureFile(getPath(cmdName), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log(cmdName + " is create");
            }
        });
    } else {
        ifs.ensureDir(getPath(cmdName), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log(cmdName + " is create");
            }
        });
    }

}




var parse = function(name) { //小工具不接受-xx的类型
    if (!name) {
        createWctFile();
    } else {
        createDirFile(name); //这里的name是一串文件夹的编写模式
    }
};


module.exports=parse;
