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

# 编写loader
## 准备工作
这次我们在空文件夹下操作

然后就是将空文件夹素质三连
```
npm init -y

npm i webpack webpack-cli -D
```
新建src/index.js
```
console.log('hello world')
```
## 编写loader
### 简单编写loader
新建loaders/repalceLoader.js
```
module.exports = function (source) {
  retrun source.replace('world', 'loader');
}
```
source就是我们的代码我们将代码中的world替换成了loader

编写webpac.config.js
```
module.exports = {
  mode: 'development', // 使用dev环境主要是可以让打包后的代码更好看
  entry: {
    index: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: path.resolve(__dirname, './loaders/replaceLoader.js')
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    name: '[name].js'
  }
}
```
然后运行webpack进行打包可查看index.js hello world 已经变成了hello loader
### 使用参数
如果我们要使用参数，我们可以在loader中使用this.query进行获取参数

webpack.config.js
```
module.exports = {
  mode: 'development', // 使用dev环境主要是可以让打包后的代码更好看
  entry: {
    index: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [{
          loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
          options: {
            name: 'xh'
          }
        }]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    name: '[name].js'
  }
}
```
replaceLoader.js
```
module.exports = function (source) {
  retrun source.replace('world', this.query.name);
}
```
然后再打包之后就能发现world换成了xh
### 优化参数获取
如果你的options不是一个对象的到时候使用this.query可能会有一些问题，所以官方推荐使用loader-utils来获取options中的内容
```
npm i loader-utils -D
```
replaceLoader.js
```
const loaderUtils = require('loader-utils');
module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  retrun source.replace('world', options.name);
}
```
此时不管webpack中loader的options是任何值都不会出问题了
### 传递额外信息
官方给我们提供了一个callback函数,他可以帮我们传递额外的信息具体可以看官网 [this.callback](https://webpack.js.org/api/loaders/#thiscallback 'this.callback')
```
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```
修改replaceLoader.js
```
const loaderUtils = require('loader-utils');
module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  const result =  source.replace('world', options.name);
  this.callback(null, result);
}
```
再将代码打包发现结果和之前是一样的
### 异步loader
你可能会使用async/await来进行异步操作，我们新建一个文件replaceLoaderAsync.js
```
const loaderUtils = require('loader-utils');
module.exports = async function (source) {
  const options = loaderUtils.getOptions(this);
  
  const result = await new Promise(re => {
    setTimeout(() => {
      const result = source.replace('world', options.name);
      re(result);
    }, 1000)
  })
  return result;
}
```
webpack.config.js
```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  resolveLoader: {
    modules: ['node_modules', './loaders']
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: path.resolve(__dirname, './loader/replaceLoaderAsync.js'),
            options: {
              name: 'xh'
            }
          }
        ]
      }
    ]
  }
}
```
打包之后发现打包成功

然后官方还给我们提供了一个API this.async();

replaceLoaderAsync.js
```
const loaderUtils = require('loader-utils');
module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  const callback = this.async();
  setTime(() => {
    const result = source.replace('world', options.name);
    callback(null, result);
  }, 1000)
}
```
还可以使用前一个API this.callback
```
const loaderUtils = require('loader-utils');
module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  setTime(() => {
    const result = source.replace('world', options.name);
    this.callback(null, result);
  }, 1000)
}
```
以上三种方法都能实现异步

最后修改webpack.config.js
```
const loaderUtils = require('loader-utils');
module.exports = async function (source) {
  const options = loaderUtils.getOptions(this);
  
  const result = new Promise(re => {
    setTimeout(() => {
      const result = source.replace('world', options.name);
      re(result);
    }, 1000)
  })
  return result;
}
```
webpack.config.js
```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  resolveLoader: {
    modules: ['node_modules', './loaders']
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: path.resolve(__dirname, './loader/replaceLoader.js')
          },
          {
            loader: path.resolve(__dirname, './loader/replaceLoaderAsync.js'),
            options: {
              name: 'xh'
            }
          }
        ]
      }
    ]
  }
}
```
修改replaceLoader.js
```
const loaderUtils = require('loader-utils');

module.exports = function (soruce) {
  const options = loaderUtils.getOptions(this);
  const result = soruce.replace('xh', 'world111');
  this.callback(null, result);
}
```
### 简化loader引用
是不是觉得写path.resolve引用自己的loader觉得麻烦，这个使用我们可以使用webpack.resolveLoader属性

webpack.config.js
```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  resolveLoader: {
    modules: ['node_modules', './loaders']
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: 'replaceLoader' // 引入自定义loader
          },
          {
            loader: 'replaceLoaderAsync',
            options: {
              name: 'xh'
            }
          }
        ]
      }
    ]
  }
}
```
这个属性遇到loader会按指定的数组顺序查找loader