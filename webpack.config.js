const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件

const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/index.js'  // 需要打包的文件入口
  },
  output: {
    publicPath: '/', // js引用的地址或者CDN地址
    path: path.resolve(__dirname, 'dist'), // 文件打包的输出目录
    filename: '[name].[hash].js',    // 打包生产的js文件名
    chunkFilename: '[name].[hash].js' // 代码拆分后的文件名
  },
  mode: 'development',  // 开发模式
  devtool: 'source-map',  // 开启调试
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8000,   // 本地服务器端口号
    hot: true,    // 热重载
    overlay: true, // 如果代码出错，会在浏览器弹出浮动层，类似于vue-cli等脚手架。
    proxy: {
      // 跨域代理转发
      '/try': {
        target: 'https://www.runoob.com',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: ''
        }
      }
    },
    historyApiFallback: {
      // HTML5 history模式
      rewrites: [{ form: /.*/, to: '/index.html' }]
    }
  },
  plugins: [
    new HTMLWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 打包生成后的文件名
      template: 'index.html', // 根据此模版生成 HTML 文件
      chunks: ['main']
    }),
    new CleanWebpackPlugin(),   // 默认情况下清除dist下所有文件再进行打包
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // 清除无用的css
    new PurifyCSS({
      paths: glob.sync([
        // 要做css TreeShaking的路径文件
        path.resolve(__dirname, './*.html'),
        path.resolve(__dirname, './src/*.js')
      ])
    }),
    new webpack.HotModuleReplacementPlugin(), // 热部署模块
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,   // 使用正则对象匹配js文件
        exclude: /node_module/,  // 排除依赖包文件夹
        use: {
          loader: 'babel-loader'  // 使用 babel-loader
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  }
}