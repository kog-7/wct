

let nodepath=require("path");
let fs=require("fs-extra");
let handleDir=require(nodepath.join(__dirname,'../../../services/handleDir.js'));
let utils=require(nodepath.join(__dirname,'../../../utils.js'));
let config=require('../config.js');

let run=function(router){




  router.get('/api/codeStore',function(req,res,next){
    let dir=[];

    let readDir=function(opt,lastOpt){
      return new Promise(function(resolve,reject){

        if(!config.base){
          res.send(`not have config store`);
          reject(`not have config store`);
          return;
        }

        let {root,description,log,done}=opt;
        if(done===true){
          dir.push({
            description,
            log,
            name:lastOpt.name
          })
          resolve(null);
        }
        if(root){

          fs.readdir(root,function(err,files){
            if(err){
              reject(err);
              return;
            }
            let out=[];

            let newFiles=[];
            files.forEach(function(fil,ind){//作为检查文件的状态
              newFiles.push({status:'pending',file:fil,callback:function(){
                for(let ff of newFiles){
                  if(ff.status==='pending'){
                    return;
                  }
                }
                resolve(out);
              }});
            });


            newFiles.forEach(function(obj){
              fs.stat(nodepath.join(root,obj.file),function(err,stats){
                if(err){
                  obj.status='done';
                  obj.callback();
                }
                else{
                  if(stats.isDirectory()){
                    out.push({name:obj.file,base:root});
                    obj.status='done';
                    obj.callback();
                  }
                  else{
                    obj.status='done';
                    obj.callback();
                  }
                }
              });
            });
          })
        }
        else{
          let url=nodepath.join(opt.base,opt.name,'.wctconfig.json');
          fs.readJson(url).then(function(obj){
            let {log=[],description}=obj;
            if(typeof log==="string"){log=[];}
            resolve([{description,log:log[log.length-1],done:true}]);
          }).catch(function(err){
             resolve([{description:"",log:"",done:true}]);
            // reject(err);
          })
        }
      });
    }




    handleDir({
      process:readDir,
      root:config.base,
      fail:function(err){
        res.send(utils.noSend(err));
        // res.send(utils.noSend(err));
      },
      done:function(){
        res.send(utils.yesSend(dir));
      }
    })




  });


};



module.exports=run;
