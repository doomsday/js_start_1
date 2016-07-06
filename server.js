function inherit (p) {
  if (p == null) throw TypeError()
  if (Object.create) return Object.create(p)
  var t = typeof p
  if (t !== 'object' && t !== 'function') throw TypeError()
  function F () { };
  F.prototype = p
  return new F()
}

var o1 = {
  data_prop: 111,
  get accessor_prop () { return this.data_prop },
  set accessor_prop (value) { this.data_prop = value }
}

var q = inherit(o1)
q.x = 1
q.y = 1

try {
  console.log(Object.getOwnPropertyDescriptor(o1, 'data_prop'))
  console.log(Object.getOwnPropertyDescriptor(o1, 'accessor_prop'))
} catch (err) {
  console.log('exception: ' + err.message + ', exception type: ' + err.name)
}
