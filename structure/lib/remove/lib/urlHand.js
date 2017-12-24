var ifs=require("fs-extra");
path=require("path");


module.exports=function(src){
ifs.remove(src,function(err){
if(err){
  console.log(err);
}
else{
  console.log(src+" is removed");
}


});
};
