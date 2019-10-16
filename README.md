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

## webpack-dev-server
### webpack-dev-server配置
代码在TreeShaking的基础上修改、删除css、删除src/vendor下的所有文件

安装依赖
```
npm i webpack-dev-server -D
```
```
npm i jquery -S
```
修改package.json
```
{
  "name": "studyWebpack",
  "version": "1.0.0",
  "description": "学习webpack写的一些代码",
  "main": "index.js",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack-dev-server --open"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ChunchunIsMe/studyWebpack.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ChunchunIsMe/studyWebpack/issues"
  },
  "homepage": "https://github.com/ChunchunIsMe/studyWebpack#readme",
  "devDependencies": {
    "@babel/core": "^7.6.2",
    "@babel/plugin-transform-runtime": "^7.6.2",
    "@babel/preset-env": "^7.6.2",
    "babel-loader": "^8.0.6",
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^3.2.0",
    "glob-all": "^3.1.0",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.8.0",
    "purify-css": "^1.2.5",
    "purifycss-webpack": "^0.7.0",
    "webpack": "^4.41.0",
    "webpack-cli": "^3.3.9",
    "webpack-dev-server": "^3.8.2"
  },
  "dependencies": {
    "@babel/polyfill": "^7.6.0",
    "@babel/runtime": "^7.6.2",
    "core-js": "^3.2.1",
    "jquery": "^3.4.1",
    "lodash": "^4.17.15",
    "lodash-es": "^4.17.15"
  }
}
```
然后修改index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>webpack-dev-server</title>
</head>
<body>
  This is Index html
</body>
</html>
```
简单封装下/vendor/下的三个文件

minus.js
```
module.exports = function (a, b) {
  return a - b;
}
```
multi.js
```
define(function (require, factory) {
  'use strict';
  return function (a, b) {
    return a * b;
  }
});
```
sum.js
```
export default function (a, b) {
  console.log('I am sum.js!');
  return a + b;
}
```
修改index.js
```
var minus = require('./vendor/minus');
console.log('minus(1, 2) = ', minus(1, 2));

require(['./vendor/multi'], function (multi) {
  console.log('multi(1, 2) = ', multi(1, 2));
})

import sum from './vendor/sum';
console.log('sum(1, 2) = ', sum(1, 2));
```
开始配置webpack.config.js
```
// ...
const webpack = require('webpack'); // 导入webpack基础插件库
module.exports ={
  // ...
  output: {
    publicPath: '/', // js引用的地址或者CDN地址,这里记得改成/因为使用webpack-dev-server之后这里的路由就是服务启动的地址
                     // 如publicPath: '/dist' 启动webpack-dev-server之后就需要http://localhost:8000/dist才能访问到资源
    // ...
  }
  mode: 'development',  // 开发模式
  devtool: 'source-map',  // 可以将出问题的代码对应到源码详见https://webpack.docschina.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
  devServer: { // webpack-dev-server的详细配置详见https://webpack.docschina.org/configuration/dev-server/
    contentBase: path.join(__dirname, 'dist'),   // 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要。
    port: 8000, // 本地服务端口号
    hot: true, // 热重载
    overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
    proxy: {
      // 跨域代理转发如果try开头的接口就进行代理转发
      '/try': {
        target: 'https://www.runoob.com',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: ''
        }
      }
    },
    historyApiFallback: {
      // HTML5 history模式
      rewrites: [{ from: /.*/, to: '/index.html' }]
    }
  }
  plugins: [
    // ...
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
  // ....
}
```
加入上面的配置之后就可以进行服务了，但是如果需要修改代码服务自动更新Js的话还需要HotModuleReplacementPlugin和NamedModulesPlugin这两个插件，并且顺序不能错，并且制定devServer.hot为true
```
// ...
const webpack = require('webpack'); // 导入webpack基础插件库

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.HotModuleReplacementPlugin(), // 热部署模块
    new webpack.NamedModulesPlugin(),
  ]
}
```
> 有了这两个插件当js代码更新的时候页面就会自动更新，注意是js更新时，其他代码更新并不会更新，如html、css等，如果想要更新其他资源则需要在js中import该资源，当然前提是你需要在module.rules中配置该资源的loader。

并且有了这两个插件可以在js代码中可以针对侦测到更变的文件并且做出相关处理。

比如启动webpack-dev-server之后，修改vendor/sum.js这个而文件，此时，需要在浏览器的控制台打印一些信息。那么修改index.js
```
var minus = require('./vendor/minus');
console.log('minus(1, 2) = ', minus(1, 2));

require(['./vendor/multi'], function (multi) {
  console.log('multi(1, 2) = ', multi(1, 2));
})

import sum from './vendor/sum';
console.log('sum(1, 2) = ', sum(1, 2));

if (module.hot) {
  // 检测是否有模块热更新
  module.hot.accept('./vendor/sum.js', function () {
    // 针对被更新的模块，进行进一步操作
    console.log('./vendor/sum.js is changed');
  })
}
```
这样每当sum.js被修改的时候就会自动执行回调函数。
## 跨域配置
跨域代理可以使用devServer.proxy做一个代理转发，来绕过浏览器的跨域限制。

devserver模块的底层是使用了[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware "http-proxy-middleware")它可以配置的东西非常多

安装前面的配置文件想要调用菜鸟教程的一个接口https://www.runoob.com/try/ajax/ajax_info.txt。只需要在代码中对/try/ajax/ajax_info.txt进行请求即可，然后在index.js中添加以下代码，
```
$.get(
  '/try/ajax/ajax_info.txt',
  function (data) {
    setTimeout(function () {
      $('body').append(data);
    }, 2000)
  }
)
```
这样在几秒后就会将文档中的内容显示出来。
## HTML5-History
当项目使用HTML5 History API时，任意的404响应都可能需要被替代为index.html，在SPA中，任何响应直接被替代为index.html。所以有了以下配置
```
// ...
module.exports = {
  // ...
  devServer: {
    // ...
    historyApiFallback: {
      // HTML5 history模式
      rewrites: [{ form: /.*/, to: '/index.html' }]
    }
  }
  // ...
}
```
可以尝试有了这段代码之后访问任何的路由如http://localhost:8000/abcd 都会显示为index.html如果删去上面的代码就会出现GET Error的提示