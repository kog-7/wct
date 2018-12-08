# wct

custom commands && store commands && run commands in your work

![](https://img.shields.io/npm/v/wct.svg?style=flat)

## Installation

```
npm install wct -g
```

## example

```js
//where the cmds store
wct config ./somedir

//subscribe task,-o config custom cmd option ,-d config cmd source dir(if have package.json,will install dependencies auto),-f config cmd source file.
wct sub rm -d ./dir -o e=exclude&i=include
wct sub rm -f ./rm.js -o e=exclude&i=include

//run task
wct rm ./test -e node_modules

//help
wct --help

```

## task file

```
module.exports=function(arg,options){//arg just like ./test in  'wct rm ./test -e node_modules'  options.exclude  node_modules

return new Promise((resolve,reject)=>{
// detail task

});

}

```
