
var branch=(function(){
var isFun=function(f){return (typeof f)==="function";},toArray=function(){
    return Array.prototype.slice.call(arguments[0], 0);
};
    var bra=function(){//id从零开始起
    if(!(this instanceof branch)){return new branch();}
    this._functions={},this._id=0,this._nextId=0;//单function，临时链路使用
    };
    bra.prototype={
        _middleFun:function(f,nextId){
            var funs=this._functions;
            return function(){
                var nextFun=funs[nextId];
                //这里为可能的最后运行，可以清除缓存
                if(!isFun(nextFun)){nextFun=function(){};}//表示结束function
                f.apply(nextFun,toArray(arguments));
            }
        },
        _wrap:function(f){//生成包裹函数，设置当前预售id
            //如下可以改成名字互动
            var nowId=this._id,nextId=this._id+=1;
            //注入当前的f
            this._functions[nowId]=this._middleFun(f,nextId);
        },
        get:function(f){
            if(!isFun(f))return false;
            this._wrap(f);
            return this;
        },
        run:function(){
            this._functions[0].apply(null,toArray(arguments));
            return this;
        }
    }
return bra;
})()

let parseFunc=(str)=>{
let reg=/([\w]+)\((.+)\)/gm;
let match=reg.exec(str);

if(!match){return false;}
else {

  return {
    nameType:match[1],
    nameContent:match[2]
  }
}
};

module.exports={
  branch,
  parseFunc
};
