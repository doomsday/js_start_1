'use strict'

// var $j = jQuery.noConflict()
// // jQuery(document).ready(function(){
// $j(function () {
//   $j(window).resize(function (e) {
//     $j('#resize-text').text('Width: ' + window.innerWidth + ', Height: ' + window.innerHeight)
//   })
// })

// for (let [k, v] in Iterator({a: 1,b: 2}))
//   console.log(k + '=' + v)

/* Generators */

// function range(min, max) {
//   for (let i = Math.ceil(min); i < max; i++) yield i
// }
// for (let n in range(3,8)) console.log(n)

// Generator returns strings of text one by one
function * eachline (s) {
  let p
  while ((p = s.indexOf('\n')) !== -1) {
    yield s.substring(0, p)
    s = s.substring(p + 1)
  }
  // return the rest
  if (s.length > 0) yield s
}

function * map (i, f) {
  for (let x of i) yield f(x)
}

function * select (i, f) {
  for (let x of i) {
    if (f(x)) yield x
  }
}

let text = ' #comment \n \n hello \nworld\n quit \n unreached \n'

let lines = eachline(text)
let trimmed = map(lines, function (line) { return line.trim() })
let nonblank = select(trimmed, function (line) {
  return line.length > 0 && line[0] !== '#'
})

for (let line of nonblank) {
  if (line === 'quit') break
  console.log(line)
}

// function counter(initial) {
//   let nextValue = initial
//   while(true) {
//     try {
//       let increment = yield nextValue
//     }
//   }
// }

// function * idMaker() {
//   var index = 0
//   while(index < 3)
//   yield index++
// }

// var gen = idMaker()

// console.log(gen.next()) // 0
// console.log(gen.next()) // 1
// console.log(gen.next()) // 2
// console.log(gen.next())

// var myGen = function * () {
//   var one = yield 1
//   var two = yield 2
//   var three = yield 3
//   console.log(one, two, three)
// }

// var gen = myGen()

// console.log(gen.next())
// console.log(gen.next(4))
// console.log(gen.next(5))
// console.log(gen.next('e'))
// // console.log(gen.next())
