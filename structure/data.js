let cmdParse = require("./lib/tool/cmdParse.js");

class Data {

  constructor() {
    this.store = {};
  }


  init(md) {
    //cmdParse的接口输出不太好，data包装一下
    let cmds = cmdParse(md);
    //core   name:['...']  content:[命令行的比如url%./aaa 的./aaa]  contentType="为url/git/cdn这些"
    let {
      core,
      args
    } = cmds;
    let name = core.name,
      type = core.type,
      nameType = core.contentType,
      nameContent = core.content;
    Object.assign(this.store, {
      args,
      name,
      type,
      nameType,
      nameContent
    });
  }

  get(attr) {
    return attr && this.store[attr];
  }

  set() {

  }

}

let data = new Data();

module.exports = data;
