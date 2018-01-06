#   wct   #

wct是本地项目文件的管理工具
![](https://img.shields.io/npm/v/wct.svg?style=flat)

## Installation
```base
npm install wct -g
ps:部分代码已使用es6，node v4+使用
```

## wct可以做什么
* 本地指定位置进行上传和下载/创建
* 组合文件上传。可以组合本地的文件，cdn上的文件，自己定义的文件 统一打包成一个项目上传，自定义删除文件/文件夹。
* 通过脚本或者直接命令行自定义上传下载的内容
* 可以link上传的项目，同步更新通用功能代码。


## 使用

#### 配置存储文件
```js
指定一个文件夹路径作为存储中心
...... > wct -config /....../wctstoredir  
ps:路径可以用相对路径或绝对路径。
```

#### 上传

* 通过自定义命令行上传

```js
.....> wct -store dir1=url%./  //把当前文件夹以dir1的名字上传
..... > wct -store file1=cdn%https:....html //把cdn上的文件用file1名字上传
..... > wct -store dir2=object%{'a.html':null,cb:null}
//通过对象自定义文件夹/文件内容上传

ps: 注意
在命令行中的object%{}对象里面不能再次引用其他资源调用，只能定义空的文件。
比如不能使用dir2=object%{'a.html':'url(./aa.html)'..不能这样定义。
不能在object%定义的对象中使用双引号 ""
如果在使用对象的情况下自定义组合第三方内容请使用脚本wctfile.js的方式来上传。

```


* 通过脚本wctfile.js上传

```js
1.创建wctfile.js
...someDir> wct
2.在wctfile.js中定义上传内容
module.exports={
  dir1:'url(./)',
  file1:'url(./a/c/m.js)',
  file2:'cdn(https://..../some.js)',
  dir2:{
    'a.html':null,
    'b.html':'//write by some',//文件默认内容
    dirx:['m.html','k.html'],
    dira:{
      c:['m.html'],
      dirb:{'m.html':'cdn(https://...)'},
      dirc:'url(./example)'}//混合载入其他地方的内容
  }
}
3.上传项目
.......> wct -store dir1  //把当前文件夹用dir1的名字上传
....... > wct -store file1 //把当前文件a/c/m.js用file1名字上传
....... > wct -store file2 //把cdn上的文件用file2名字上传
....... > wct -store dir2  //把当前对象中定义的所有文件夹/文件以dir2上传

```


#### 下载/创建

* 下载已经上传过的内容

```js

......> wct -create dir1 //把存储的dir1中所有子文件夹/文件下载到当前文件夹
......> wct -create dir1 -wrap dir2
//把存储的dir1中的所有子文件夹/文件包裹在dir2文件夹中下载到当前文件夹
......> wct -install dir1
//把dir1中所有的子文件夹/文件包裹在以当前存储命名dir1的文件夹里面来下载
......> wct -create file1 -rename some.html
//把存储的file1文件中的内容以some.html的文件命名下载到当前文件夹
ps:如果文件存在，默认不会覆盖，可以使用参数 -cover true 来覆盖下载和创建
```

* 根据命令行创建文件夹/文件

```js
....> wct -create =object%{a:{b:['a.html','b.html']}}
//根据对象命名创建文件夹
....> wct -create =cdn%https:..../bootstrap-grid.css
//当当前文件夹中创建bootstrap-grid.css文件,默认根据路径的文件名定义
....> wct -create =cdn%https:..../bootstrap-grid.css -rename kog.css
//转换为kog.css创建到当前文件夹
....> wct -create =url%../somedir -wrap otherdir  //复制文件夹,并包裹为otherdir文件夹中
ps:部分参数请参照前面的 下载已经上传过的内容
不能在object%定义的对象中使用双引号 ""
```

* 根据wctfile创建文件夹/文件

```js
1.创建wctfile .....>wct
2.编辑wctfile.js  内容与前面上传模块中 通过脚本wctfile.js上传的内容相同
3.创建内容 ...> wct -create dir1
ps:-create 内容与前面 下载已经上传过的内容 模块类似
```

#### link/unlink 内容

```js
在已有上传内容的情况下
wct -link dir1  //软链接上传过的项目
wct -unlink dir1 //移除dir1的软连接
```

#### 通用命令
```js
 wct -list  //查看当前上传了哪些项目
 wct -clean yourPojectName  //清除某个包
 wct -cleanall  //清掉所有包，小心
```

#### 工具
* 批量移除文件夹/文件

```js  
...... > wct -remove =object%['a.html','b.html']
...... > wct -remove someName   //someName定义在wctfile.js中，wctfile.js编写方式参照前面说明
ps:不能在object%定义的对象中使用双引号 "",编写方式与前面的object%定义的格式相同
```

* mkdir

```js
......>wct a/b/c/d/m.js
......>wct a/b/c
```



## 更新
* 部分代码用es6重写，修复部分参数使用的bug，添加rename参数
