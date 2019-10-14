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

## TreeShaking
TreeShaking就是打包的时候把没有用的代码去掉
### JSTreeShaking
JS的TreeShaking依赖的是ES6的模块系统
#### 处理自行写的代码
写好util.js的测试代码
```
// util.js
export function a() {
  return 'function a'
}

export function b() {
  return 'function b'
}

export function c() {
  return 'function c'
}
```

在inde.js中导入util.js中的a
```
import { a } from './vender/util';
console.log(a());
```
打包后你就会发现并没有将function b和function c打包进去
#### 处理库代码
如果是对于经常使用的库代码，如之前经常使用的lodash

安装lodash
```
npm i lodash --save
```

在index.js中导入lodash中的一个函数
```
import { chunk } from 'lodash';
console.log(chunk([1, 2, 3], 2));
```
这个时候打包的js却有70k左右，所以肯定没有进行TreeShaking这个原因是因为lodash使用的是CommandJS而不是ES6的写法，
所以我们安装相对应的系统模块即可。
```
npm i lodash-es --save
```
然后修改一下index.js
```
import { chunk } from 'lodash-es';
// ...
```
之后打包，可以看到main变成了3k左右很显然是进行了TreeShaking的
### CSSTreeShaking
首先编写/src/css/base.css,样式文件，在文件中定义三个样式类。但是在代码中，我们只会用两个类。代码如下所示：
```
// base.css
html {
  background-color: red;
}

.box {
  height: 200px;
  width: 200px;
  border-radius: 50%;
  background-color: green;
}

.box-big {
  height: 300px;
  width: 300px;
  border-radius: 50%;
  background-color: blue;
}

.box-small {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background-color: yellow;
}
```
使用JS进行操作DOM
```
// index.js
import base from './css/base.css';
let app = document.getElementById('app');
let div = document.createElement('div');
div.className = 'box';
app.appendChild(div);
```
然后定义index.html。注意，这里需要使用HTMLWebpackPlugin的template属性来指定打包后的html模板
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
  <div>你好</div>
  <div id="app">
    <div class="box-big"></div>
  </div>
</body>
</html>
```
然后安装依赖，安装mini-css-extract-plugin将css独立出来便于我们观察

glob-all是用来PurifyCSS进行路径处理

PurifyCSS就是帮助我们进行TreeShaking处理
```
npm i css-loader mini-css-extract-plugin glob-all purifycss-webpack purify-css --save-dev
```
更改配置
```
// ...
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件

const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

module.exports = {
  // ...
  plugins: [
    // ...
    new HTMLWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 打包生成后的文件名
      template: 'index.html', // 根据此模版生成 HTML 文件
      chunks: ['main']
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // 清除无用的css
    new PurifyCSS({
      paths: glob.sync([
        // 要做css TreeShaking的路径文件
        path.resolve(__dirname, './*.html'),
        path.resolve(__dirname, './src/*.js')
      ])
    })
  ],
  module: {
    rules: {
      // ...
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    }
  }
}
```
随后打包代码，可以发现需要用到的css类打包进了打包后的css文件中，没有用到的css被舍弃了