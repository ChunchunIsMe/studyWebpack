const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件

const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

let spritesConfig = {
  spritePath: './dist/images'
}

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
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('postcss-sprites')(spritesConfig)]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              outputPath: 'images/',  // 输出到images目录下
              limit: 20000            // 小于20kb转换成base64
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpg/jpeg 图片
              mozjpeg: {
                progressive: true,
                quality: 65 // 压缩率
              },
              // 压缩 png 图片
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              }
            }
          }
        ]
      }
    ]
  }
}