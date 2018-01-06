#!/usr/bin/env node
let data=require("./structure/data.js");
let bootstrap=require("./structure/bootstrap.js");
let args = Array.prototype.slice.call(process.argv, 2);
data.init(args);//同步的
bootstrap();
