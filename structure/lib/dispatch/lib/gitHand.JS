var exec = require('child_process').exec;
var parseArg=require("../parseArg.js");
var ifs=require("fs-extra");


var clone=function(src,dist,cback){
  // console.log(9989);
  exec('git clone '+src+" "+dist,function(err,stdout,stderr){
    if(!err){
      console.log("git get "+src+" success");
    }
    else{
      console.log(err);
    }
    if(typeof cback==="function"){cback();}
  });
}

var gitFun=function(opt){
    let {src,dist,callback,args,name}=opt;
  var arg=parseArg(args);
  // var wrap=arg.wrap;
  if("wrap" in arg){//值没有，但是-wrap有的话
    var wrap=arg.wrap;
    wrap=wrap?wrap:name;
    dist=path.join(dist,wrap);
  }

ifs.stat(dist,function(err){
  if(!err){//如果存在这个文件的话，删除他
    console.log(dist+" is exits");
    //如下的remove出现过很大的危险隐患
    // ifs.remove(dist,function(err){
    //   clone(src,dist,callback);
    // });
  }
  else{
      clone(src,dist,callback);
  }
});
};


module.exports=gitFun;
