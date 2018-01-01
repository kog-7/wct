var path = require("path");
var chalk = require('chalk');
var hasSomeTag = function(str, arr) { //str为sdjf-ksjdf=,arr为["-","="]

  var i = 0,
    lg = arr.length;
  var out = false;
  var temp = "";

  if (str.slice(0, 1) == "-" || str.slice(0, 2) === "--") {
    return true;
  } else {
    return false;
  }
};


var getName = function(name) {
  if (!name) {
    return "";
  }
  var ind = name.indexOf("=");
  if (ind !== -1) {
    name = name.slice(0, ind);
  } else {
    name = "";
  }
  return name; //在有object类型的情况下，name必须为name=
}


var parseName = function(nameCol) { //name支持object={},url={},git={},
  //name有可能包含目标,reg表示包含url%的这种
  var reg = /([\w\:\/\.]+)\%/g;
  var match = reg.exec(nameCol);
  // console.log(match,nameCol);

  if (!match) {
    return {
      contentType: "",
      content: "",
      name: nameCol
    };
  }
  var colName = match[1];
  if (colName === "url") {
    dataType = "url", content = nameCol.slice(reg.lastIndex);
    name = getName(nameCol.slice(0, match.index));
  } else if (colName === "cdn") {
    dataType = "cdn", content = nameCol.slice(reg.lastIndex);
    name = getName(nameCol.slice(0, match.index));
  } else if (colName === "object") {
    dataType = "object", content = nameCol.slice(reg.lastIndex);
    name = getName(nameCol.slice(0, match.index));
    var vm = require("vm"); //临时调用vm
    var sandbox = {
      gb: ""
    };
    try {

      vm.createContext(sandbox);
      vm.runInContext("gb=" + content, sandbox);
      content = sandbox.gb;
    } catch (e) {
      throw chalk.red(content + " is not object,:use {attr:'val'} is right,can't use {attr:\"val\"} and {attr:val}");
      dataType = "", content = "", name = nameCol;
    }
  } else if (colName === "git") {
    dataType = "git", content = nameCol.slice(reg.lastIndex, -1);
    name = getName(nameCol.slice(0, match.index));
  } else {
    dataType = "", content = "", name = nameCol;
  }
  return {
    contentType: dataType,
    content: content,
    name: name
  };
};


//只能是-c name的这种情况
var parseCore = function(cmds) { //核心命令分析

  var type, name; //不能同时有两个type，分析出一个就不用再分析了
  var type = cmds[0],
    name = cmds[1];
  // if(cmds.length===1){name=type;type="";}

  if (typeof type === "string") {
    type = type.trim()
  }
  if (typeof name === "string") {
    name = name.trim()
  }


  var midStr = "";

  if (cmds.length === 0) {
    return {
      type: "",
      name: ""
    };
  }

  if (!hasSomeTag(type, ["-", "--"])) {
    midStr = name, name = type, type = midStr;
  }
  if (!name && type && !hasSomeTag(type, ["-", "--"])) {

    name = type;
    type = "";
  }



  // console.log(name,type);

  // if(!hasSomeTag(type, ["-", '--'])){
  //   name=type,type=null;//没有第二个就是name
  // }
  // console.log(name,type);
  name = name ? name : "";
  // console.log(cmds[]);

  return {
    type: type,
    name: name
  };
}



var parseTask = function(cmds) {
  var cmdOb = parseCore(cmds);
  var type = cmdOb.type,
    name = cmdOb.name;
  var nameArr = name.split("+"); //使用+来分拆多个名字内容
  var out = {
    name: [],
    content: [],
    contentType: [],
    type: type
  };
  var temp = null,
    tempName, tempContent, tempContentType;

  nameArr.forEach(function(na, ind) {
    temp = parseName(na);
    tempName = temp.name, tempContent = temp.content, tempContentType = temp.contentType;
    out.name.push(tempName), out.content.push(tempContent), out.contentType.push(tempContentType);
  });

  return out;
}



var parseArg = function(cmds) { //暂时与coreparse解析方式一样，以后可能会改变
  var type, name; //不能同时有两个type，分析出一个就不用再分析了
  var out = [];
  var temp = [];
  if (cmds.length % 2 === 1) {
    cmds.push("");
  }
  cmds.forEach(function(cmd, ind) {
    temp.push(cmd);
    if (ind > 0 && ind % 2 === 1) {
      out.push(parseCore(temp)); //参数内容不做复杂name分析
      temp = [];
    }
  });

  return out; //out为[{name:type:},{name:type:}]
};



var par = function(arg) {
  // console.log(arg);
  var coreCmd = arg.slice(0, 2); //-c 运行名字，不算参数
  var argCmd = arg.slice(2);

  return {
    core: parseTask(coreCmd),
    args: parseArg(argCmd)
  }
}



module.exports = par;
