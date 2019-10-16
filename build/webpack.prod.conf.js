const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将 css 单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩 css

module.exports = {
  mode: 'production',

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        jquery: {
          name: 'chunk-juqery', // 单独将jquery拆包
          priority: 15,
          test: /[\\/]node_modules][\\/]jquery[\\/]/
        }
      }
    }
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // 压缩 css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g, // 一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源css文件的文件名。默认为/\.css$/g
      cssProcessor: require('cssnano'), // 用于优化/最小化css的css处理器，默认为 cssnano
      cssProcessorOptions: { // 传递给cssProcessor的选项，默认为{}
        safe: true,
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true // 一个布尔值，指示插件是否可以将信息打印到控制台，默认为true
    })
  ]
}