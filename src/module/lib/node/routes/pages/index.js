var express = require('express');
var router = express.Router();
var path=require('path');
var config=require('./config.js');

//静态文件，与renderFile类似，只是head等等，优先级不一样

let reqest=function(path,url,method='get'){
  router[method](path,function(req,res,next){
    res.sendFile(url,{},function(err){
      if(err){
        next();
      }
    });
  });
};


if(config&&config.routes){
  let {routes,root=""}=config;
  for(let key of Object.keys(routes)){//自定义，非自动路径查找
    let obj=routes[key];
    let {method,url}=obj;
    let fileUrl=path.join(root,url);
    request(key,fileUrl,method);
  };
}


//决定script link静态资源的加载
if(config&&config.root){
  router.use(express.static(config.root));
}


module.exports = router;
