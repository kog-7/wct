var express = require('express');
var router = express.Router();
var path=require('path');
var config=require('./config.js');



router.use('/home',function(req,res,next){

  res.render('home',{},function(err,html){
    if(err){next(err);return;}
      res.send(html);
  });

});


//决定script link静态资源的加载
if(config&&config.assets){
  router.use(express.static(config.assets));
}


module.exports = router;
