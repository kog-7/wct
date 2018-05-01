

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

            // files=files.sort(utils.sort);

            files.forEach(function(ff){
              out.push({
                name:ff,
                base:root
              });
            });
            resolve(out)
          })
        }
        else{
          let url=nodepath.join(opt.base,opt.name,'.wctconfig.json');
          fs.readJson(url).then(function(obj){
            let {log=[],description}=obj;
            if(typeof log==="string"){log=[];}
            resolve([{description,log:log[log.length-1],done:true}]);
          }).catch(function(err){
            reject(err);
          })
        }
      });
    }




    handleDir({
      process:readDir,
      root:config.base,
      fail:function(err){
        // res.send(utils.noSend(err));
      },
      done:function(){
        // console.log(9999)
        res.send(utils.yesSend(dir));
      }
    })




  });


};



module.exports=run;
