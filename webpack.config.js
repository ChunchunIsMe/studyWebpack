const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  resolveLoader: {
    modules: ['node_modules', './loaders']
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: 'replaceLoader' // 引入自定义loader
          },
          {
            loader: 'replaceLoaderAsync',
            options: {
              name: 'xh'
            }
          }
        ]
      }
    ]
  }
}