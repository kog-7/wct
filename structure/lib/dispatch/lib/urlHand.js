var ifs = require("fs-extra");
var path = require("path");
var parseArg = require("../parseArg.js");
var insertString = require("../../tool/insertString.js");
var urlFun = function(opt) { //这里的name可以扩展为name:distname
  let {src,dist,callback,args,name="",type=""}=opt;
  var arg = parseArg(args);

  if(arg.rename){
    name=arg.rename;
  }
  let distName=name;
  var ind2=name.indexOf("\/");


  if(ind2!==-1){
    var otherPath=name.slice(ind2+1);
    src=path.join(src,otherPath);//查找命令行中的子路径  wct -c ab/cd/e.js 取出cd/e.js
    name=name.slice(name.lastIndexOf("\/")+1);//name变成了最后的一个文件的名字,但是文件吗ab.js，这种暂时没有冲突，不改
  }


  if ("wrap" in arg) { //值没有，但是-wrap有的话
    var wrap = arg.wrap;
    if (!name) {
      name = path.basename(src);
    }
    wrap = wrap ? wrap : name;
    dist = path.join(dist, wrap);
  }





  var cover = arg.cover; //默认为mkdirtrue覆盖

  if (cover === "false" || cover === false) {
    cover = false;
  }
  if (cover === "true" || cover === true) {
    cover = true;
  }
  else{
    // if()
    cover=false;
  }

  ifs.stat(src, function(error, stats) {

    // if (stats.isFile() && type !== "store") { //如果是文件的话，执行如下,同时满足不为存储store
    if (stats.isFile()) { //如果是文件的话，执行如下,同时满足不为存储store
      var read = ifs.createReadStream(src);
      // console.log(path.dirname(src));
      distName = distName ? distName : path.basename(src);

      let outFile="";

      if(type==='store'){
        outFile=dist;
      }
      else{
        outFile=path.join(dist, distName);
      }

      //在insert和cover 为true，或者文件不存在时候可以把内容放进去
      var ifInsert=false;
      var insert=/\?wct\?/gm;

      if("insert" in arg){
        if(arg.insert.trim()){
          insert=new RegExp(arg.insert,'gm');
        }
        ifInsert=true;


      }


      ifs.stat(outFile,function(error){

        //在文件快可以插入内容

        if(!error){//如果有文件,这个api暂时不开发，是追加文件用的。
          if(cover===true){
            let ph=path.join(dist, distName)
            if(type==='store'){
              ph=dist;//在文件下，不会再加上本地文件名，name就是文件名
            }
            var write = ifs.createWriteStream(ph);
            read.pipe(write);
            if (typeof callback === "function") {
              callback();
            }
            console.log(path.basename(src) + " is pipe to " + dist);
          }
          else if(ifInsert){//只用做create

            ifs.readFile(src,'utf8',function(err,srcStr){
              ifs.readFile(outFile,'utf8',function(err,str){
                var outStr=insertString(str,insert,srcStr,"append");
                ifs.writeFile(outFile,outStr,"utf8",function(err){
                  if(err){console.log(err);}
                  else{
                    if (typeof callback === "function") {
                      callback();
                    }
                    console.log(outFile+" insert success");
                  }
                });

              });

            });
          }
          else{
            console.log(outFile+" is exit")
          }
        }
        else{
          let ph=path.join(dist, distName)
          if(type==='store'){
            ph=dist;//在文件下，不会再加上本地文件名，name就是文件名
          }

          var write = ifs.createWriteStream(ph);
          read.pipe(write);
          if (typeof callback === "function") {
            callback();
          }
          console.log(path.basename(src) + " is pipe to " + dist);
        }
      });



    } else {

      ifs.copy(src, dist, {
        overwrite: cover
      }, function(err) {
        if (err) {
          console.log(err);
        }
        console.log(path.basename(src) + " is pipe to " + dist);


        if (typeof callback === "function") {
          callback();
        }
      })

    }
  });


};


module.exports = urlFun;
