class CopyrightWebapckPlugin {
  constructor(options) {
    console.log('plugins');
    console.log('options = ', options)
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'CopyrightWebapckPlugin',
      (compilation, cb) => {
        compilation.assets['copyright.txt'] = {
          source: function () {
            return 'abcd';
          },
          size: function () {
            return 4; // 上面source返回字符长度
          }
        }
        console.log('compilation.assets = ', compilation.assets);
        cb();
      }
    );

    compiler.hooks.compile.tap(
      'CopyrightWebapckPlugin',
      () => {
        console.log('compile');
      }      
    )
  }
}

module.exports = CopyrightWebapckPlugin;