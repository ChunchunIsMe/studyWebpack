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

# 多页面打包配置
## 准备工作
本次代码在DLL的代码上进行修改

建立src/list.js
```
console.log('hello')
```
## 配置
首先修改webpack.base.conf.js
```
// ...
module.exports = {
  // ...
  entry: {
    index: './src/index.js',
    list: './src/list.js'
  }
  // ...
}
```
运行npm run build 发现list.js已经打包进入了dist中，但是这样只实现了多入口打包，并没有实现多页面的打包。

为了让效果明显，我们将每一个打包过的文件进行拆分，所以我们修改webpack.base.conf.js
```
// ...
module.exports = {
  optimization: {
    splitChunks: {
      chunk: 'all',
      cacheGroups: {
        jquery: {
          name: 'jquery',
          priority: 15,
          test: '/[\\/]node_module[\\/]jquery[\\/]/'
        },
        default: {
          name: 'code-segment'
        }
      }
    }
  }
}
```
然后我们使用html-webpack-plugin插件的chunks属性来指定引入的js，然后再复制一份new HHtmlWebpackPlugin来创建两个html

webpack.base.conf.js
```
// ...
module.export = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack',
      filename: 'index.html',
      templete: path.resolve(__dirname, '...', 'index.html'),
      minify: {
        collapseWhitespace: true
      },
      chunks: ['index', 'vendors', 'code-segment', 'jquery', 'lodash']      
    }),
    new HtmlWebpackPlugin({
      title: 'webpack',
      filename: 'list.html',  // 这里记得改名，不然如果同名html将被覆盖
      templete: path.resolve(__dirname, '...', 'index.html'),
      minify: {
        collapseWhitespace: true
      },
      chunks: ['list', 'vendors', 'code-segment', 'jquery', 'lodash']      
    }),
    // ...
  ]
}
```
接下来再运行npm run build会发现它生成了2个html并且一个导入的是index.js一个导入的是list.js