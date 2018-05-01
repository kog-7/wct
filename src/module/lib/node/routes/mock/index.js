var express = require('express');
var router = express.Router();
var nodepath=require('path');
var config=require('./config.js');
let fs=require('fs-extra');


// let root=config.root;
let {root,type='json',ext='',prefix=''}=config;

router.use('/',function(req,res,next){
  let {method,path,body,query}=req;
  let data=null;
  path=nodepath.join(prefix,path);

  if(ext&&nodepath.extname(path)===ext){
    path=nodepath.join(nodepath.dirname(path),nodepath.basename(path,ext));//去掉后最
  }

  if(method==='GET'){
    data=query;
  }
  else if(method==='POST'){
    data=body;
  }

  //运行
  if(type==='json'){
    fs.readJson(nodepath.join(root,nodepath.normalize(path))+'.json').then(function(obj){
      res.send(obj);
    })
    .catch(function(err){
      next(err)
    });
  }
  else{
    let run=null;
    try{
      run=require(nodepath.join(root,nodepath.normalize(path))+".js");
      let out=run(data,req);
      res.send(out);
    }
    catch(e){
      next();
    }
  }
});



module.exports = router;
