var feature = require("./feature");
var path = require("path");
var iscope = {};
var dispatch=require("./lib/dispatch/index.js");
var removeDispatch=require("./lib/remove/index.js");
var parseSourceString=require("./lib/tool/parseSourceString.js");
var ifs=require("fs-extra");
var cwd=process.cwd();
var chalk=require("chalk");
// var storeDir="../../wct_store890/data";


// var storeDir=global.storeDir;
// var rootDir=path.join(__dirname,storeDir);
// var copyDir=path.join(__dirname,storeDir+"/copy");
// var storeFile=path.join(__dirname,storeDir+"/store.js");
// var logFile=path.join(__dirname,storeDir+"/log.js");
var writeStore=require("./lib/store/index.js")
var exec = require('child_process').exec;
var link=require("./lib/link/index.js");



// //第一次运行添加最高权限,不要使用权限，
// ifs.readFile(logFile,"utf8",function(err,cont){//以后放入其他内容做日志使用
// if(err){//如果还没有这个文件表示第一次运行，给予所有权限
// exec('chmod -R 777 '+rootDir,function(err){
// if(err){console.log(err);}
// else{
//   ifs.writeFile(logFile,"","utf8",function(err,cont){});
// }
// });
// }
// });





var regName = function(name, cont) {//如果有:distfile，则取出来
  var ind=name.indexOf(":");//包含有目标url的
  var ind2=name.indexOf("\/");

  if(ind!==-1){
    name=name.slice(0,ind);
  }
  if(ind2!==-1){
    name=name.slice(0,ind2);
  }

    var reg = new RegExp("\^" + name + "\$", 'gm');
    var out = {};

    for (var attr in cont) {
        if (reg.test(attr)) {
            out[attr] = cont[attr];
            reg.lastIndex = 0;
        }
    }
    return out;
};



var _createMult = function(name,cmdArgument,allConfig,storeConfigList) {//name用传入的，不用regName的
// console.log(allConfig);
var storeDir=global.storeDir;
var copyDir=path.join(storeDir,"/copy");

    var out = regName(name, allConfig);//out为与name(有可能为正则)匹配的configcontent
    var cont=null;
    for (var attr in out) {//使用attr去判断存储的所有名字，如果有的话则进行相关运行，不支持，ab  然后ab1,ab2都被查找到的情况
// console.log(attr);
      if(storeConfigList.indexOf(attr)!==-1){//在data/copy里面找,为存档的内容全部为url
        dispatch.url(path.join(copyDir,attr),cwd,null,cmdArgument,name);
      }
      else{//为wctfile的内容

        var sourceOb=parseSourceString(out[attr]);//得到{contentType:url,content:xx,}
        dispatch[sourceOb.contentType](sourceOb.content,cwd,null,cmdArgument,name);//可能为url,object,git模式
      }

    }
}


iscope.create = function(cmdNames, cmdContentTypes, cmdContents, cmdArgument, allConfig, storeConfigList) {

    cmdNames.forEach(function(name, ind) {
        var nameContentType = cmdContentTypes[ind],
            nameContent = cmdContents[ind];
        //如果有人工设置的内容型号



        if (nameContentType) {
            dispatch[nameContentType](nameContent, cwd,null,cmdArgument,name); //nameContent是src,cwd是dist
            return;
        } else { //如果是名字的类型，则要取资源,是name的话就不需要用content的内容，是互斥的
          _createMult(name, cmdArgument, allConfig, storeConfigList);
        }
    });
}




var _installMult = function(name,cmdArgument,allConfig,storeConfigList) {//name用传入的，不用regName的

  var storeDir=global.storeDir;
  var copyDir=path.join(storeDir,"/copy");


  cmdArgument.unshift({type:"-wrap",name:name});
    var out = regName(name, allConfig);//out为与name(有可能为正则)匹配的configcontent
    var cont=null;

    for (var attr in out) {//使用attr去判断存储的所有名字，如果有的话则进行相关运行，不支持，ab  然后ab1,ab2都被查找到的情况
// console.log(attr);
      if(storeConfigList.indexOf(attr)!==-1){//在data/copy里面找,为存档的内容全部为url
        dispatch.url(path.join(copyDir,attr),cwd,null,cmdArgument,name);

      }
      else{//为wctfile的内容

        var sourceOb=parseSourceString(out[attr]);//得到{contentType:url,content:xx,}
        dispatch[sourceOb.contentType](sourceOb.content,cwd,null,cmdArgument,name);//可能为url,object,git模式
      }

    }
}


