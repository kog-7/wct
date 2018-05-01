let path=require('path');

let config={
root:path.join(cwd,'mock-data'),
prefix:'',//前缀
ext:'.json',//请求的后缀
type:'js'//有js/json两种mock模式
}


module.exports=config;
