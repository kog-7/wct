//得到相关的

var sandbox = require("./controller.js");
var cwd = process.cwd();
var feature = require("./feature");
var commands = require("./runCommand.js");
var extraCmd = require("./extraCommand.js");
var tips = require("./lib/tips/index.js");
var ifs = require("fs-extra");
var path = require("path");
var cmdParse = require("./lib/tool/cmdParse.js");


var getPath = function(url) { //根据情况来设置路径是绝对还是相对
    if (path.isAbsolute(url)) {
        return url;
    } else {
        return path.join(cwd, url);
    }
};



var analyse = function(cmdObj, allConfig, storeConfigList, wctfileConfig) { //configs是取到的所有的配置内容
    // var cmdObj = cmdParse(cmds);

    var core = cmdObj.core,
        cmdArgument = cmdObj.argument;
    var cmdType = core.type,
        cmdNames = core.name,
        cmdContents = core.content,
        cmdContentTypes = core.contentType;

// console.log(cmdNames);

    if (!cmdType) {//如果没有-c,-s这些用tips做，tips为一些小工具
        tips(cmdNames[0]);
        return;
    }


    //额外的命令运行
    extraCmd.forEach(function(obj, ind) {
        var cmd = obj.cmd,
            name = obj.name,
            action = obj.action;
//只要命令中包含这个，就执行
        if (cmd.test(cmdType)) {
            action(cmdNames);
            // cmdNames.forEach(function(na, ind) {
            //     action(na); //包括clean等一些额外的命令，暂时用不到name等菜蔬
            // })

        }
    });

    if (cmdNames.length === 0) {
        return;
    } //没有写name的话，不运行

    //核心命令的运行
    feature.forEach(function(obj, ind) { //真正特性的功能
        var cmd = obj.cmd,
            name = obj.name; //name是运行的功能类型
        if (cmd.test(cmdType)) { //判断是否为相应的内容sss
            commands[name](cmdNames, cmdContentTypes, cmdContents, cmdArgument, allConfig, storeConfigList, wctfileConfig);
        }
    });
};




module.exports = analyse;
