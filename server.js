var MYAPP = (function () {
  function funcPrivate () {
    return 'private'
  }
  return {
    func: function (a, b) {
      //      console.log(this)
      var that = this
      function helperFunc (c, d) {
        that.multily = c * d
      }
      helperFunc(a, b)
      return a + b
    },
    funcPublic: funcPrivate
  }
})()

var add = function () {
  return this.func(10, 10)
}

var sum = add.apply(MYAPP, undefined)

try {
  console.log('MYAPP.func(2, 3): ' + MYAPP.func(2, 3))
  console.log('MYAPP.funcPublic(): ' + MYAPP.funcPublic())
  console.log('MYAPP.multiply: ' + MYAPP.multily)
  console.log('sum: ' + sum)
} catch (err) {
  console.log('exception: ' + err.message + ', exception type: ' + err.name)
}
