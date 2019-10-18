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

# 打包自定义函数库
## 准备工作
本次代码是基于master代码进行修改
## 代码配置
index.js
```
import * as math from './math'
import * as string from './string'

export default { math, string }
```
math.js
```
export function add(a, b) {
  return a + b
}

export function minus(a, b) {
  return a - b
}

export function multiply(a, b) {
  return a * b
}

export function division(a, b) {
  return a / b
}
```
string.js
```
export function join(a, b) {
  return a + ' ' + b
}
```
修改pageage.json
{
  "name": "library",
  // ...
  "scripts": {
    "build": "webpack"
  },
  // ...
  "license": "MIT"
  // ...
}
"license": "MIT" 表示完全开源的协议，name 表示你的组件库的名称

webpac.config.js
```
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js'
  }
}
```
运行npm run build打包出来的library.js就可以直接使用了

但是如果你想要支持ES6、CommonJS和AMD三种形式的导入，可以在webpack中配置，加上libraryTarget参数

webpack.config.js
```
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js',
    libraryTarget: 'umd'
  }
}
```
如果你还想要使用script标签形式的引入，然后通过全局变量的形式来使用，就可以配置一个参数叫做library

webpack.config.js
```
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js',
    library: 'root', // root 可以随便更换，不是固定值
    libraryTarget: 'umd'
  }
}
```
umd是支持前面三种语法，但是不支持全局变量这种用法，如果配置了library，打包之后就会将代码挂载到root这个全局变量上.root就是你library导出的东西，如果将umd改为this就要使用this.root来访问了。

libraryTarget 也可以填 window，如果在 node 环境下也可以使用 global

不过一般我们都是使用 umd

还有一种情况就是我们的代码库引入第三方库的情况

比如使用lodash

首先，安装依赖
```
npm i lodash
```
string.js
```
// string.js
import _ from 'lodash'

export function join(a, b) {
  return _.join([a, b], ' ')
}
```
然后再执行打包命令会发现体积大概在75kb左右，因为将lodash也打包进去了。

这种情况当别人即使用我们的库又使用lodash库的时候

如：
```
import _ from 'lodash';
import library from 'library';
```
最终用户的代码就会出现两份lodash的代码，这种时候我们就需要更改webpack配置。

webpack.config.js
```
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  externals: ['lodash'], // externals 会在打包的过程中，如果遇到了 lodash 这个库，就不会打包进去，可以写成数组形式也可以是字符串
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js',
    library: 'root',
    libraryTarget: 'umd'
  }
}
```
externals 会在打包的过程中，如果遇到了 lodash 这个库，就不会打包进去，可以写成数组形式也可以是字符串，更改完后再次打包会发现代码大概只有1kb左右，因为没有将lodash打包进去。

这个时候别人再次使用我们的库的时候，如果不引入lodash，就会失败


如果要让别人使用你的库，其实就是使用你打包后的文件，需要先在 package.json，将 main: index.js 改为 main: ./dist/library.js，通过 npm 发布之前，你要确保你的库的 name 不会和别人上线的 name 冲突，改一个有特点的 name，来确保能发布成功，如 library-xh-2019，感兴趣的可以自己去研究一下如何通过 npm 发布

package.json
```
{
  "name": "library",
  "version": "1.0.0",
  "description": "学习webpack写的一些代码",
  "main": "./dist/library.js",
  "scripts": {
    "build": "webpack"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ChunchunIsMe/studyWebpack.git"
  },
  "keywords": [],
  "author": "linlichun",
  "license": "MIT",
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
    "html-webpack-plugin": "^3.2.0",
    "webpack": "^4.41.0",
    "webpack-cli": "^3.3.9"
  },
  "dependencies": {
    "@babel/polyfill": "^7.6.0",
    "@babel/runtime": "^7.6.2",
    "core-js": "^3.2.1",
    "lodash": "^4.17.15"
  }
}
```