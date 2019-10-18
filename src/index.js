import '@babel/polyfill'

import './assets/style/base.scss'
import './assets/style/common.scss'

import './assets/font/iconfont.css' // 引入字体文件
var minus = require('./vendor/minus');
console.log('minus(1, 2) = ', minus(1, 2));

require(['./vendor/multi'], function (multi) {
  console.log('multi(1, 2) = ', multi(1, 2));
})

import sum from './vendor/sum';
console.log('sum(1, 2) = ', sum(1, 2));

$.get(
  '/try/ajax/ajax_info.txt',
  function (data) {
    setTimeout(function () {
      $('body').append(data);
    }, 2000)
  }
)

import _ from 'lodash'
console.log(_.join(['hello', 'world'], '-'))