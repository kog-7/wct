

let nodepath=require("path");
let fs=require("fs-extra");
let utils=require(nodepath.join(__dirname,'../../../utils.js'));
let config=require('../config.js');
const mime=require('mime');
let run=function(router){

  router.get('/api/readFile',function(req,res,next){
    let {query}=req;

    if(!query.url){
      res.send(utils.noSend('no Url be write'));
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

      let mimeType=mime.getType(query.url);

      if(mimeType.indexOf('image')!==-1){
        res.send(utils.yesSend(`not support image temporary`));
      }
      else if(mimeType.indexOf('video')!==-1){
        res.send(utils.yesSend(`<not support video temporary`));
      }
      else if(mimeType.indexOf('audio')!==-1){
        res.send(utils.yesSend(`not support audio temporary`));
      }
      else{
        fs.readFile(query.url,'utf8',function(err,str){
          if(err){
            res.send(utils.noSend(err));
          }
          else{
            res.send(utils.yesSend(str));
          }
        });
      }





    });



  });



};



module.exports=run;
