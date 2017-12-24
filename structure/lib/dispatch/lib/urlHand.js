var ifs = require("fs-extra");
var path = require("path");
var parseArg = require("../parseArg.js");
var insertString = require("../../tool/insertString.js");
var urlFun = function(src, dist, cback, arg, name, type) { //这里的name可以扩展为name:distname
  // console.log(name,2222);
  // console.log(name)

  var distName = "";
  var ind = name.indexOf(":");
  // console.log(ind);
  if (ind !== -1) { //如果有:表示目标文件夹
    distName = name.slice(ind + 1);
    name = name.slice(0, ind);
  }

  var arg = parseArg(arg);


  var ind2=name.indexOf("\/");
  if(ind2!==-1){
    var otherPath=name.slice(ind2+1);
    src=path.join(src,otherPath);//查找命令行中的子路径  wct -c ab/cd/e.js 取出cd/e.js
    name=name.slice(name.lastIndexOf("\/")+1);//name变成了最后的一个文件的名字,但是文件吗ab.js，这种暂时没有冲突，不改
  }





  // var wrap=arg.wrap;
  if ("wrap" in arg) { //值没有，但是-wrap有的话
    var wrap = arg.wrap;
    //  console.log(name,src,2222222);

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

    if (stats.isFile() && type !== "store") { //如果是文件的话，执行如下,同时满足不为存储store

      var read = ifs.createReadStream(src);
      // console.log(path.dirname(src));
      distName = distName ? distName : path.basename(src);
      var outFile=path.join(dist, distName);



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


          if(!error){//如果有文件



            if(cover===true){
              var write = ifs.createWriteStream(path.join(dist, distName));
              read.pipe(write);
              console.log(path.basename(src) + " is pipe to " + dist);
            }
            else if(ifInsert){

              ifs.readFile(src,'utf8',function(err,srcStr){

                ifs.readFile(outFile,'utf8',function(err,str){
                  var outStr=insertString(str,insert,srcStr,"append");
                  ifs.writeFile(outFile,outStr,"utf8",function(err){
                    if(err){console.log(err);}
                    else{
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
            var write = ifs.createWriteStream(path.join(dist, distName));
            read.pipe(write);
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


        // var statDir=function(dir,cbDir,cbFile){
        //   ifs.lstat(dir,function(err,stats){
        //     if(err){return;}
        //     if(stats.isSymbolicLink()){
        //       ifs.unlink(dir);
        //     }
        //     else if(stats.isDirectory()){
        //       if(typeof cbDir==="function"){
        //         cbDir(dir);
        //       }
        //     }
        //     else if(stats.isFile()){//处理文件还没管
        //       if(typeof cbFile==="function"){
        //         cbFile(dir);
        //       }
        //     }
        //   })
        // };
        //
        //
        // var checkDir=function(dist){
        //   ifs.readdir(dist,function(err,files){
        //     if(files.length===0){return;}
        //     // var baseDir=path.dirname(dist);
        //     var baseDir=dist;
        //     // console.log(files);
        //     files.forEach(function(filename,ind){
        //       statDir(path.join(baseDir,filename),checkDir);
        //     });
        //   });
        // };
        //
        //
        // checkDir(src);


        if (typeof cback === "function") {
          cback();
        }
      })

    }
  });


};


module.exports = urlFun;
