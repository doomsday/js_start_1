function inherit (p) {
  if (p == null) throw TypeError()
  if (Object.create) return Object.create(p)
  var t = typeof p
  if (t !== 'object' && t !== 'function') throw TypeError()
  function F () { };
  F.prototype = p
  return new F()
}

Object.defineProperty(Object.prototype, 'extend',
  {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (o) {
      var names = Object.getOwnPropertyNames(o)
      for (var i = 0; i < names.length; i++) {
        if (names[i] in this) continue
        var desc = Object.getOwnPropertyDescriptor(o, names[i])
        Object.defineProperty(this, names[i], desc)
      }
    }
  })

