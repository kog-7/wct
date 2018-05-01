var mongoose = require('mongoose');
var config=require('./config.js');
mongoose.createConnection(config.url);
var Schema = mongoose.Schema;
var allSchema= new Schema(config.schema);


// allSchema.methods.find=function(){
//
//
// };
//
// animalSchema.statics.findByName=function(){
//
//
// }
//
// animalSchema.query.byName=function(queryData){
//
//
// };

/**
 * 连接
 */
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL,{useMongoClient:true});

/**
  * 连接成功
  */
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});


/**
 * 连接异常
 */

mongoose.connection.on('error',function (err) {
    console.log(chalk.red('Mongoose connection error: ' + err));
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});




let out={
  models:{},
  get(name){
    return out.models[name];
  },
  create(name,fail=function(){}){
    let models=out.models;
    if(name in modules){
      fail(`${name} have in models`);
      return false;
    }
    let model=models[name]=mongoose.model('Animal', allSchema);
    return model;
  },
  connectFind(){//


  }
};




module.exports=out;
