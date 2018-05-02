// let cwd=process.cwd();
let nodepath=require("path");
let fs=require("fs-extra");
let handleDir=require(nodepath.join(__dirname,'../../../services/handleDir.js'));
let utils=require(nodepath.join(__dirname,'../../../utils.js'));
let config=require('../config.js');

let run=function(router){

  router.get('/api/loopDir',function(req,res,next){



    let dir=[];
    let {query}=req;
    let readDir=function(opt,lastOpt){
      return new Promise(function(resolve,reject){


        if(!config.base){
        res.send(`not have config store`);
        reject(`not have config store`);
        return;
        }


        let {root,done,base,name,fromStore=dir}=opt;

        let url=""
        if(!lastOpt){//初始
          url=root
          name=nodepath.basename(root);
        }
        else{
          url=nodepath.join(base,name);
        }

        utils.branch_stat(url)
        .then(function(type){

          if(type==='dir'){
            fs.readdir(url,function(err,files){
              if(err){reject(err);}
              else{
                if(files.length===0){
                    fromStore.push({
                      url,
                      type:'dir',
                      children:[],
                      name
                    });
                  resolve(null);
                }
                else{
                    let childArr=[];

                    let newObj={
                      name,
                      url,
                      type:'dir',
                      children:childArr
                    }
                    fromStore.push(newObj);
                    let out=[];
                    // files.sort(utils.sort);
                    files.forEach(function(ff){
                      out.push({
                        name:ff,
                        base:url,
                        fromStore:childArr
                      })
                    });
                  resolve(out);

                }
              }
            });

          }
          else if(type==="file"){
            if(name===".wctconfig.json"){resolve(null);return;}
            fromStore.push({
              url,
              type:'file',
              name,
              children:[]
            });
            resolve(null);


          }


        })
        .catch(function(err){

          reject(err);
        })


      });
    }



    handleDir({
      process:readDir,
      root:nodepath.join(config.base,query.name),
      fail:function(err){
        res.send(utils.noSend(err));
      },
      done:function(){
        dir=dir[0]?dir[0].children:[];
        res.send(utils.yesSend(dir));
      }
    })
  });


};



module.exports=run;
