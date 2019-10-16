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

## 图片处理汇总
这次的代码我们在TreeShaking的代码上进行修改
### 准备工作
首先放三张图片到src/assets/imgs/下并且修改base.css,并且删除util.js。base.css、index.js和index.html如下
```
// base.css
* {
  margin: 0;
  padding: 0;
}

.box {
  height: 400px;
  width: 600px;
  border: 5px solid #000;
  color: #000;
}

.box div {
  width: 200px;
  height: 600px;
  float: left;
}

.box .ani1 {
  background: url('./../assets/imgs/1.jpg') no-repeat;
}

.box .ani2 {
  background: url('./../assets/imgs/2.jpg') no-repeat;
}

.box .ani3 {
  background: url('./../assets/imgs/3.jpg') no-repeat;
}
```
index.js
```
// index.js
import './css/base.css'
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
  <div>你好</div>
  <div id="app">
    <div class="box">
      <div class="ani1"></div>
      <div class="ani2"></div>
      <div class="ani3"></div>
    </div>
  </div>
</body>
</html>
```
安装依赖
```
npm i url-loader file-loader --save-dev
```
### 图片处理和base64编码
在webpack.config.js中的module.rules选项中进行配置，以实现让loader识别图片后缀名，并且进行指定的处理操作。
```
moudle.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              outputPath: 'images/',  // 输出到images目录下
              limit: 20000            // 小于20kb转换成base64
            }
          }
        ]
      }
    ]
  }
}
```
只用到url-loader没有用到file-loader的原因是url-loader依赖于file-loader没有它会报错。
### 图片压缩
安装依赖
```
npm i image-webpack-loader --save-dev
```
webpack.config.js配置
```
// ...
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              outputPath: 'images/',  // 输出到images目录下
              limit: 20000            // 小于20kb转换成base64
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpg/jpeg 图片
              mozjpeg: {
                progressive: true,
                quality: 65 // 压缩率
              },
              // 压缩 png 图片
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      }
    ]
  }
}
```
### 生成雪碧图
安装依赖：
```
npm i postcss-loader postcss-sprites --save-dev
```
配置：
```
// ...

/**
 * 雪碧图修改在这里
 */
let spritesConfig = {
  spritePath: './dist/images'
}
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          /**
           * 雪碧图修改在这里
           */
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('postcss-sprites')(spritesConfig)]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              outputPath: 'images/',  // 输出到images目录下
              limit: 20000            // 小于20kb转换成base64
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpg/jpeg 图片
              mozjpeg: {
                progressive: true,
                quality: 65 // 压缩率
              },
              // 压缩 png 图片
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              }
            }
          }
        ]
      }
    ]
  }
}
```
> 这里需要注意的是配置postcss-sprites之后还需要修改image-webpack-loader.options.pngquant.quality修改成[0.65, 0.9]因为不做修改会报错，我也不知道为什么。

> 还有需要注意的是打包后的雪碧图十分的大。我也没有找到压缩的方法，如果能压缩的方法可以联系我。过大的图片也不推荐用雪碧图。