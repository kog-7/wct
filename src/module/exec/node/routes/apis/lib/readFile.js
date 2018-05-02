

let nodepath=require("path");
let fs=require("fs-extra");
let utils=require(nodepath.join(__dirname,'../../../utils.js'));
let config=require('../config.js');

let run=function(router){

  router.get('/api/readFile',function(req,res,next){
    let {query}=req;

    if(!query.url){
      res.send(utils.noSend('no Url'));
      return;
    }
    //判断是否为文件
    fs.stat(query.url,(err,stats)=>{
      if(err){
        res.send(utils.noSend(err));
        return;
      }
      if(!stats.isFile()){
        res.send(utils.noSend('only file'));
        return;
      }
      fs.readFile(query.url,'utf8',function(err,str){
        if(err){
          res.send(utils.noSend(err));
        }
        else{
          res.send(utils.yesSend(str));
        }

      });


    });



  });



};



module.exports=run;
