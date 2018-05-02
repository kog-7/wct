const fs=require("fs-extra");
let nodepath=require("path");
let utils=require("../utils.js");
const explore=utils.explore;

let isObject=(obj)=>{
  return typeof obj==='object'&&(!Array.isArray(obj));
};


let parseChildren=(content,lastName)=>{
  let out=[];
  if(isObject(content)){
    for(let key of Object.keys(content)){
      // let newp=key;
      // if(lastName){newp=nodepath.join(lastName,key);}
      out.push({name:key,content:content[key]});
    }
  }
  else if(Array.isArray(content)){

    for(let [key,value] of content.entries()){
      // let newp=key;
      // if(lastName){newp=nodepath.join(lastName,value);}
      out.push({name:value});
    }
  }
  return out;
};


let writeUrl=({path,url,resolve,reject,cover,exclude,rename,wrap})=>{//path为目标path
  if(rename&&typeof rename==='string'){//根据特定的目的，更改path名字，达到wct type解析，类似webq
    path=nodepath.join(path,rename);
  }
  else if(nodepath.basename(url).indexOf('.')!==-1){
    path=nodepath.join(path,nodepath.basename(url));
  }
  let absUrl=utils.absoluteCwdPath(url);
  if(path.indexOf(absUrl)!==-1){//死循环
    utils.noLog(`${path} include ${absUrl},trigger dead loop`);
    reject(`${path} include ${absUrl},trigger dead loop`);
    return;
  }




  if(utils.toBoolean(wrap)===true){//path再叠加一个absUrl的name,比如直接上传文件夹，而不是拆分内容
    path=nodepath.join(path,nodepath.basename(absUrl));
  }



  fs.copy(absUrl,path,{overwrite:cover,filter:(sourcePath)=>{

    if(utils.matchArrayItem(exclude,sourcePath,absUrl)){
      return false;
    }
    else{
      return true;
    }
  }})
  .then(()=>{
    resolve()
  })
  .catch((err) => {
    reject(err);
  })
};


let writeCdn=(path,url,resolve,reject,cover)=>{

};


let writeString=({path,url,resolve,reject,cover,append})=>{

if(append===true&&cover===false){//cover的权限更高
  fs.appendFile(path,url,(err)=>{
    if(err){reject(err)}
    else{resolve();}
  });
}
else{
  fs.writeFile(path,url,'utf8',(err)=>{
  if(err){reject(err)}
  else{resolve();}
  });
}
}


//全部是xxx:的语法
let writeAction=({path,url,resolve,reject,cover,exist,exclude,rename,append,wrap})=>{//ph为目标路径
  if(url.indexOf("url:")===0){
    writeUrl({path,url:url.slice(4),resolve,reject,cover,exclude,rename,append,wrap});
  }
  else if(url.indexOf('cdn:')===0&&append===false){
    if(exist===true&&cover===false){
      utils.yesLog(`notice:${path} is exist,if you want to change content,use -cover true`)
      resolve();
    }
    else{
      writeCdn(path,url.slice(4),resolve,reject,cover);
    }
  }
  else{
    if(exist===true&&cover===false&&append===false){
      utils.yesLog(`${path} is exist,if you want to change content,use -cover true`)
      resolve();
    }
    else{
        writeString({path,url,resolve,reject,cover,append});
    }
  }
};





let promiseRun=({append,cover,exclude,wrap})=>{
return function(obj,lastObj){
lastObj=lastObj?lastObj:{};
    let {name,content,rename}=obj;
    let {name:lastName,content:lastContent}=lastObj;
    return new Promise((resolve,reject)=>{
      if(utils.includeArrayItem(exclude,name)){//如果名字就包含了，则
        resolve(null);
        return;
      }
      if(name){
        if(lastName){name=nodepath.join(lastName,name),obj.name=name;}
        utils.promise_ensure(name)
        .then((exist)=>{
          if(typeof content==="string"){

            writeAction({path:name,url:content,resolve,reject,cover,exist,exclude,rename,append,wrap});
          }
          else if(typeof content==='object'&&content!==null){
            let arr=parseChildren(content,name);
            resolve(arr);
          }
          else{
            resolve(null);//其他情况
          }
        })
        .catch((err)=>{
          reject(err);
        });
      }

})

  }
};


let promise_parseObjectResource=(opt)=>{
  return new Promise((resolve,reject)=>{
    let {content={},dist=null,cover=false,exclude=[],rename,append=false,wrap}=opt;
    let exp=new explore();

    utils.yesLog(`is creating process,please waiting ......`);
    exp.setCallback(()=>{
      utils.yesLog(`created to ${dist} done`);
      resolve();
    });
    exp.setError(err=>{
      reject(err);
    });
//rename用于特殊的push type，主要针对单file类型,转为固定可以被识别的文件名
    exp.parse(promiseRun({append,cover,exclude,wrap})).run({input:{name:dist,content,rename}});
  });

};

module.exports=promise_parseObjectResource;
