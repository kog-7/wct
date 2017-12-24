var path=require("path");

var parseType=function(attr,content,dist,lastMsg){
  var value;
  var nowPath="",allPath="",nextPath="";
  var pathType=null;
  if(attr===undefined){//没有attr表示为根目录
    nowPath="",allPath=dist,nextPath=dist;
    pathType="root";
  }
  else if(typeof attr==="number"){
    if(typeof content!=="object"){//直接为字符串，表示为路径,数组下没有内容
      nowPath=content,allPath=path.join(lastMsg,nowPath),nextPath=allPath;
      value="";
      pathType="create";//只创建没有内容写入，包括文件夹，空文件
    }
    else{
      nowPath="",allPath=lastMsg,nextPath=lastMsg;
      value="";
      pathType="none";//none的情况不做任何操作
    }
  }
  else{
    if(typeof content!=="object"){//可以写入的操作
      nowPath=attr,allPath=path.join(lastMsg,nowPath),nextPath=allPath;
      pathType="render";
      value=content;
    }
    else{
        nowPath=attr,allPath=path.join(lastMsg,nowPath),nextPath=allPath;
        pathType="create",value="";
    }
  }
  return {
    value:value,
    nowPath:nowPath,
    allPath:allPath,
    nextPath:nextPath,
    pathType:pathType
  }
}

module.exports=parseType;
