# wct

custom cmd

![](https://img.shields.io/npm/v/wct.svg?style=flat)

## Installation

```
npm install wct -g
```

## example

```js
//config dir,which store cmd tasks
wct config ./somedir

//subscribe task,rm.js is task detail file
wct sub rm -f ./rm.js -o e=exclude+i=include

//run task
wct rm ./test -e node_modules

//help
wct --help

```

## task file

```
//if there are some deps in task just like fs-extra and so on,must install deps in dir which in 'wct config ./somedir'

module.exports=function(arg,options){//arg just like ./test in  'wct rm ./test -e node_modules'  options.exclude get node_modules


return new Promise((resolve,reject)=>{
// detail task

});

}

```
