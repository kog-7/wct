let path=require('path');
const cwd=process.cwd();
let config={
// routes:{
//   '/a':{url:'index.html'}
// },
root:path.join(cwd, 'public/dist')
}



module.exports=config;
