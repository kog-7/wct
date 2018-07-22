let data=require('./data.js');
let utils=require("./utils.js");
let modules=require('./module/index.js');
let create=require('./create/index.js');
let tool=require('./tool/index.js');


let bootstrap=()=>{
  let {cmdStore}=data;
  let {type,content}=cmdStore;
  if(type==='0'){
    create().then(()=>{
      utils.yesLog('wctfile.js is created');
      return;
    })
    .catch((err)=>{
      utils.noLog(err);
    })
  }
  // else if(type==='1'){
  //   tool().then(()=>{
  //     utils.yesLog('config task is done');
  //   })
  //   .catch((err)=>{
  //     utils.noLog(err);
  //   })
  // }
  else if(type==='multiple'||type==='1'){

    let {cmd,arg}=content;
    let [key,value]=cmd;//cmd是一个2位数组

    if(data.feature.indexOf(key)===-1){//暂时只做排除法
      // utils.noLog(`${key} cmd is not supported`);
      tool().then(()=>{
        utils.yesLog('config task is done');
      })
      .catch((err)=>{
        utils.noLog(err);
      })
      return;
    }
    else{
      modules[key](value).then(()=>{

        // console.log()
      })
      .catch((err)=>{
        // console.log(err);
      });
    }

  }

};


module.exports=bootstrap;
