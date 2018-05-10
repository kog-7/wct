let config=require('./config/index.js');
let exclude=require('./exclude/index.js');
let link=require('./link/index.js');
let pull=require('./pull/index.js');
let push=require('./push/index.js');
let remove=require('./remove/index.js');
let see=require('./see/index.js');
let rename=require('./rename/index.js');
let exec=require('./exec/index.js');
let lib=require('./lib/index.js');
let combine=require('./combine/index.js');

module.exports={
  combine,
  rename,
  see,
  remove,
  config,
  exclude,
  link,
  pull,
  push,
  exec,
  lib
}
