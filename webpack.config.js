const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js'  // 需要打包的文件入口
  },
  output: {
    publicPath: __dirname + '/dist/', // js引用的地址或者CDN地址
    path: path.resolve(__dirname, 'dist'), // 文件打包的输出目录
    filename: '[name].[hash].js',    // 打包生产的js文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  plugins: [
    new HTMLWebpackPlugin({   // 自动生成一个html文件并且引入打包的js
      title: 'studyWebpack'   // html的title
    }),
    new CleanWebpackPlugin()   // 默认情况下清除dist下所有文件再进行打包
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        lodash: {        // 可以继续拆分
          name: 'lodash',
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          priority: 5   // 优先级要大于vendors不然会被打包进vendors
        },
        commons: {
          name: 'commons',
          minSize: 0,   // 压缩前最小模块大小，默认30kb
          minChunks: 2, // 最小共用次数
          priority: 5,  // 优先级
          reuseExistingChunk: true  // 公共模块必开启
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
  },
  module: {
    rules: [
      {
        test: /\.js$/,   // 使用正则对象匹配js文件
        exclude: /node_module/,  // 排除依赖包文件夹
        use: {
          loader: 'babel-loader'  // 使用 babel-loader
        }
      }
    ]
  }
}