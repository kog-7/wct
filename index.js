var structureCmd=require("./structure/controller.js");
var cwd = process.cwd(),
    args = Array.prototype.slice.call(process.argv, 2);
// structureCmd(args);
module.exports=function(){
  structureCmd(args);
}
