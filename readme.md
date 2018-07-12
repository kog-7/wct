#   wct   #

manage components,commands,scaffolding,useful files local

![](https://img.shields.io/npm/v/wct.svg?style=flat)


## Installation

```
npm install wct -g
```

## example

```js
//base use

wct config C:\codeStore    //storage warehouse
wct exclude * -doc **/node_modlues   //exclude dir or file in all push command

...somedir > wct push component1  //push your code
...somedir > wct pull component1  //pull your code

//open server to view all libs in browser
wct lib *

// special handle,special treatment upload code
wct exec q-react -type webq
wct exec computer-start -type cmd

//create wctfile.js
...somedir > wct

// combine resource from wctfile.js
// wctfile.js    module.exports={combine:{ proj1:{ dir1:{ dir2:'url:./q-react',dir3:'store:ropegulp'}}}};
...somedir > wct combine proj1      //create corresponding resource in current project

//base tool
..somedir> wct a/b/c/k.js   ..somedir > wct rm:a/b
```





## feature list&&api

### config,before use wct,must define a code storage warehouse

```js
wct config C:\codeStore
```

### exclude,set dir&file which are not uploaded

exclude use micromatch to filte path   [micromatch](https://www.npmjs.com/package/micromatch){:target="_blank"}


```js
// use * for all the upload.it only exclude some dir when push react-material if use wct exclude react-material -doc ..
//not push node_modlue  and .git dir

wct exclude * -doc **/node_modlues someDir/*.md

```




### push, push code to storage warehouse



```js
//push current dir and named react-redux-material then upload
..somedir > wct push react-redux-material

// use special dir to upload
..somedir > wct push react-redux -url ./dist

// cover true cover the already existing content
//exclude ,exclude push path for current push task
// commit ,current push commit instruction
// des ,  this lib description
...somedir > wct push react-redux -cover true -exclude package.json -commit "change cont"   -des "this is use for..."


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

```js
//create react-redux/childrenDir...
...somedir > wct pull react-redux

//pull children contents and not wrap react-redux name,default wrap value is true
..somedir > wct pull react-redux -wrap false

//create someproj/childrenDir...,cover true cover exist file
..somedir >wct pull react-redux -rename someproj -cover true
```


### remove,remove exist lib

```js
//remove some lib
wct remove react-redux  
```

### rename,rename lib name  

```js
wct rename react-redux -rename react-redux-material
```



### lib,view lib(beta can only read file now)


```js
//can use wct lib * -browser chrome  
// to point browser open

wct lib *

```

//auto open page

![image](https://wct666.oss-cn-shenzhen.aliyuncs.com/wctlib.png)




### see

```js
//see all * in storage warehouse
wct see *
// see some *
wct see * -f react-redux
//see exclude
wct see exclude
```

### create wctfile.js

```js
...someDir > wct

```


### combine resource from wctfile.js

```js
//wctfile.js   module.exports={combine:{ proj1:{ dir1:{ dir2:'url:./q-react',dir3:'store:ropegulp'}}}};
...somedir > wct combine proj1      //create corresponding resource in current project
```


### base tool
```js
//create dir a/b/c in current dir
...somedir > wct a/b/c/
//remove dir
...somedir > wct rm:a/b
// copy paster
...somedir > wct copy:./a to:./c -exclude **/node_modules
```

### exec command


###### cmd   commands step run

```js
//the json which use push maybe like as follow
 [{"cmd":"start chrome"},{"cmd":"start https://google.com"},{"cmd":"mkdir exp"}]
 //after push computer-start in above
wct exec computer-start -type cmd
```

###### webq , see the collection of sites in one page
need install *iFrame Allow* plugin in browser if want to see some not allow embed iframe website

```js
//the json which use push maybe like as follow,object which do not have link express type
[{"name":"A type"},{"name":"react","des":"office web","link":"https://reactjs.org/docs/hello-world.html"}]

//after push q-react in above
// can use wct exec q-react -type webq -browser chrome
//to point browser open
wct exec q-react -type webq
```

 ![image](https://wct666.oss-cn-shenzhen.aliyuncs.com/webq.png)




## wctfile format

```
module.exports={
  combine:{
    proj1:{
      a:{
        b:'./q-react'
      }
    }

}};

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
