document.addEventListener('click', function () {
  import(/* webpackPrefetch: true */'./click').then(function ({ default: func }) {
    func();
  })
})