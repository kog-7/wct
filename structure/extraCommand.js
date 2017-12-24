//清空文件
var ifs = require("fs-extra");
var path = require("path");
//不需要在wctfile里面定义的命令
var cwd = process.cwd();
const vm = require("vm");
const utils = require('./utils');
// var storeDir="../../wct_store890/data";
var configStore="./config/store.json";

var _readStoreObj = function(cback) {
  var storeDir=global.storeDir;
    ifs.readFile(path.join(storeDir,"/store.js"), 'utf8', function(err, str) {
        var sandbox = {
            gbl: {}
        };
        vm.createContext(sandbox);
        vm.runInContext(str, sandbox);
        var gbl = sandbox.gbl;
        var out = {};
        for (var attr in gbl) {
            out[attr] = gbl[attr];
        }
        cback(out);
    });
}

var clean = function(args) {
  var name=args[0];
    var storeDir=global.storeDir;
    var dir = path.join(storeDir, "copy", name);
    ifs.stat(dir, function(err, stat) {
        if (!err && stat.isDirectory()) {
            ifs.remove(dir, function(err) {
                if (err) {
                    console.log("no " + name);
                }
            });
        } else {
            console.log("no " + name);
        }
    });


    _readStoreObj(function(obj) {
        var ar = name.split(",");
        var attr = [];
        for (var i in obj) {
            if (ar.indexOf(i) === -1) {
                attr.push(i);
            }
        }
        var out = "",
            temp = "";
        attr.forEach(function(str, ind) {
          // console.log(str);
            temp = obj[str];
            if (typeof temp === "object") {
                temp = '\'' + JSON.stringify(temp) + '\'';
            } else {
                temp = '\'' + temp + '\'';
            }
            if (typeof temp === "object");

            out += 'gbl[\'' + str + '\']=' + temp + ';';
        });

        ifs.writeFile(path.join(storeDir, "store.js"), out, "utf8", function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("clean " + name + " complete");
            }
        });

    });
};



var cleanall = function() {
    var storeDir=global.storeDir;
    ifs.remove(path.join(storeDir,"/copy"), function(err) {
        if (err) {
            console.log(err);
        }

        ifs.writeFile(path.join(storeDir,"/store.js"), "", "utf8", function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("clean all success")
            }
        });

    })
};


var listall = function() {
    var storeDir=global.storeDir;
    ifs.readFile(path.join(storeDir,"/store.js"), 'utf8', function(err, str) {
        console.log(str);
    });
};

var list = function() {
    var storeDir=global.storeDir;
    var exec = require('child_process').exec;
    ifs.readFile(path.join(storeDir,"/store.js"), 'utf8', function(err, str) {
        var sandbox = {
            gbl: {}
        };
        vm.createContext(sandbox);
        vm.runInContext(str, sandbox);
        var gbl = sandbox.gbl;
        var logStr = "";
        var mark = [];
        for (var attr in gbl) {
            if (mark.indexOf(attr) === -1) {
                logStr += attr + "\x20\x20";
                mark.push(attr);
            }
        }
        console.log(logStr);
    });
};


var pull = function() {
    var storeDir=global.storeDir;
    const exec = require('child_process').exec;
    exec('chmod -R 777 ' + storeDir, function(err) {
        // console.log(890000)
        // console.log(aim);
        if (err) {
            console.log(err);
            return;
        }
        ifs.copy(storeDir, path.join(cwd, "wct-data"), function(err) {
            console.log(path.join(cwd, "wct-data"));
            if (err) {
                console.log(err);
            } else {
                console.log("pull all data success");
            }
        });

    });


}



module.exports = [
    // {name:"config",action:writeConfigStore,cmd:/(-config)|(--config)/g},
    {name:"clean",action:clean,cmd:/(-clean)|(--clean)/g},
    {
        name: "cleanall",
        action: cleanall,
        cmd: /(-cleanall)|(--cleanall)/g
    }, {
        name: "listall",
        action: listall,
        cmd: /(-listall)|(--listall)/g
    },
    {
        name: "list",
        action: list,
        cmd: /(-list)|(--list)/g
    },
    {
        name: "pull",
        action: pull,
        cmd: /(-pull)|(--pull)/g
    }
];