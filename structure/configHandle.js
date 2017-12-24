var ifs = require("fs-extra");
var path = require("path");
//不需要在wctfile里面定义的命令
var cwd = process.cwd();
const utils = require('./utils.js');
var configStore = path.join(__dirname,"./config/store.json");


// {name:"config",action:writeConfigStore,cmd:/(-config)|(--config)/g},
var writeConfigStore = function(args) {
  var url = args[0];
  url=path.join(cwd,path.relative(cwd,url));
  var createConfig = function() {
    var that = this;
    ifs.ensureFile(path.join(url, "store.js"), function(err) {
      if (err) {
        console.log(err);
      } else {
        that.next();
      }
    });
  };

  var read = function() {
    var that = this;
    ifs.readJson(configStore, "utf8", function(err, obj) {
      if (err) {
        console.log(err);
        return;
      }
      if(!obj){obj={};}
      obj.storeDir = url;
      that.next(obj);
    });
  }

  var write = function(obj) {
    ifs.writeJson(configStore, obj.flow[0], function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(url + " is configed,your file will send to " + url);
        return;
      }
    });
  };


  var sync = new utils.sync();
  sync.get(createConfig).get(read).get(write).go();

};


module.exports = [{
  name: "config",
  action: writeConfigStore,
  cmd: /(-config)|(--config)/g
}];
