var path=require("path");
var ifs=require("fs-extra");
var writeStore=function(aimFile,cont){//以后还要做内容清理
  ifs.stat(aimFile,function(err){
    if(err){
      ifs.ensureFile(aimFile,function(err){
        if(err){console.log(err);}
        else{
          ifs.appendFile(aimFile,cont,"utf8",function(err){
            if(err){console.log(err);}
          });
        }
      })
    }
    else{
      ifs.appendFile(aimFile,cont,"utf8",function(err){
        if(err){console.log(err);}
      });
    }
  })
};


module.exports=writeStore;
