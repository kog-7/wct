var create=require("../../create/index.js");
var parseArg=require("../parseArg.js");
var path=require("path");


var objectFun=function(opt){//cover只对object有效,
  let {src,dist,callback,args,name}=opt;//这里的src是对象
var arg=parseArg(args);

// var wrap=arg.wrap;
if("wrap" in arg){//值没有，但是-wrap有的话
  var wrap=arg.wrap;
  wrap=wrap?wrap:name;
  dist=path.join(dist,wrap);
}

var cover=arg.cover;
if (cover === "false" || cover === false) {
  cover = false;
}
if (cover === "true" || cover === true) {
  cover = true;
}
else{
  cover=false;
}


create(src,dist,cover,callback);

};


module.exports=objectFun;
