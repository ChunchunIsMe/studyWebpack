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

# 编写plugins
## 准备工作
仍然是在空文件夹下素质三连
```
npm init -y

npm i webpack webpack -D
```
生成src/index.js
```
console.log('hello');
```
webpack.config.js
```
const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  plugins: []
}
```
## 编写plugin
### 基础编写
创建plugins/copyright-webpack-plugin.js
```
class CopyrightWebpackPlugin {
  constoructor() {
    console.log('hi');
  }

  apply() {}
}
module.exports = CopyrightWebpackPlugin;
```
修改webpack.config.js
```
const CopyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin');
module.exports = {
  // ...
  plugins: [
    new CopyrightWebpackPlugin()
  ]
}
```
运行打包指令，在终端发现打印了hi
### 使用参数
webpack.config.js
```
const CopyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin');
module.exports = {
  // ...
  plugins: [
    new CopyrightWebpackPlugin({
      hello: 'hello world'
    })
  ]
}
```
copyright-webpack-plugin.js
```
class CopyrightWebpackPlugin {
  constoructor(options) {
    console.log('hi');
    console.log('options = ',options);
  }

  apply() {}
}
module.exports = CopyrightWebpackPlugin;
```
再次运行打包脚本发现将参数打印出来了
### 使用生命周期钩子
具体生命周期钩子请查看[官网](https://webpack.js.org/api/compiler-hooks/ '官网')，这里只演示一种同步和异步的方法。

`apply(compiler) {}`可以看做是webpack的实例
#### 异步
copyright-webpack-plugin.js
```
class CopyrightWebpackPlugin {
  constoructor(options) {
    console.log('hi');
    console.log('options = ',options);
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation,cb) => {
        console.log('emit');
        cb()
      }
    )
  }
}
module.exports = CopyrightWebpackPlugin;
```
因为emit是异步的，可以通过tapAsync来写，当要把代码放入到dist目录前，就会触发这个钩子，走到我们定义的函数中，如果使用tapAsync函数，记得最后要用cb(),tapAsync要传递两个参数，第一个是定义的插件名称，第二个是回调函数，回调函数的参数是compilation，和cb

再次打包发现终端打印了emit

我们可以在终端打印一下compilation.assets可以发现，这里放的是放进dist的所有文件index.js是key

所以我们可以通过操作compilation来添加进入dist的文件
copyright-webpack-plugin.js
```
class CopyrightWebpackPlugin {
  constoructor(options) {
    console.log('hi');
    console.log('options = ',options);
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        compilation.assets['copyright.txt'] = {
          source: function () {
            return 'new txt';
          },
          size: function () {
            return 7; // 上面source返回字符串的长度
          }
        }
        console.log(compilation.assets);
        cb()
      }
    )
  }
}
module.exports = CopyrightWebpackPlugin;
```
再次打包会发现dist下多了一个txt
### 同步钩子
我们可以在文档看到compile是同步钩子，在创建编译参数之后调用

copyright-webpack-plugin.js
```
class CopyrightWebpackPlugin {
  constoructor(options) {
    console.log('hi');
    console.log('options = ',options);
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        compilation.assets['copyright.txt'] = {
          source: function () {
            return 'new txt';
          },
          size: function () {
            return 7; // 上面source返回字符串的长度
          }
        }
        console.log(compilation.assets);
        cb()
      }
    )

    compiler.hooks.compile.tap(
      'CopyrightWebpackPlugin',
      () => {
        console.log('compile');
      }
    )
  }
}
module.exports = CopyrightWebpackPlugin;
```