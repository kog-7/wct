var path = require("path");
var parseSourceString = require("../../tool/parseSourceString.js");
var ifs = require("fs-extra");

delete require.cache[require.resolve("../../dispatch/index.js")];
var dispatch = require("../../dispatch/index.js");

var renderContent = function(allPath, value, cover, cb) {

  ifs.stat(allPath, function(err, info) {
    if (!err && cover !== true) {
      console.log(allPath + " is exit");
      cb();
    } else {
      var basename = path.basename(allPath);
      var dirFile = basename.indexOf(".") === -1 ? "ensureDir" : "ensureFile";
      ifs[dirFile](allPath, function(err) {

        var valueOb = parseSourceString(value);
        var type = valueOb.contentType,
          content = valueOb.content;
        if (type === "string") {
          if (path.extname(allPath)) { //必须是文件才行
            ifs.writeFile(allPath, content, "utf8", function(err) {
              if (err) {
                console.log(err+":allPath is not writeFile");
              }
              cb();
            });
          }
          else{
            cb();
          }
        } else {
          dispatch[type]({
            src:content,
            dist:allPath,
            callback:cb,
            args:[{
              type: "cover",
              name: cover
            }]
          });
        }
      });

    }
  });

}
module.exports = renderContent;
