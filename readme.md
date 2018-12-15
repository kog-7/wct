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
//see config 
wct where

//subscribe task,-o config custom cmd option ,-d config cmd source dir(if have package.json,will install dependencies auto),-f config cmd source file.
wct sub rm -o exclude="remove exclude dir",include     //use current cwd directory path
wct sub rm ./remove exclude="remove ..",include    //use special directory path 

//run task
wct rm ./test --exclude node_modules //use --exclude or -e, -e node_modules,cache


//help
wct --help

```

## task file

```
module.exports=function(args,options){  //args:string[],options.exclude:string[]
return new Promise((resolve,reject)=>{
// detail task

});

}

```
