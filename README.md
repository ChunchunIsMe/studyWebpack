# webpack的学习
学习的代码来自于：
1. https://www.webpackjs.com
2. https://juejin.im

因为webpack4的学习在官方文档中有一些插件被弃用了但是webpack4文档中仍然使用这个插件，切到插件文档想使用新推荐的插件时，首先没有使用经验，其次新推荐的插件文档是英文文档不方便阅读(疯狂吃没文化的亏)，所以比较推荐一边看文档一边在论坛找一些帖子来学习webpack

目录：

1. 基本配置：[master分支](https://github.com/ChunchunIsMe/studyWebpack "master");
2. 确认wepack支持三种导入规范： [checkImport分支](https://github.com/ChunchunIsMe/studyWebpack/tree/checkImport "checkImport");
3. 代码分割：[codeSplitting](https://github.com/ChunchunIsMe/studyWebpack/tree/codeSplitting "codeSplitting");
4. Lazy Loading/Prefetching：[LazyLoadingAndPrefetching](https://github.com/ChunchunIsMe/studyWebpack/tree/LazyLoadingAndPrefetching "LazyLoadingAndPrefetching");
5. 自动生成HTML：[autoHTML](https://github.com/ChunchunIsMe/studyWebpack/tree/autoHTML "autoHTML");
6. 使用Loader：[useLoader](https://github.com/ChunchunIsMe/studyWebpack/tree/useLoader "useLoader");
7. TreeShaking： [TreeShaking](https://github.com/ChunchunIsMe/studyWebpack/tree/TreeShaking "TreeShaking");
8. 图片处理： [setImg](https://github.com/ChunchunIsMe/studyWebpack/tree/setImg "setImg");
9. 字体处理： [useFont](https://github.com/ChunchunIsMe/studyWebpack/tree/useFont "useFont");
10. 提前导入JS和别名 [useJSProject](https://github.com/ChunchunIsMe/studyWebpack/tree/useJSProject "useJSProject");
11. webpack-dev-server: [webpack-dev-server](https://github.com/ChunchunIsMe/studyWebpack/tree/webpack-dev-server "webpack-dev-server");
12. 开发和生产模式实战：[actualCombat](https://github.com/ChunchunIsMe/studyWebpack/tree/actualCombat "actualCombat");
13. 打包自定义函数库：[selfFunction](https://github.com/ChunchunIsMe/studyWebpack/tree/selfFunction "selfFunction");

## 提前导入JS
### 准备工作
这次使用的是TreeShaking的代码

删除util.js

安装依赖
```
npm i jquery -S
```
### 配置
提前导入JS使用的是webpack.ProvidePlugin插件

webpack.config.js
```
// ...
const webpack = require('webpack');
module.exports = {
  // ...
  plugins: [
    // ...
    new webapck.ProvidePlugin({
      $: 'jquery'
    })
  ]
}
```
index.js
```
$('div').append('qwe');
```
index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
  <div></div>
</body>
</html>
```
打包之后可以看到打包后的html是有qwe的
## 别名
别名使用的是webpack中的resolve.alias

创建 import 或 require 的别名，来确保模块引入变得更简单

也可以在给定对象的键后的末尾添加 $，以表示精准匹配：
### 别名配置
webpack.config.js
```
module.exports = {
  resolve: {
    alias: {
      // resolve.alias用来起别名像常用的@就是在这里定义
      // abc$标识精确匹配只有当只使用abc时才会引用冒号后的值 如 abc: 'a/b/c', import 'abc' = import 'a/b/c', 'abc冒号后的值' import 'a/b/d' = import 'a/b/d'
      // 没有则不是表示精确匹配   如：如 abc: 'a/b/c', import 'abc' = import 'a/b/c', 'abc冒号后的值' import 'a/b/d' = import 'a/b/c/b/d'
      '@': path.resolve(__dirname, 'src'),
      base$: path.resolve(__dirname, 'src/css/base.css')
    }
  }
}
```
index.js
```
import 'base';
$('div').append('qwe');
$('div').addClass('box');
```
打包后就能看到有样式的页面了