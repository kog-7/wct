var express = require('express');
var router = express.Router();
var nodepath=require('path');
var fs=require('fs-extra');
var config=require('./config.js');

let {prefix=''}=config;


//统一读文件
fs.readdir(nodepath.join(__dirname,'./lib'),function(err,files){
if(err){
  throw err;
}
else{
  files.forEach(function(file){
    let run=require("./lib/"+file);
    run(router);
  });
}
})

module.exports = router;
