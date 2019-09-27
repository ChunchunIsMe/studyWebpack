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
    chunkFilename: '[name].[hash].js' // 代码拆分后的文件名
  },
  plugins: [
    new HTMLWebpackPlugin({   // 自动生成一个html文件并且引入打包的js
      title: 'studyWebpack'   // html的title
    }),
    new CleanWebpackPlugin()   // 默认情况下清除dist下所有文件再进行打包
  ],
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