const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');
const fs = require('fs');

const productionConfig = require('./webpack.prod.conf'); // 引入生产环境配置文件
const developmentConfig = require('./webpack.dev.conf'); // 引入开发环境配置文件

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin'); // 引入

/**
 * 根据不同的环境，生成不同的配置
 * @param {String} env "development" or "production"
 */
const generateConfig = env => {
  // 将需要的 Loader 和 Plugin 单独声明
  const scriptLoader = [
    {
      loader: 'babel-loader'
    }
  ]

  const cssLoader = [
    'style-loader',
    'css-loader',
    'postcss-loader', // 使用 postcss 为 css 加上浏览器前缀
    'sass-loader' // 使用 sass-loader 将 scss 转为 css
  ]

  const cssExtractLoader = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    'css-loader',
    'postcss-loader',
    'sass-loader'
  ]

  const fontLoader = [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        limit: 5000,
        publicPath: 'fonts/',
        outputPath: 'fonts/'
      }
    }
  ]

  const imageLoader = [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        limit: 10000,
        outputPath: 'images/'
      }
    },
    // 图片压缩
    {
      loader: 'image-webpack-loader',
      options: {
        // 压缩 jpg/jpeg 图片
        mozjpeg: {
          progressive: true,
          quality: 50 // 压缩率
        },
        // 压缩 png 图片
        pngquant: {
          quality: '65-90',
          speed: 4
        }
      }
    }
  ]

  const styleLoader = env === 'production' ? cssExtractLoader : cssLoader;

  const plugins = [
    new HtmlWebpackPlugin({
      title: 'webpack4实战',
      filename: 'index.html',
      template: path.resolve(__dirname, '..', 'index.html'),
      minify: {
        collapseWhitespace: true
      },
      chunks: ['index', 'vendors', 'code-segment', 'jquery', 'lodash']
    }),
    new HtmlWebpackPlugin({
      title: 'webpack4实战',
      filename: 'list.html',
      template: path.resolve(__dirname, '..', 'index.html'),
      minify: {
        collapseWhitespace: true
      },
      chunks: ['list', 'vendors', 'code-segment', 'jquery', 'lodash']
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new CleanWebpackPlugin()
  ]

  const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
  files.forEach(file => {
    if (/.*\.dll.js/.test(file)) {
      plugins.push(
        new AddAssetHtmlWebpackPlugin({
          filepath: path.resolve(__dirname, '../dll', file)
        })
      )
    }

    if (/.*\.manifest.json/.test(file)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, '../dll', file)
        })
      )
    }
  })

  return {
    entry: {
      index: './src/index.js',
      list: './src/list.js'
    },
    output: {
      publicPath: env === 'development' ? '/' : './',
      path: path.resolve(__dirname, '..', 'dist'),
      filename: '[name]-[hash:5].bundle.js',
      chunkFilename: '[name]-[hash:5].chunk.js'
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /(node_module)/, use: scriptLoader },
        { test: /\.(sa|sc|c)ss$/, use: styleLoader },
        { test: /\.(eot|woff2?|ttf|svg)$/, use: fontLoader },
        { test: /\.(png|jpg|jpeg|gif)$/, use: imageLoader }
      ]
    },
    plugins
  }
}

module.exports = env => {
  const config = env === 'production' ? productionConfig : developmentConfig
  return merge(generateConfig(env), config); // 合并公共配置 和 环境配置
}