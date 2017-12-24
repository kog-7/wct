var parseArg=function(arg){
var out={};

if(!("concat" in arg)){
  return out;
}


if(!arg){return out;}
arg.forEach(function(ob,ind){
var type=ob.type,name=ob.name;
var ind="";
if(type.indexOf("cover")!==-1){
  out.cover=name;
}
else if(type.indexOf("wrap")!==-1){
  out.wrap=name;
}
else{
ind=type.lastIndexOf("-");
out[type.slice(ind+1)]=name;
}


});

return out;
};

module.exports=parseArg;