iscope.install = function(cmdNames, cmdContentTypes, cmdContents, cmdArgument, allConfig, storeConfigList) {

    cmdNames.forEach(function(name, ind) {
        var nameContentType = cmdContentTypes[ind],
            nameContent = cmdContents[ind];
        //如果有人工设置的内容型号
        cmdArgument.unshift({type:"-wrap",name:name});//


        if (nameContentType) {
            dispatch[nameContentType](nameContent, cwd,null,cmdArgument,name); //nameContent是src,cwd是dist
            return;
        } else { //如果是名字的类型，则要取资源,是name的话就不需要用content的内容，是互斥的
          _createMult(name, cmdArgument, allConfig, storeConfigList);
        }
    });
}





//remove  才用name+  ""字符串自定义删除的方式
var _removeMult = function(name,cmdArgument,wctfileConfig) {


var sourceOb=parseSourceString(wctfileConfig[name]);
if(sourceOb===undefined){
  console.log(chalk.blue("no "+name+" project"));
  return;
}
removeDispatch[sourceOb.contentType](sourceOb.content,cwd,function(){
});
};

iscope.remove=function(cmdNames, cmdContentTypes, cmdContents, cmdArgument, allConfig, storeConfigList,wctfileConfig){//remove只读取本地wctfile的内容
// console.log(cmdNames,cmdContentTypes,cmdContents,storeConfigList,storeConfigList);


  cmdNames.forEach(function(name, ind) {//必须要有name
    var nameContentType = cmdContentTypes[ind],
        nameContent = cmdContents[ind];
    if (nameContentType) {
      removeDispatch[nameContentType](nameContent,cwd,function(){

      }); //nameContent是src,copyDir是dist
      return;
  }
  else{
        _removeMult(name, cmdArgument, wctfileConfig);
  }


  });


};






iscope.link=function(cmdNames, cmdContentTypes, cmdContents, cmdArgument, allConfig, storeConfigList,wctfileConfig){//link只读取本地wctfile的内容

  var storeDir=global.storeDir;
  var copyDir=path.join(storeDir,"/copy");


  cmdNames.forEach(function(name, ind) {//必须要有name
    if(storeConfigList.indexOf(name)===-1){
      console.log(name+" is not stored,can't be linkd");
      return;
    }
    link.link(path.join(copyDir,name),path.join(cwd,name),name);
  });
};

iscope.unlink=function(cmdNames, cmdContentTypes, cmdContents, cmdArgument, allConfig, storeConfigList,wctfileConfig){//link只读取本地wctfile的内容

  cmdNames.forEach(function(name, ind) {//必须要有name
    if(storeConfigList.indexOf(name)===-1){
      console.log(name+" is not stored,can't be linkd");
      return;
    }
    link.unlink(path.join(cwd,name),name);
  });
};




var _storeMult = function(name,cmdArgument,wctfileConfig) {
  var storeDir=global.storeDir;
  var copyDir=path.join(storeDir,"/copy");
  var storeFile=path.join(storeDir,"/store.js");
var sourceOb=parseSourceString(wctfileConfig[name]);
dispatch[sourceOb.contentType](sourceOb.content,copyDir,function(){
var str="gbl['"+name+"']=\"yes\";\n";
writeStore(storeFile,str);
},[{type:"-wrap",name:name},{type:"-cover",name:true}],name,"store");
}





iscope.store = function(cmdNames, cmdContentTypes, cmdContents, cmdArgument, allConfig, storeConfigList,wctfileConfig) {
// console.log(cmdNames);
var copyDir=path.join(storeDir,"/copy");
  var storeFile=path.join(storeDir,"/store.js");
  cmdNames.forEach(function(name, ind) {//必须要有name
      var nameContentType = cmdContentTypes[ind],
          nameContent = cmdContents[ind];

      //如果有人工设置的内容型号
      if (nameContentType) {
        if(!name){console.log("store muse have name");return;}

          dispatch[nameContentType](nameContent, copyDir,function(){
            var str="gbl['"+name+"']=\"yes\";\n";

            writeStore(storeFile,str);
          },[{type:"-wrap",name:name},{type:"-cover",name:true}],name,"store"); //nameContent是src,copyDir是dist
          return;
      } else { //如果是名字的类型，则要取资源,是name的话就不需要用content的内容，是互斥的
        _storeMult(name, cmdArgument, wctfileConfig, storeConfigList);
      }
  });
};




var out = {};
feature.forEach(function(obj, ind) {
    var name = obj.name;
    out[name] = iscope[name];
});

module.exports = out;
