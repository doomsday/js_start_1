var MYAPP = (function () {
  var funcPrivate = function () {
    console.log('private')
  }
  return {
    func: function (a, b) {
      console.log(this)
      return a + b
    }
  }
})()

try {
  alert(typeof MYAPP)
  console.log(typeof MYAPP.func)
  console.log(MYAPP.func(1, 5))
  console.log(MYAPP.funcPrivate())
} catch (err) {
  console.log('exception: ' + err.message + ', exception type: ' + err.name)
}
