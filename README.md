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
14. PWA：[PWA](https://github.com/ChunchunIsMe/studyWebpack/tree/PWA "PWA");
15. TypeScript配置：[setTs](https://github.com/ChunchunIsMe/studyWebpack/tree/setTs "setTs");
16. Eslint配置：[useEslint](https://github.com/ChunchunIsMe/studyWebpack/tree/useEslint "useEslint");

# 开发和生产模式实战
## 准备工作
### 安装依赖
webpack-dev-server依赖
```
npm i webpack-dev-server -D
```
html依赖
```
nmp i html-loader -D
```
css处理依赖
```
npm i css-loader style-loader mini-css-extract-plugin optimize-css-assets-webpack-plugin -D
```
安装scss处理依赖
```
npm i node-sass sass-loader -D
```
为不同浏览器加上css前缀
```
npm i post-css autoprefixer -D
```
图片及字体处理
```
npm i url-loader file-loader image-webpack-loader -D
```
第三方库
```
npm i jquery
```
合并webpack配置
```
npm i webpack-merge -D
```
###代码和文件准备
这次代码是基于master的代码进行修改的

生成三个js文件分别为src/vender/minus.js    src/vender/multi.js     src/vender/sum.js
```
// minus.js
module.exports = function (a, b) {
  return a - b;
}
//multi.js
define(function (require, factory) {
  'use strict';
  return function (a, b) {
    return a * b;
  }
});
// sum.js
export default function (a, b) {
  console.log('I am sum.js!');
  return a + b;
}
```
放一些字体文件到src/assets/font下

放一些图片到src/assets/images下

创建两个scss文件分别为src/assets/style/base.scss    src/assets/style/common.scss
```
// base.scss
* {
  margin: 0;
  padding: 0;
}

.img {
  width: 200px;
  height: 200px;
  background-image: url('../images/1.jpg');
}

.example {
  display: grid;
  transition: all 0.5s;
  user-select: none;
  background: linear-gradient(to bottom, white, black)
}
// common.scss
.app {
  font-size: 25px;
}
```
创建一个index.html在项目根目录
```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>

<body>
  <div class="app">
    <div>webpack4 实战</div>
    <div class="img"></div>
    <div class="box">
      <span class="iconfont icon-diqiuyi"></span>
      <span class="iconfont icon-jishiben"></span>
      <span class="iconfont icon-lipin"></span>
      <span class="iconfont icon-qiche"></span>
    </div>
    <div class="example"></div>
  </div>
</body>

</html>
```
修改index.js
```
import '@babel/polyfill'

import './assets/style/base.scss'
import './assets/style/common.scss'

import './assets/font/iconfont.css' // 引入字体文件
var minus = require('./vendor/minus');
console.log('minus(1, 2) = ', minus(1, 2));

require(['./vendor/multi'], function (multi) {
  console.log('multi(1, 2) = ', multi(1, 2));
})

import sum from './vendor/sum';
console.log('sum(1, 2) = ', sum(1, 2));

$.get(
  '/try/ajax/ajax_info.txt',
  function (data) {
    setTimeout(function () {
      $('body').append(data);
    }, 2000)
  }
)
```
## 开始配置webpack
### 前言
之前大多都是写生产模式，但是我们日常开发项目都是用的开发模式

只有当项目做完之后，部署到nginx上的时候才使用生产模式，将代码打包后放到nginx中

之所以要分两种模式是因为，开发模式下，需要加快编译的速度，可以热更新以及跨域地址，开启源码调试(source-map)

所以我们将webpack配置拆分三个文件来写，一个生产配置，一个开发配置，最后一个基础配置

即：webpack.base.conf.js、webpack.dev.conf.js、webpack.prod.conf.js

新建这三个文件并放在根目录的build下

这里需要使用到一个插件，webpack-merge来合并配置。
```
npm i webpack-merge -D
```
所以编写配置文件的步骤是
1. 引入webpack-merge插件来合并配置
2. 引入生产和开发环境配置
3. 编写基础配置
4. 导出合并后的配置文件

在代码中区分不同环境：
```
module.export = env => {
  const config = env === 'production' ? productionConfig: developmentConfig;
  return merge(baseConfig, config)  // 合并 公共配置 和 环境配置
}
```
这里的env在package.json中配置,修改scripts，添加'dev'和'build'命令

注意，这里有个--env字段，与webpack.base.conf.js中的env是联动的，告诉它当前是什么环境，然后合并成什么环境
```
"scripts": {
    "build": "webpack --env production --config build/webpack.base.conf.js",
    "dev": "webpack-dev-server --env development --open --config build/webpack.base.conf.js"
}
```
### 配置编写
webpack.base.conf.js
```
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');

const productionConfig = require('./webpack.prod.conf'); // 引入生产环境配置文件
const developmentConfig = require('./webpack.dev.conf'); // 引入开发环境配置文件

/**
 * 根据不同的环境，生成不同的配置
 * @param {String} env "development" or "production"
 */
const generateConfig = env => {
  // 将需要的 Loader 和 Plugin 单独声明
  const scriptLoader = [
    {
      loader: 'babel-loader'
    }
  ]

  const cssLoader = [
    'style-loader',
    'css-loader',
    'postcss-loader', // 使用 postcss 为 css 加上浏览器前缀
    'sass-loader' // 使用 sass-loader 将 scss 转为 css
  ]

  const cssExtractLoader = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    'css-loader',
    'postcss-loader',
    'sass-loader'
  ]

  const fontLoader = [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        limit: 5000,
        publicPath: 'fonts/',
        outputPath: 'fonts/'
      }
    }
  ]

  const imageLoader = [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        limit: 10000,
        outputPath: 'images/'
      }
    },
    // 图片压缩
    {
      loader: 'image-webpack-loader',
      options: {
        // 压缩 jpg/jpeg 图片
        mozjpeg: {
          progressive: true,
          quality: 50 // 压缩率
        },
        // 压缩 png 图片
        pngquant: {
          quality: '65-90',
          speed: 4
        }
      }
    }
  ]

  const styleLoader = env === 'production' ? cssExtractLoader : cssLoader;


  return {
    entry: {
      index: './src/index.js'
    },
    output: {
      publicPath: env === 'development' ? '/' : './',
      path: path.resolve(__dirname, '..', 'dist'),
      filename: '[name]-[hash:5].bundle.js',
      chunkFilename: '[name]-[hash:5].chunk.js'
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /(node_module)/, use: scriptLoader },
        { test: /\.(sa|sc|c)ss$/, use: styleLoader },
        { test: /\.(eot|woff2?|ttf|svg)$/, use: fontLoader },
        { test: /\.(png|jpg|jpeg|gif)$/, use: imageLoader }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'webpack4实战',
        filename: 'index.html',
        template: path.resolve(__dirname, '..', 'index.html'),
        minify: {
          collapseWhitespace: true
        }
      }),
      new webpack.ProvidePlugin({
        $: 'jquery'
      }),
      new CleanWebpackPlugin()
    ]
  }
}

module.exports = env => {
  const config = env === 'production' ? productionConfig : developmentConfig
  return merge(generateConfig(env), config); // 合并公共配置 和 环境配置
}
```
webpack.dev.conf.js
```
const webpack = require('webpack');

const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    port: 8000,
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
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
```
webpack.prod.conf.js
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将 css 单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩 css

module.exports = {
  mode: 'production',

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        jquery: {
          name: 'chunk-juqery', // 单独将jquery拆包
          priority: 15,
          test: /[\\/]node_modules][\\/]jquery[\\/]/
        }
      }
    }
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // 压缩 css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g, // 一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源css文件的文件名。默认为/\.css$/g
      cssProcessor: require('cssnano'), // 用于优化/最小化css的css处理器，默认为 cssnano
      cssProcessorOptions: { // 传递给cssProcessor的选项，默认为{}
        safe: true,
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true // 一个布尔值，指示插件是否可以将信息打印到控制台，默认为true
    })
  ]
}
```
因为使用了postcss-loader所以要写postcss.config.js
```
module.exports = {
  plugins: [require('autoprefixer')]
}
```
随后就可以使用npm run build 和 npm run dev 来测试一下生产模式和开发模式啦

> 需要注意的是生产模式下跨域失败是很正常的，而且如果是 vue 项目打包完之后是无法直接打开 index.html 文件查看效果的必须要放在服务器上，一般都是将打包后的文件放入 nginx 中，在 nginx 中配置跨域地址
