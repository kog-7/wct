var ifs = require("fs-extra");
var rp = require("request");
var path = require("path");
var parseArg = require("../parseArg.js");

var cdnFun = function(src, dist, cback, arg, name) {
    var arg = parseArg(arg);
    // var wrap=arg.wrap;
    if ("wrap" in arg) { //值没有，但是-wrap有的话
        var wrap = arg.wrap;
        wrap = wrap ? wrap : name;
        dist = path.join(dist, wrap);
    }

    var basename = path.basename(dist);
    var basenameSrc=path.basename(src);

    if(basename.indexOf(".")===-1){//为文件夹
      dist=path.join(dist,basenameSrc);
    }


        rp(src).on('error', function(err) {
            if (err) console.log(err);
        }).on("end", function() {
            console.log(src + " cdn is pipe to " + dist);
            if (typeof cback === "function") {
                cback();
            }
        }).pipe(ifs.createWriteStream(path.join(dist)));

}



module.exports = cdnFun;
