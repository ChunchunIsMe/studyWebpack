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
## Code Splitting
所用依赖请自行查看package.json

具体问题：

现在webpack4使用的是splitChunksPlugins但是webpack4文档现在仍然使用的是4废弃的commonsChunkPlugin来拆分公共代码

现在我们来配置webpack.config.js文件

1. 自动分割
```
const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].[hash].js', // 代码打包后的文件名，会生成一个hash值如果文件不同则hash就会改变
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  optimization: {
    splitChunks: {
      chunks: 'all'  // chunks: 'all' 意思为分割所有代码，包括同步代码和异步代码（在import或其他导入方式时分割）
    }
  },
  plugins: [new CleanWebpackPlugin()]
}
```
2. 分割配置
```
// 在splitChunks配置项中添加cacheGroups对象
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,       // 使用正则过滤，只有node_modules引入的第三方庫会被分割
        name: 'vendors'                       // 分割配置js的名字
      }
    }
  }
}
```
3. 当没有配置splitChunks时打包完发现只有一个文件

原因是chunks的默认值是async也就是只有在异步引入时才会进行代码分割

如：
```
import('lodash').then(re => {})
```
这种导入方式在默认情况下则会进行分割代码

现在我们来查看webpack官网的默认配置
```
optimization: {
  splitChunks: {
    chunks: 'async',                      // 匹配块的类型 initial(初始块)、async(按需异步加载的块)、all(所有块)
    minSize: 30000,                       // 生成块的最小大小
    maxSize: 0,                           // 告诉webpack尝试将大于大块的块拆分maxSize为较小的部分。零件的尺寸至少为minSize
    minChunks: 1,                         // 拆分前必须共享模块的最小块数
    maxAsyncRequests: 5,                  // 按需加载时最大并行请求数
    maxInitialRequests: 3,                // 入口点的最大并行请求数
    automaticNameDelimiter: '~',          // webpack将使用块的来源和名称的连接符
    name: true,                           // 拆分块的名称。提供true将基于块和缓存组密钥自动生成一个名称
    cacheGroups: {                        // cacheGroups可以覆盖或继承splitChunks.*;中的任何选项
      vendors: {
        name: 'vendors',                  // 缓存组名字
        test: /[\\/]node_modules[\\/]/,   // 正则控制此缓存组选择的模块
        priority: -10                     // 缓存组运行优先级越大优先级越高
      },
      default: {
        minChunks: 2,                     // 共享模块的最小块数（也就是最少被共享了多少次才能拆分）
        priority: -20,
        reuseExistingChunk: true          // 如果当前块包含已从主捆绑包中拆分出的模块，则将重用该模块，而不是生成新的模块。这可能会影响块的结果文件名。
      }
    }
  }
}
```
例子： 
```
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
      lodash: {
        name: 'lodash',
        test: /[\\/]node_modules[\\/]lodash[\\/]/,   // 如果引入的是node_modules/lodash/下的文件则会走这个规则去划分模块
        priority: 10
      },
      commons: {
        name: 'commons',
        minSize: 0, //表示在压缩前的最小模块大小,默认值是 30kb
        minChunks: 2, // 最小公用次数
        priority: 5, // 优先级
        reuseExistingChunk: true // 公共模块必开启
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  }
}
```
使用注释分割模块
```
import(/* webpackChunkName: 'a'*/ './a').then(function(a) {
  console.log(a)
})
```
如果使用上述注释导入文件则会将a独自分割成一个模块