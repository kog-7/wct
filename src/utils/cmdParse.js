let nodepath=require('path');

let type=(arr)=>{
  let lg=arr.length;
  if(lg===0){
    return '0';
  }
  else if(lg===1){
    return '1';
  }
  else{
    return 'multiple';
  }
};

let parse=(arr)=>{
  let lg=arr.length;
  let cmd=arr.slice(0,2),totalArg=arr.slice(2);
  let arg={};
  let lastAttr=null;

  let reg=/^[-]+(\w+)$/;
  totalArg.forEach((cont,ind)=>{
    let match=reg.exec(cont);
    if(match){
      lastAttr=match[1];
      arg[lastAttr]=[];
    }
    else if(lastAttr){
      arg[lastAttr].push(cont);
    }
  });
  return {
    cmd,
    arg
  }
};


module.exports={
  parse,
  type
};
