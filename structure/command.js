let feature = require("./feature");
let path = require("path");

let dispatch=require("./lib/dispatch/index.js");
let removeDispatch=require("./lib/remove/index.js");
let linkHandle=require("./lib/link/index.js");

let ifs=require("fs-extra");
let cwd=process.cwd();
let chalk=require("chalk");

let writeStore=require("./lib/store/index.js")

let data=require("./data.js");
let config=require("./config.js");
let utils=require("./utils.js");


let create = function(args=data.get("args")) {//参数可以配置加入
  let nameArr=data.get("name"),nameTypeArr=data.get("nameType"),nameContentArr=data.get("nameContent"),type=data.get("type");
  let {dir,store,wctfile}=config;
  let src="";
  let storeCopyPath=path.join(dir,"/copy");

  nameArr.forEach((name,ind)=>{

    let nameType=nameTypeArr[ind],nameContent=nameContentArr[ind];
    if(nameType&&nameContent){//使用参数的情况
      src=nameContent;
    }
    else{//使用wctfile或者store的情况
      if(name in store){//优先读取store的
        src=path.join(storeCopyPath,name);
        nameType="url";
      }
      else if(wctfile&&(name in wctfile)){//需要解析类型

        let cont=wctfile[name];
        if(typeof cont==="object"){//如果是对象生成
          nameType="object",src=cont;
        }
        else if(typeof cont==="string"){
          let out=utils.parseFunc(cont);
          if(out===false){console.log(chalk.red(`wctfile ${name} format is wrong`));}
          else{
            src=out.nameContent;
            nameType=out.nameType;
          }//可能微url，cdn等等
        }
      }
      else{
        console.log(chalk.red(`no ${name} in store/wctfile`));
        return;
      }

    }

    if(!(nameType in dispatch)){
      console.log(chalk.red(`${nameType} is not a useful commandtype in create/install`));
      return;
    }
    dispatch[nameType]({src,dist:cwd,args,name});
  });
}


let install = function() {
  let args=data.get("args");
  let wrap={type:"-wrap",name:data.get("name")[0]};
  args.forEach((obj,ind)=>{
    if(/^(-rename)|(--rename)$/g.test(obj.type)){
        wrap.name=obj.name;
    }
  });
  args.unshift(wrap);
  create(args);
}



let remove=function(){//remove只读取本地wctfile的内容
  let nameArr=data.get("name"),nameTypeArr=data.get("nameType"),nameContentArr=data.get("nameContent"),type=data.get("type");
  let args=data.get("args");
  let {dir,store,wctfile}=config;
  nameArr.forEach((name,ind)=>{
    let nameType=nameTypeArr[ind],nameContent=nameContentArr[ind];
    let src="";
    if(nameType&&nameContent){
      src=nameContent;
    }
    else{//只能在wctfile里面选择
      if(wctfile&&(name in wctfile)){
        let cont=wctfile[name];
        if(typeof cont==="object"){//如果是对象生成
          nameType="object",src=cont;
        }
        else if(typeof cont==="string"){
          let out=utils.parseFunc(cont);
          if(out===false){console.log(chalk.red(`wctfile ${name} format is wrong`));}
          else{
            src=out.nameContent;
            nameType=out.nameType;
          }//可能微url，cdn等等
        }
      }
    }
    if(!(nameType in removeDispatch)){
      console.log(chalk.red(`${nameType} is not a useful commandtype in remove `));
      return;
    }
    removeDispatch[nameType]({src,dist:cwd});
  });
};


let link=function(){//link只读取本地wctfile的内容
  let nameArr=data.get("name"),nameTypeArr=data.get("nameType"),nameContentArr=data.get("nameContent"),type=data.get("type");
  let args=data.get("args");
  let {dir,store,wctfile}=config;
  var copyDir=path.join(dir,"/copy");
  nameArr.forEach(function(name, ind) {//必须要有name
    if(!(name in store)){
      console.log(name+" is not stored,can't be linkd");
      return;
    }
    linkHandle.link(path.join(copyDir,name),path.join(cwd,name),name);
  });
};

let unlink=function(){//link只读取本地wctfile的内容
  let nameArr=data.get("name"),nameTypeArr=data.get("nameType"),nameContentArr=data.get("nameContent"),type=data.get("type");
  let args=data.get("args");
  let {dir,store,wctfile}=config;
  nameArr.forEach(function(name, ind) {//必须要有name
    if(!(name in store)){
      console.log(name+" is not stored,can't be unlinked");
      return;
    }
    linkHandle.unlink(path.join(cwd,name),name);
  });
};

let store = function() {
  let nameArr=data.get("name"),nameTypeArr=data.get("nameType"),nameContentArr=data.get("nameContent"),type=data.get("type");
  let args=data.get("args");
  let {dir,store,wctfile}=config;
  let copyDir=path.join(dir,"/copy");
  let storeFile=path.join(dir,"/store.js");

  nameArr.forEach(function(name, ind) {//必须要有name
    let nameType=nameTypeArr[ind],nameContent=nameContentArr[ind];
    if(nameType&&nameContent){
      src=nameContent;
    }
    else{
      if(wctfile&&(name in wctfile)){
        let cont=wctfile[name];
        if(typeof cont==="object"){//如果是对象生成
          nameType="object",src=cont;
        }
        else if(typeof cont==="string"){
          let out=utils.parseFunc(cont);
          if(out===false){console.log(chalk.red(`wctfile ${name} format is wrong`));}
          else{
            src=out.nameContent;
            nameType=out.nameType;
          }//可能微url，cdn等等
        }
      }
    }

    if(!(nameType in dispatch)){
      console.log(chalk.red(`${nameType} is not a useful commandtype in store `));
      return;
    }

    dispatch[nameType]({
      src,
      dist:copyDir,
      type:"store",
      callback(){
        var str="gbl['"+name+"']=\"yes\";\n";
        writeStore(storeFile,str);
      },
      args:[{type:"-wrap",name:name},{type:"-cover",name:true}],
      name
    });


  });
};



module.exports = {
  create,
  remove,
  store,
  link,unlink,
  install
}
