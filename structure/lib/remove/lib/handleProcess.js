var path=require("path");

var handle=function(currentOb, lastOb){
  var value = ""; //文件内容值
  var currentAttr = currentOb.attr,
      lastAttr = lastOb.attr;
  var currentContent = currentOb.content;
  if (currentOb.type === true) { //如果为数组，里面为字符串的时候，用值做属性，不过不能为对象数组
      if (typeof currentAttr === "number") {
          currentAttr = currentContent;
      } else if (typeof currentContent == "string") {
          value = currentContent;
      }
  };
  lastOb.attr = lastAttr = lastAttr ? lastAttr : ".";
  currentOb.attr = currentAttr = currentAttr ? currentAttr : ".";
  if (currentAttr) { //
      currentAttr = currentOb.attr = path.join(lastAttr, currentAttr);
  }
return {attr:currentAttr,value:value};
}
module.exports=handle;
