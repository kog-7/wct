let nodepath = require('path');
const utils = require("../../utils.js");
const fs = require("fs-extra");


let argsHandle={
  types:[
    {
      key: 'webq',
      change: (ph) => {
        return new Promise((resolve,reject)=>{
          if (typeof ph === 'string' && ph.indexOf('url:') === 0 && nodepath.basename(ph.slice(4)).indexOf('.json') !== -1) {
            resolve(ph);
          } else {
            resolve(false);
          }
        })
      },
      des: 'use -url some json file path',
      rename: 'webq.json'
    },
    {
      key: 'cmd',
      change: (ph) => {
        return new Promise((resolve,reject)=>{
          if (typeof ph === 'string' && ph.indexOf('url:') === 0 && nodepath.basename(ph.slice(4)).indexOf('.json') !== -1) {
            resolve(ph);
          } else {
            resolve(false);
          }
        })
      },
      des: 'use -url some json file path',
      rename: 'cmd.json'
    }
  ],
  part:{
    key: 'part',
    change: (ph) => {
      return new Promise((resolve,reject)=>{
        if (typeof ph === 'string' && ph.indexOf('url:') === 0) {
          fs.readFile(ph.slice(4), 'utf8', function(err, str) {
            if(err){reject(err);return;}
            let out = utils.wctPartParse(str);
            let plain = utils.readObjectToPlain(out);
            let outStr = plain.join('\n');
            resolve({[ph.slice(4)]:outStr});
          });
        }
        else{
          resolve(false);
        }
      })
    },
    des: 'use -url some  file path',
    rename: null
  }

}


module.exports = argsHandle;
