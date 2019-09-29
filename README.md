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

## 使用loader
我们通过处理css/scss文件来学习使用loader
### 准备工作
css在HTML中常用的方法有link标签和style标签两种，所以这次就是结合webpack特点实现以下功能：
- 将css通过link标签引入
- 将css放在style标签里

这次我们需要用到css-loader，style-loader等loader，和babel一样，webpack不知道将CSS提取到文件。需要使用loader来加载对应的文件

css-loader:负责解析CSS代码，主要是为了处理CSS中的依赖，例如@import和url()等引用外部文件的声明

style-loader:会将css-loader解析的结果转变成JS代码，运行时动态插入style标签来让CSS代码生效。
### 安装依赖
```
npm i css-loader style-loader --save-dev
```
更改配置文件
```
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
        use: ['style-loader', 'css-loader']
      }
    ]
  }
  // ...
}
```
配置module中的rules属性，和配置babel一样，首先在test中使用正则来过滤.css文件，对.css文件使用loader，'style-loader', 'css-loader'

在base.css中写入样式
````
* {
  margin: 0;
  padding: 0;
}
html {
  background: red;
}
```
然后将base导入到index.js中
```
// index.js
import './css/base.css';

// ...
```
执行构建命令就可以看到效果了

但是打包后查看dist文件发现并没有生成css文件，但是打开index.html是有样式的

原因是：style-loader，css-loader两个loader处理后，css代码会转变成js，和index.js一起打包。

如果需要单独把css文件分离出来，我们需要使用mini-css-extract-plugin插件

之前是使用extract-text-webpack-plugin插件，此插件和webpack4不是太匹配，现在使用mini-css-extract-pligin具体见官网配置：[useLoader](https://webpack.js.org/plugins/mini-css-extract-plugin/ "官网配置");
```
npm i mini-css-extract-plugin --save-dev
```
更改配置文件
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // ...
  module: {
    // ...
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ],
    plugins: [
      // ...
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    ]
  }
  // ...
}
```
这样只是生成了单独的css文件，但是并没有压缩，
引入[optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin "官网配置");
插件来实现压缩
```
npm i optimize-css-assets-webpack-plugin --save-dev
```
再次修改plugins
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 打包css文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css文件
module.exports = {
  // ...
  module: {
    // ...
    plugins: [
      // ...
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
        canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
      })
    ]
  }
  // ...
}
```
随后就可以发现css已经被压缩了，并且html也是有样式的
### 处理sass
安装sass依赖:
```
npm i node-sass sass-loader --save-dev
```
在src文件夹下新增scss文件夹及main.scss文件

main.scss引入样式
```
$bgColor: black !default;
* {
  margin: 0;
  padding: 0;
}
html {
  background-color: $bgColor;
}
```
修改配置文件
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader' // 使用sass-loader将scss转为css
        ]
      }
    ]
    // ...
  }
  // ...
}
```
> module.rules.use数组中，loader的位置。根据webpack规则：放在最后的loader首先被执行。