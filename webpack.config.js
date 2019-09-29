const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
    new CleanWebpackPlugin(),   // 默认情况下清除dist下所有文件再进行打包
    new MiniCssExtractPlugin({  // 将css单独打包成文件
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2  // 在一个css引入了另一个css是否启用/禁用或设置在CSS加载程序之前应用的加载程序的数量。 0:没有加载程序（默认）1:postcss-loader 2:postcss-loader，sass-loader
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
}