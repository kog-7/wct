#   wct   #

wct是本地项目文件的管理工具，指定一个本地项目文件夹，可以进行上载，下载，link等操作，同时也可以根据自己的需求去定制项目。主要用于项目的前期开发，和后期功能存档。
![](https://img.shields.io/npm/v/gulp-jspool.svg?style=flat)

## Installation
```base
npm install wct -g
```

## wct可以做什么
* 组合文件上传。可以组合本地的文件，cdn上的文件，自己定义的文件 统一打包成一个项目上传，自定义删除文件/文件夹。
* 通过命令行直接定义项目文件
* 可以link上传的项目，同步更新通用功能代码。

## 使用
* 初始使用需要配置上传目录中心
```js
   wct yourPojectName D:\codeStore //也可以使用相对路径
```

1. 通过配置wctfile.js文件配置
* D:\code\ > wct  //在当前项目文件夹中创建wctfile.js文件
* 在wctfile.js中编写内容
```js
  let someProjectName="url(./)";//通过url路径表示代表的文件内容，还可以自定义文件与文件内容等等，后面有wctfile.js配置说明
  module.export={
    someProjectName
  }
```

* 上传项目
```js
   someDir > wct -store someProjectName
```

* 下载项目
 ```js
  someDir > wct -create someProjectName  //把someProjectName的内容全部下载到当前文件夹
  或者
  someDir > wct -create someProjectName -wrap myProject1  //把someProjectName打包成myProject文件夹下并下载
 ```

 * link项目
 ```js
 someDir > wct -link someProjectName
 取消link
 someDir > wct -unlink someProjectName
```

* 根据配置删除文件/文件夹
```js
wctfile.js配置  
module.export={
  somePro:{dir1:['a.html'],dir2:['b.html']};
}
命令行
----> wct -remove somePro   //对应文件夹下dir1,dir2,a.html,,,会被删除
```



2. 直接通过命令行上传项目

* 上传文件路径项目
```js
   wct -store myProjectName=url%./someDir  //可以为单个文件
```
* 创建对象格式上传
```js
   wct -store myProjectName=object%{dir1:['kog.html'],dir2:{dir3:['c.html']}}//不能用",只能用单引号'

```

## wctfile.js编写
```js
let project1={
  dir1:{
    "ind.html": "let word='something';",
    lib:{
      'bootstrap.css':"cdn(https://cdn.bootcss.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css)"//加载cdn上的文件
    },
    scripts: {
        dir3: ['a.html', 'b.html'],
        dir4:"url(../someDir)"
    }
}
};
let project2="url(./)";

module.export={
  project1,
  project2
}
```

## 通用命令
```js
 wct a/b/c/d/a.html  创建相关的文件夹和目录
 wct -list  //查看当前上传了哪些项目
 wct -clean yourPojectName  //清除某个包
 wct -cleanall  //清掉所有包，小心
```
