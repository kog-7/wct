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
wct sub rm -f ./rm.js -o e=exclude&i=include

//run task
wct rm ./test -e node_modules

//help
wct --help

```

## task file

```

module.exports=function(arg,options){//arg just like ./test in  'wct rm ./test -e node_modules'  options.exclude get node_modules


return new Promise((resolve,reject)=>{
// detail task

});

}

```
