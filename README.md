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

# PWA
关于PWA的介绍我们可以在[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps "PWA")上查看
## 准备工作
这次我们在开发和生产模式实战的代码上进行修改
### 安装依赖
首先安装http-server用来启动一个服务
```
npm i http-server -D
```
### 修改配置
package.json
```
{
  // ...
  "script": {
    "start": "http-server dist"
    // ...
  }
  // ...
}
```
## 开始
这个时候我们首先进行代码的打包，运行`npm run build`然后运行`npm run start`这个时候我们访问http://127.0.0.1:8080  就能看到我们代码的效果了。

然后我们在终端按下ctrl+c关闭http-server来模拟服务器挂了的场景，再访问http://127.0.0.1:8080  就会显示无法访问此网站

页面访问不到了，因为服务器挂了，这里使用到的PWA技术就是在你第一次访问成功的时候，做一个缓存，当服务器挂的时候依然可以访问这个网页

首先安装一个插件： workbox-webpack-plugin
```
npm i workbox-webpack-plugin -D
```
只有当要上线的代码，才需要做PWA的操作，所以修改webpack.prod.conf.js
```
const WorkboxPlugin = require('workbox-webpack-plugin'); // 引入 PWA 插件

module.exports = {
  // ...
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    // ...
  ]
  // ...
}
```
重新运行`npm run build`打包代码，在dist下就会多出`service-worker.js` 和 `precache-manifest.js` 两个文件，通过这两个文件就能使我们的网页支持 PWA 技术，service-worker.js 可以理解为另类的缓存。

还要去业务代码中使用service-worker

在index.js中加入以下代码
```
// ...
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('service-worker registen');
    }).catch(error => {
      console.log('service-worker registed error');
    })
  })
}
// ...
```

然后运行`npm run build`，然后`npm run start`然后打开 http://127.0.0.1:8080 ，打开控制台

打开网页之后文件已经被缓存住了，关闭服务之后再次刷新页面也是还能显示的。