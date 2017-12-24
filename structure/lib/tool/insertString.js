var stringReadInsert=function(str,reg,content,ifAppend){//ifAppend表示是否添加新的内容到后面。当reg没有匹配到的话
var ts=this;
var out="";
var match="",matchStr,ind,middleStr;
var lastInd=0;
var ctr=false;

while(match=reg.exec(str)){
  ctr=true;
  matchStr = match[0];
 ind = match.index, middleStr = str.slice(lastInd, ind), out += middleStr+content;
 lastInd = reg.lastIndex;
}

if(ctr===false){
  if(ifAppend==="append"){
    str=str+content;
  }
  return str;
}
else{
  out+=str.slice(lastInd);
  return out;
}
};


module.exports=stringReadInsert;
