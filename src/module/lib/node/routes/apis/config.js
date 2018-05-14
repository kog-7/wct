let args = Array.prototype.slice.call(process.argv, 2);
// args=['d:/codeStore/store'];
let config={
  prefix:'api',
  base:args[0]
};



module.exports=config;
