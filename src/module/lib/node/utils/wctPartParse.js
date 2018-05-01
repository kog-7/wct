let wctPartParse=(str)=>{
  var anaOut=[],regTag = new RegExp('wct-part-start',"g");
  var f=function(htm,lastTagOb){
    lastTagOb=lastTagOb?lastTagOb:anaOut;
    var nowTagOb=null;
    var regContent,contentMatch = null,no = 0;
    var lf = "",rt = "";//左右的位置
    var tagMatch = null,tagName=null,tagContent=[];//标签名,标签内容
    var right = "";//余下的html解析
    var out = [],temp = [];//解析后的
    var tempHtml = "";
    tagMatch = regTag.exec(htm);//得到映射到的标签内容

    if(!tagMatch){return;}
    regTag.lastIndex=0;
    do {//使用no进行前后数字相加
      if (no === 0) {//no为计算标签闭合的情况
        tagName=tagMatch[1];
        regContent = new RegExp('(wct-part-start)|(wct-part-end)', "g"),contentMatch = regContent.exec(htm);//以真正tag的方式来识别标签
        lf = [contentMatch.index, regContent.lastIndex];//一个新的正则周期开始
      } else {
        contentMatch = regContent.exec(htm);//当前的正则周期
      }


      contentMatch&&(contentMatch[2]?no-=1:no+=1);

      if (no === 0) {

        rt = [contentMatch.index, regContent.lastIndex];//不停的记录标签值，计算到尾标签
        tempHtml = htm.slice(lf[1], rt[0]);//开始一部分的内容

        //解析成html，再次待解析
        nowTagOb=[];
        // tagContent.push({children:nowTagOb,content:tempHtml});
        lastTagOb.push({children:nowTagOb,content:tempHtml})
        f(htm.slice(lf[1], rt[0]),nowTagOb);
        //覆盖等于右边的htm字符串，再次解析
        htm = right = htm.slice(rt[1]);
        //开始一次新的遍历
        tagMatch = regTag.exec(right);
        regTag.lastIndex=0;
        // out = out.concat(temp)
      }
    } while (contentMatch && tagMatch);

    // lastTagOb.aim=tagContent;
  }
  f(str);

  return anaOut;
};

module.exports=wctPartParse;
