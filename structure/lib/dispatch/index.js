
var urlHand=require("./lib/urlHand.js");
var gitHand=require("./lib/gitHand.js");
var cdnHand=require("./lib/cdnHand.js");

//object比较特殊，要调用其他资源
var objectHand=require("./lib/objectHand.js");


var dispatch={
url:urlHand,
// git:gitHand,
cdn:cdnHand,
object:objectHand
};


module.exports=dispatch;
