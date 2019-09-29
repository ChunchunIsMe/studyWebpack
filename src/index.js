// 异步代码
import(/* webpackChunkName: 'a' */ './a').then(function (a) {
  console.log(a);
})

import(/* webpackChunkName: 'b' */ './b').then(function (b) {
  console.log(b);
})

import(/* webpackChunkName: 'lodash' */ 'lodash').then(function (_) {
  console.log(_.join(['a', 'b']))
})