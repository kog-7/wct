//工具
var recall = require("../tool/recur.js");
var createProcess= require("./lib/create.js");
var removeTrace= require("./lib/remove.js");
var copy=require("../tool/download.js");
var ifs=require("fs-extra");
var cwd=process.cwd();
var path=require("path");
var getPath=function(url){
if(path.isAbsolute(url)){
  return url;
}
else{
  return path.join(cwd,url);
}
}



var create=function(name,obj,cover_wrap,ifStore){
if(typeof obj==="string"&&obj.indexOf("url(")!==-1){
obj=obj.slice(4,-1);
if(ifStore===true){
copy(name,null,null,cover_wrap);
}
else{
  ifs.copy(obj,getPath(cwd),function(err){
      console.log("create "+name+" success")
  },cover_wrap);
}
}
else{
  if(cover_wrap==="cover"){cover_wrap=true;}
  var ob={config:obj,callback: function() {
      // (typeof cback==="function")&&cback();
  }};

  createProcess(ob,cover_wrap,name,ifStore);
  recall(ob);

}



};




var remove=function(name,obj){

if(typeof obj==="string"){
console.log("remove temporary not support from copy");
return;
};

  var ob={
      config:obj,
      callback: function() {
          // (typeof cback==="function")&&cback();
      }
  };
  removeTrace(ob);
  recall(ob);
}



module.exports={
  create:create,
  remove:remove
};
