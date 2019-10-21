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

# Eslint配置
## 起步
这次在空文件夹下开始

初始化
```
npm init -y
```
安装webpack依赖
```
npm i webpack webpack-cli -D
```
安装eslint依赖，这次我们使用的是version 5 现在最新的版本是6，init的时候总是报错我不知道怎么解决，所以先用5，之后会出一个6的学习笔记
```
npm i eslint@5 -D
```
## 配置
使用npx来初始化配置
```
npx eslint --init
```
一路按enter就完事了，但是当选择React/Vue/JavaScript，我们统一都先选择 JavaScript。然后项目就会多一个.eslintrc.js的配置文件。
```
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
    }
};
```
里面就是eslint的一些规范，也可以定义一些规则，具体看[eslint配置规则](https://cn.eslint.org/docs/user-guide/configuring "eslint配置规则")

然后在编译器安装eslint插件的情况下载index.js中随便写点代码
```
// index.js
let a = 1;
```
这个时候我们可以看到eslint报错了说a没有被使用

或者我们也可以使用命令行的形式，让eslint校验整个src目录下的文件
```
npx eslint src
```
然后我们如果想要让打包的时候先eslint校验那我们首先需要安装一个插件
```
npm i eslint-loader -D
```
然后生成一个webpack.config.js
```
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.js' // 需要打包的文件入口
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 使用正则来匹配 js 文件
        exclude: /nodes_modules/, // 排除依赖包文件夹
        use: {
          loader: 'eslint-loader' // 使用 eslint-loader
        }
      }
    ]
  },
  output: {
    // eslint-disable-next-line no-undef
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: 'bundle.js' // 打包后生产的 js 文件
  }
}
```
因为webpack配置文件也会被eslint校验，所以这里先写上注释关闭校验

如果想要使用babel-loader来转译，那么loader应该
```
loader: ['babel-loader', 'eslint-loader']
```
rules的执行顺序是从后往前的所以我们先经过 eslint 校验判断代码是否符合规范，然后再通过 babel 来做转译

然后进行打包会发现是会报错的报的错就是eslint的错误

这个时候我们将index.js改成符合eslint规范的代码
```
const a = 1;
function name(params) {
  return params;
}
name(a);
```
这样修改之后再次打包就会发现打包成功了

还有就是如果使用fix选项那么会自动修复一些错误，但是不能自动修复的还是要你自己手动修复
```
{
 loader: 'eslint-loader', // 使用 eslint-loader
  options: {
    fix: true
  }
}
```