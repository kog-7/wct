let nodepath=require("path");
let fs=require("fs-extra");
let utils=require(nodepath.join(__dirname,'../../../utils.js'));
let config=require('../config.js');
const mime=require('mime');
let run=function(router){
  router.post('/api/saveFile',function(req,res,next){
    let {body}=req;
    if(!body.url){
      res.send(utils.noSend('no Url'));
      return;
    }
    //判断是否为文件
    fs.stat(body.url,(err,stats)=>{
      if(err){
        res.send(utils.noSend(err));
        return;
      }
      if(!stats.isFile()){
        res.send(utils.noSend('only file'));
        return;
      }

      let mimeType=mime.getType(body.url);
      if(mimeType.indexOf('image')!==-1){
        res.send(utils.noSend(`not support image temporary`));
      }
      else if(mimeType.indexOf('video')!==-1){
        res.send(utils.noSend(`<not support video temporary`));
      }
      else if(mimeType.indexOf('audio')!==-1){
        res.send(utils.noSend(`not support audio temporary`));
      }
      else{
        fs.writeFile(body.url,body.value,'utf8',function(err,str){
          if(err){
            res.send(utils.noSend(err));
          }
          else{
            res.send(utils.yesSend(`${body.url} save success`));
          }
        });
      }

    });

  });

};



module.exports=run;
