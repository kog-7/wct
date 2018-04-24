let nodepath=require("path");
let fs=require("fs-extra");
let configName='.wctconfig.json';

let promise_log=(filePath,name,type,des,commit,pushType='normal')=>{//是否有相关的日志文件，有就追加否者就。。

return new Promise((resolve,reject)=>{
  let ph=nodepath.join(filePath,configName);
  fs.stat(ph,(err,stats)=>{
    // console.log(stats.isFile())
  if(err||(!stats.isFile())){
    let obj={name,log:[{time:new Date(),action:type,commit}],description:des};
    fs.writeJson(ph,obj);
  }
  else{
    fs.readJson(ph)
    .then((obj)=>{
        let log=obj.log;
        if(des){obj.description=des;}
        log.push({time:new Date,action:type,commit,pushType});
        fs.writeJson(ph,obj)
        .then(()=>{
            resolve();
        })
        .catch((err)=>{

          reject(err);
        });
    })
    .catch((err)=>{

      reject(err);
    });

  }




});

})





};




module.exports=promise_log;

// export default promise_log;
