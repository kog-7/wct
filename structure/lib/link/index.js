var ifs=require("fs-extra");
// var path=require("path");
const execSeries=require("exec-series");

var link=function(src,dist,name){
  console.log(src,dist);
  ifs.symlink(src,dist,function(err){
    if(err){console.log(err); console.log("link "+name+" error,in windows you must run as administrator");}
    else{
          console.log("link "+name+" success");
    }
  });
  // execSeries(["MKLINK /J "+src+" "+dist],function(err,out,inErr){

  // if(err){console.log(err);}
  //   console.log("link "+name+" success");
  // });

};

var unlink=function(dist,name){
ifs.unlink(dist,function(err){
  if(err){console.log(err);}
  console.log("unlink "+name+" success");
});
};


module.exports={
link:link,
unlink:unlink
};
