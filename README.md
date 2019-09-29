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

## Lazy Loading
懒加载能够加快网页的加载速度，如果你把详情页、弹窗等页面全部打包到一个js文件中，用户如果只访问首页代码就只需要首页的代码，不需要其他页面的代码，加入多余的代码就会让加载时间变长，所以我们可以进行懒加载

> 懒加载并不是webpack里的概念，而是ES6中的import语法，webpack只是能够识别import语法，然后进行代码拆分而已

如：

1.index.js文件
```
document.addEventListener('click', function() {
  const element = document.createElement('div')
  element.innerHTML = 'Hello World'
  document.body.appendChild(element)
})
```

上述代码如果不使用点击事件那么function中的代码因为不执行却加载了，浪费了资源。

所以我们新建一个click.js文件

```
function handleClick() {
  const element = document.createElement('div')
  element.innerHTML = '你好朋友'
  document.body.appendChild(element)
}

export default handleClick
```

并且将index.js改成异步加载的模块（因为这里并没有设置optimization.splitChunks）
```
document.addEventListener('click', () => {
  import('./click.js').then(({ default: func }) => {
    func()
  })
})
```
当加载页面的时候，没有加载click打包后的文件，当点击页面的时候，才会加载该模块。

这么去写代码，才是使页面加载最快的一种方式，写高性能前端代码的时候，不关是考虑缓存，还要考虑代码使用率

所以 webpack 在打包过程中，是希望我们多写这种异步的代码，才能提升网站的性能，这也是为什么 webpack 的 splitChunks 中的 chunks 默认是 async，异步的
## Prefetching
异步能提高你网页打开的性能，而同步代码是增加一个缓存，对性能的提升是非常有限的，因为缓存一般是第二次打开网页或者刷新页面的时候，缓存很有用，但是网页的性能一般是用户第一次打开网页，看首屏的时候。

当然，这也会出现另一个问题，就是当用户点击的时候，才去加载业务模块，如果业务模块比较大的时候，用户点击后并没有立马看到效果，而是要等待几秒，这样体验上也不好，怎么去解决这种问题

这个解决方案就是依赖 webpack 的 Prefetching/Preloading 特性

修改index.js
```
document.addEventListener('click', () => {
  import(/* webpackPrefetch: true */ './click.js').then(({ default: func }) => {
    func()
  })
})
```
webpackPrefetch: true 会等你主要的 JS 都加载完了之后，网络带宽空闲的时候，它就会预先帮你加载好

然后可以查看控制台的network的waterfall，click.js打包后的文件是在空闲的时候进行了缓存，然后在点击的时候直接取缓存来运行。

这里使用的是 webpackPrefetch，还有一种是 webpackPreload

但是preload会和核心的代码并行加载，所以并不推荐