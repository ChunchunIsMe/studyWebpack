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
17. DLL: [DLL](https://github.com/ChunchunIsMe/studyWebpack/tree/DLL "DLL");
18. 多页面打包配置: [multipage](https://github.com/ChunchunIsMe/studyWebpack/tree/multipage "multipage");
19. 编写loader: [writeLoader](https://github.com/ChunchunIsMe/studyWebpack/tree/writeLoader "writeLoader");
20. 编写plugins: [writePlugins](https://github.com/ChunchunIsMe/studyWebpack/tree/writePlugins "writePlugins");
21. 编写bundle: [writeBundle](https://github.com/ChunchunIsMe/studyWebpack/tree/writeBundle "writeBundle");

# 使用DLLPlugin加快打包速度
## 准备工作
我们这次在开发和生产模式实战的代码为基础

首先安装lodash插件
```
npm i lodash -S
```
给index.js增加以下代码
```
import _ from 'lodash'
console.log(_.join(['hello', 'world'], '-'))
```
在build文件下新增webpack.dll.js文件
```
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['lodash', 'jquery']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  }
}
```
这里使用library，忘记的话可以回顾打包自定义函数库的内容，定义了library就相当于当script导入的时候挂载了这个全局变量，只要在控制台输入全局变量的名称就可以显示里面的内容，比如这里我们是`library: '[name]'`对应的name就是我们在entry里定义的vendors

在package.json中的script再新增一个命令
```
"scripts": {
    "build": "webpack --env production --config build/webpack.base.conf.js",
    "dev": "webpack-dev-server --env development --open --config build/webpack.base.conf.js",
    "build:dll": "webpack --config ./build/webpack.dll.js"
}
```
然后运行npm run build:dll,就会生成dll文件夹，并且文件为vendors.dll.js

那我们要怎么使用vendors.dll.js文件呢

这个时候我们需要再安装一个依赖`npm i add-asset-html-webpack-plugin -D`,它会将js文件注入到我们生成的index.html中

在webpack.base.conf.js文件中引入,这里需要注意，add-asset-html-webpack-plugin插件应该放在html-webpack-plugin的后面
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin'); // 引入
// ...
module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack4实战',
      filename: 'index.html',
      template: path.resolve(__dirname, '..', 'index.html'),
      minify: {
        collapseWhitespace: true
      }
    }),
    // ...
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/vendors.dll.js') // 对应的 dll 文件路径
    })
  ]
}
```
然后npm run dev打开网页，这个时候你在console输入vendors就可以看到内容

现在我们已经把第三方模块单独打包成了dll文件，并使用

但是现在使用第三方模块的时候，要用dll文件，而不是使用/node_modules/中的库，继续来修改webpac.dll.js配置
```
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['lodash', 'jquery']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      // 用这个插件来分析打包后的这个库，把库里的第三方映射关系放在了这个 json 的文件下，这个文件在 dll 目录下
      path: path.resolve(__dirname, '../dll/[name].manifest.json')
    })
  ]
}
```
保存后重新运行`npm run build:dll`,然后就发现文件夹中多了vendors.manifest.json，这个是一个映射文件

然后我们要在正式打包的时候使用到这个映射文件，让打包的代码不是使用库中的代码而是使用我们的js，这个时候就要用到webpack.DllReferencePlugin 插件

修改webpac.base.conf.js
```
const webpack = require('webpack');
module.exports = {
  plugins: [
    // ...
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '../dll/vendors.manifest.json')
    })
  ]
}
```
之后webpack打包的时候，就可以结合之前的全局变量vendors和这个新生成的vendors.manifest.json映射文件，然后来对我们的源代码进行分析，一旦分析出使用的第三方库是在vendors.dll.js里，就会去使用vendors.dll.js,不会去使用/node_modules/里的第三方库了

再次打包`npm run build`,可以吧webpack.DllReferencePlugin模块注释后再打包比较一下，会发现节省了时间。

还可以继续拆分，修改webpack.dll.js文件
```
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    lodash: ['lodash'],
    jquery: ['jquery']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json') // 用这个插件来分析打包后的这个库，把库里的第三方映射关系放在了这个 json 的文件下，这个文件在 dll 目录下
    })
  ]
}
```
运行`npm run build:dll`

可以把之前打包的vendors.dll.js和vendors.manifest.json映射文件给删除掉

然后修改webpack.base.conf.js
```
// ...
module.exports = {
  // ...
  plugins: [
    // ...
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/lodash.dll.js')
    }),
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/jquery.dll.js')
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '../dll/lodash.manifest.json')
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '../dll/jquery.manifest.json')
    })
  ]
}
```
然后运行`npm run dev`发现可以成功运行

如果这样一个个配置过去会发现真的很麻烦，所以我们可以使用文件操作来读取文件夹中的内容

最终webpack.base.conf.js代码
```
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');
const fs = require('fs');

const productionConfig = require('./webpack.prod.conf'); // 引入生产环境配置文件
const developmentConfig = require('./webpack.dev.conf'); // 引入开发环境配置文件

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin'); // 引入

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

  const plugins = [
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

  const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
  files.forEach(file => {
    if (/.*\.dll.js/.test(file)) {
      plugins.push(
        new AddAssetHtmlWebpackPlugin({
          filepath: path.resolve(__dirname, '../dll', file)
        })
      )
    }

    if (/.*\.manifest.json/.test(file)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, '../dll', file)
        })
      )
    }
  })

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
    plugins
  }
}

module.exports = env => {
  const config = env === 'production' ? productionConfig : developmentConfig
  return merge(generateConfig(env), config); // 合并公共配置 和 环境配置
}
```