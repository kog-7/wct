var types=["git(","url(","cdn("];

var parseSource=function(val){

  if(!val){
    console.log("val is not defined in parseSource");
    return;
  }
if(typeof val==="object"){
  return {content:val,contentType:"object"}
}

var ctr=false;
var i=0,lg=types.length;
for(;i<lg;i+=1){
  if(val.indexOf(types[i])!==-1){
    ctr=true;
    break;
  }
}
if(ctr===false){
  return {content:val,contentType:"string"};
}
else{
  var newVal=val.slice(4,-1);
  var newType=val.slice(0,3);
  return {content:newVal,contentType:newType};
}
}



module.exports=parseSource;
