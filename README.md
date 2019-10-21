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

# TypeScript的配置
## 准备工作
这次代码直接在空文件夹下开始

初始化
```
npm init -y
```
安装webpack依赖
```
npm i webpack webpack-cli -D
```
## 配置
新建src/index.ts文件
```
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

const greeter = new Greeter("It's me");
alert(greeter.greet());
```
这段代码在浏览器是运行不了的需要我们打包编译，转换成js
```
npm i ts-loader typescript -D
```
新建webpack.config.js并配置
```
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```
在package.json中配置script
```
{
  "scripts": {
    "build": "webpack"
  }
}
```
> 当打包typescript的时候，需要在项目的根目录下创建一个tsconfig.json文件

以下为简单配置，更多详情看[官网](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html "官网");
```
{
  "compileerOptions": {
    "outDir": "./dist", // 写不写都行
    "module": "es6", // 用 es6 模块引入 import
    "target": "es5", // 打包成 es5
    "allowJs": true // 允许在 ts 中也能引入 js 的文件
  }
}
```
然后再控制台上运行`npm run build`可以发现提示打包成功
## 引入第三方库
```
npm i @types/lodash -D
```
安装以后修改index.ts
```
import * as _ from 'lodash';
// ts需要这样引入

class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return _.join(null, '');
  }
}

const greeter = new Greeter("It's me");
alert(greeter.greet());
```
这样就可以使用第三方库了，因为TS的第三方库和js的不一样如果使用JS的第三方库就有很大的可能报错。

一般是`npm i @types/[bundle name]`来安装TS的库

但是最好还是在[TypeSearch](https://microsoft.github.io/TypeSearch/ 'TypeSearch')上来搜索想用的库。