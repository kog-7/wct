#   wct   #

manage components,commands,scaffolding,useful files local

![](https://img.shields.io/npm/v/wct.svg?style=flat)


## Installation

```
npm install wct -g
```


## example

```
//base use

wct config C:\codeStore    //storage warehouse
wct exclude * -doc node_modlue   //exclude dir or file in all push command

...somedir > wct push component1  //push your code
...somedir > wct pull component1  //pull your code

// special handle,special treatment upload code
wct exec q-react -type webq
wct exec computer-start -type cmd

//create wctfile.js
...somedir > wct

//base tool
..somedir >wct a/b/c/k.js   ..somedir > wct rm:a/b
```

## api

### config,before use wct,must define a code storage warehouse

```
wct config C:\codeStore
```

### exclude,set dir&file which are not uploaded

exclude use micromatch to filte path   [micromatch](https://www.npmjs.com/package/micromatch){:target="_blank"}


```
// use * for all the upload.it only exclude some dir when push react-material if use wct exclude react-material -doc ..
//not push node_modlue  and .git dir

wct exclude * -doc node_modlue someDir/*.md

```

### push, push code to storage warehouse



```
//push current dir and named react-redux-material then upload
..somedir > wct push react-redux-material

// use special dir to upload
..somedir > wct push react-redux -url ./dist

// create content via use wctfile config
// in wctfile.js: module.exports={push:{material:['a.js','url(./a/b)','c.js']}}
..somedir > wct push react-redux-material -wctfile material

// use special object to upload
..somedir > wct push react-redux -object {'a':{'b':['a.html']},'b.js'}

// cover true cover the already existing content
//exclude ,exclude push path for current push task
// commit ,current push commit instruction
// des ,  this lib description
...somedir > wct push react-redux -cover true -exclude dist -commit "change cont"   -des "this is use for..."

// push string  between wct-part-start and wct-part-end in file
..somedir > wct push somename -url ./a.js -part true


/* exec tool push,must push json file */
1: webq - some websites collection in one page
//some.json is like [{"name":"react","des":"office web","link":"https://reactjs.org/docs/hello-world.html"}]
...someDir > wct push q-react -url ./some.json -type webq
2: cmd -commands step run
//some.json is like [{"cmd":"start chrome"},{"cmd":"start https://google.com"},{"cmd":"mkdir exp"}]
...someDir > wct push computer-start -url ./some.json -type cmd

```


### pull, pull code to current dir

```
//create react-redux/childrenDir...
...somedir > wct pull react-redux

//pull children contents and not wrap react-redux name
..somedir > wct pull react-redux -nowrap true

//create someproj/childrenDir...,cover true cover exist file
..somedir >wct pull react-redux -rename someproj -cover true
```


### remove,remove exist lib

```
//remove some lib
wct remove react-redux  
```

### rename,rename lib name  
```
wct rename react-redux -rename react-redux-material
```

### see
```
//see all lib in storage warehouse
wct see lib
// see some lib
wct see lib -f react-redux
//see exclude
wct see exclude
```

### create wctfile.js

```
...someDir > wct

```


### base tool
```
//create dir a/b/c in current dir
...somedir > wct a/b/c/
//remove dir
...somedir > wct rm:a/b
// copy paster
...somedir > wct copy:./a=to:./c
```

### exec command


###### cmd   commands step run

```
//the json which use push maybe like as follow
 [{"cmd":"start chrome"},{"cmd":"start https://google.com"},{"cmd":"mkdir exp"}]
 //after push computer-start in above
wct exec computer-start -type cmd
```

###### webq , see the collection of sites in one page
need install *iFrame Allow* plugin in browser if want to see some not allow embed iframe website

```
//the json which use push maybe like as follow
[{"name":"react","des":"office web","link":"https://reactjs.org/docs/hello-world.html"}]

//after push q-react in above
wct exec q-react -type webq
```

 ![image](http://p0qkkmj34.bkt.clouddn.com/webq.gif)




## wctfile format

```
module.exports={
  push:{
    dir1:'url:./a',
    file1:'url:./c/d',
    dir2:{
      'a.html':null,
      'b.html':'//write by some',//default content
      dirx:['m.html','k.html','url:m.html'],
      dira:{
        c:['m.html'],
        dirb:{'m.html':'url:./a/b.html'},
        dirc:'url:./example'}
    }
  }
}
```


## others

* push part contents

```
//the content of file
let a=1;
...
//wct-part-start
  function fun1(){}
    //wct-part-start
        function fun2(){}
    //wct-part-end
//wct-part-end
//the content of file end

//cmd  
wct push somename -url ./a.js -part true
```
