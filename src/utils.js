let cmdParse=require('./utils/cmdParse.js');
let chalk=require("chalk");
let branch=require("./utils/branch.js");
let explore=require("./utils/explore.js");
let wctPartParse=require("./utils/wctPartParse.js");
let fs=require("fs-extra");
let cwd=process.cwd();
let nodepath=require('path');
const fileMatch=require('micromatch');


let yesLog=(msg)=>{
  console.log(chalk.green(msg));
};

let noLog=(msg)=>{
  console.log(chalk.red(msg));
}
let msgLog=(msg)=>{
  console.log(chalk.blue(msg));
}


let branch_stat=(path)=>{
  return new Promise((resolve,reject)=>{
    fs.stat(path,(err,stats)=>{

      if(err){reject(err);}
      else if(stats.isFile()){
        resolve('file');
      }
      else if(stats.isDirectory()){
        resolve('dir');
      }
      else{
        reject();
      }
    });
  });
};

let branch_ifFile=(path)=>{
  return new Promise((resolve,reject)=>{
    fs.stat(path,(err,stats)=>{
      if(err){reject();}
      else if(stats.isFile()){
        resolve();
      }
      else{
        reject();
      }
    });
  });
};


let branch_readFile=(path)=>{

  return new Promise((resolve,reject)=>{
    fs.readFile(path,'utf8',(err,str)=>{
      if(err){
        reject(err);
      }
      else{
        resolve(str);
      }
    });
  })
};
let branch_readJson=(path)=>{
  return new Promise((resolve,reject)=>{
    fs.readJson(path).then((ob)=>{
      resolve(ob);
    })
    .catch((err)=>{
      resolve({})//直接传如对象
      // reject(err);
    });
  })
};


let branch_writeFile=(path,str)=>{
  return new Promise((resolve,reject)=>{
    fs.writeFile(path,str,'utf8',(err)=>{
      if(err){reject(err);}
      else{resolve();}
    });
  });
};
//wct-part-start
let absPath=(ph)=>{
  if(nodepath.isAbsolute(ph)){
    return ph;
  }
  else{
    return nodepath.join(cwd,ph);
  }
}
//wct-part-end

let promise_ensure=(ph)=>{

  return new Promise((resolve,reject)=>{
    if(ph.indexOf(".")===-1){
      fs.ensureDir(ph)
      .then(()=>{
        resolve();
      })
      .catch(err => {
        resolve(true);
      })
    }
    else{
      fs.stat(ph,(err,stats)=>{
        let exist=true;
        if(err){//不存在
          exist=false;
        }
        fs.ensureFile(ph,(err)=>{
          resolve(exist);
        });
      });

    }
  });
};
//wct-part-start
let absoluteCwdPath=(ph)=>{
  if(nodepath.isAbsolute(ph)){
    return ph;
  }
  else{
    return nodepath.join(cwd,ph);
  }
};

let quitSame=(arr1)=>{
  let out=[];
  arr1.forEach((obj)=>{
    if(out.indexOf(obj)===-1){
      out.push(obj);
    }
  });
  return out;
}


let concatExclude=(key,exclude,globalExclude)=>{
  let all=globalExclude['*'];
  let keyEx=null;
  if(key){keyEx=globalExclude[key];}
  let out=[];
  [exclude,keyEx,all].forEach((obj)=>{
    if(Array.isArray(obj)){
      out=out.concat(obj);
    }
  });
  out=quitSame(out);
  return out;
}



let matchArrayItem=(arr,str,basePath)=>{//数组里面有一个字符串是被包含在str当中的
  str=nodepath.normalize(str);
  basePath=nodepath.normalize(basePath);
  for(let item of arr){
    let realPath=nodepath.relative(basePath,str);
    realPath=realPath?realPath:"./";
    if(fileMatch.isMatch(realPath,item)){
      return true;
    }
  }
  return false;
};

let includeArrayItem=(arr,str)=>{//数组里面有一个字符串是被包含在str当中的
  str=nodepath.normalize(str);
  for(let item of arr){
    if(str.indexOf(item)!==-1){
      return true;
    }
  }
  return false;
};




let renamePath=(ph,name)=>{
  return nodepath.join(nodepath.dirname(ph),nodepath.basename(name)+nodepath.extname(ph));
};

let toBoolean=(tf)=>{
  if(tf===true||tf==='true'){return true;}
  else{return false;}
}


let objectArrayInclude=(arr,value,key)=>{
  let out=-1;
  let lg=arr.length;
  for(let i=0;i<lg;i+=1){
    if(arr[i][key]===value){
      return i;
    }
  }
  return out;
};



let includeKeys=(obj,keys=[])=>{//keys中有一个是obj的属性
  if(keys.length===0){return false;}
  let out=false;
  keys.forEach((key)=>{
    if(key in obj){
      out=true;
    }
  });
  return out;
};


let changeUrlPath=(url,ph)=>{
  let dirname=nodepath.dirname(url);
  return nodepath.join(dirname,ph);
};




let readObjectToPlain=(obj)=>{//根据数组，content,children解析,递归
  let out=[];
  let f=function(content){
    if(typeof content==='object'){
      if(Array.isArray(content)){
        content.forEach((ob,ind)=>{
          f(ob);
        })
      }
      else{
        let aim=content;
        out.push(aim.content);
        if(Array.isArray(aim.children)&&aim.children.length>0){
          f(aim.children);
        }
      }
    }
  };
  f(obj);
  return out;
}
//wct-part-end


module.exports={
  readObjectToPlain,
  changeUrlPath,
  objectArrayInclude,
  includeKeys,
  toBoolean,
  renamePath,
  includeArrayItem,
  concatExclude,
  absoluteCwdPath,
  promise_ensure,
  explore,
  branch_readJson,
  branch_stat,
  branch,
  branch_readFile,
  branch_ifFile,
  branch_writeFile,
  cmdParse,
  yesLog,
  noLog,
  msgLog,
  cwd,
  absPath,
  matchArrayItem,
  wctPartParse,
  isEmptyObject:(obj)=>{
    let keys=Object.keys(obj);
    if(keys.length===0){return true;}
    else{return false;}
  }
};
