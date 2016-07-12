'use strict'

var Man = function (name) {
  // private
  var priv = '23'
  // public
  this.name = name
  this.canSpeak = true
  this.sayHello = function () {
    return 'My name is ' + this.name + '. I am ' + priv + ' years old.'
  }
}

var MyApp = {
  Man: function (name) {
    this.name = name
    this.canSpeak = true
  }
}

var jack = new Man('Jack')
var gena = new MyApp.Man('Gena')

try {
  console.log(jack)
  console.log(jack.name)
  console.log(jack.canSpeak)
  console.log(jack.sayHello())
  console.log('')
  console.log(gena)
  console.log(jack instanceof Man)
  console.log(gena instanceof MyApp.Man)
} catch (err) {
  console.log('exception: ' + err.message + ', exception type: ' + err.name)
}
