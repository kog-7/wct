var typeHim = function(dm) {
    if (dm === undefined) {
        return "undefined";
    }
    if (dm === null) {
        return "null";
    }
    var tp = typeof dm;
    if (tp === "string" || tp === "number" || tp === "function") {
        return tp;
    }
    tp = Object.prototype.toString.call(dm);
    if (tp.indexOf("rray") !== -1 || tp.indexOf("rguments") !== -1) {
        return "array";
    } else if (tp.indexOf("ragment") !== -1) {
        return "fragment"
    } else if (tp.indexOf("odeList") !== -1) {
        return "nodelist";
    } else if (tp.indexOf("lement") !== -1) {
        return "node";
    } else if (tp.indexOf("egExp") !== -1) {
        return "regexp";
    } else if (tp.indexOf("bject") !== -1) {
        return "object";
    } else {
        return false;
    }
};

var syncRecall = (function() {
    var regAll = function(ob, filter) { //还要得到fitler

        var tp = typeHim(ob);
        var out = [];
        var dataType=true;
        if (tp === "array") {

            ob.forEach(function(ar, ind) {
              dataType=(ar&&typeof ar==="object")?false:true;
                out.push({
                    type: dataType,
                    content:ar,
                    attr:ind
                })
            });
        } else if (tp === "object") {
            for (var attr in ob) {
                dataType=(ob[attr]&&typeof ob[attr]==="object")?false:true;
                out.push({
                    type: dataType,
                    content:ob[attr],
                    attr:attr.toString()
                });
            }
        } else {
            out = false;
        }
        return out;
    };

    // combine是把处理的所有数据最后怎么合并起来，可以不用

    return function(opt) { //

        var config = opt.config,
            filter = opt.filter,
            callback = opt.callback,
            combine = opt.combine;
        var proc = opt.process,trace=opt.trace;
        proc=proc?proc:function(a,b,cb){//直接向后奏
            cb();
        };

        // var first=0;
        //filter作为数据映射，，标识--映射为--数据---处理数据
        var mark = []; //防止冲突

        function f(dataArr, lastOb, cback,lastMsg) {

            // console.log(dataArr)

            dataArr.forEach(function(ob, ind) {
              // console.log(ob,111)
                var type = ob.type,
                    content = ob.content;
                var regOut = null;
                if (type === false) {//content是实体
                    //进行数据-处理数据的映射
                    // regOut=regAll(content,filter);
                    // regOut = regAll(filter, content);
                    _middleProcess(ob,_recall,lastOb,lastMsg);
                    }
                    else{
                        _middleProcess(ob,_recall,lastOb,lastMsg);
                    }
              });

            function _recall() { //下一步回调相关的数据,可能是很后面运行的
                var complete = true;
                // console.log(dataArr)
                dataArr.forEach(function(ob, ind) {
                    // console.warn(ob.content);
                    (ob.type !== true) && (complete = false);
                });

                if (complete === true) {
                    var data = "";
                    (typeof combine === "function") && (data = combine(dataArr));
                    lastOb && (lastOb.type = true, lastOb.content = data)
                    if (typeof cback !== "function") {
                        (typeof callback === "function") && callback(lastOb.content); //最终的运行
                    } else {
                      if(typeof trace==="function"){
                        //向上
                        trace(lastOb,dataArr,cback);
                      }
                      else{
                        cback();
                      }

                    }
                }
            };



            _recall();

        };





//needMsg是content的内容
        function _middleProcess(obj,reCallback,lastOb,lastMsg){//needMsg为映射后的数据，
          var type=obj.type,attr=obj.attr,needMsg=obj.content;
                var _wrapF=function(nextMsg){
                // var initData={type:false,content:contentMsg};
                // var initDatas=[initData];

                  if(type===false){
                  var initDatas=regAll(needMsg,filter);
                  f(initDatas,obj,reCallback,nextMsg);
                  }
                  };
                
                proc.apply(null,[obj,lastOb,lastMsg,_wrapF]);//lastMsg写在最后，可能以后要改
        };

        var initData = {
            type: false,
            content: config
        };
        var initDatas = [initData];
        f(initDatas, initData);
    }
})();


module.exports = syncRecall;
