'use strict'

/* ===== Generics ===== */
function enumeration (namesToValues) {
  // fake constructor to return as a return value
  var enumeration = function () { throw 'Creating class instance is forbidden' + ' Enumeration' }

  // enumerable values inherit 'this' object
  var proto = enumeration.prototype = {
    constructor: enumeration,
    toString: function () { return this.name }, // type ID
    valueOf: function () { return this.value }, // returns name
    toJSON: function () { return this.name } // for serialization
  }

  enumeration.values = [] // array of enumerable object-values

  // now creating instances of the new type
  for (name in namesToValues) { // for each value
    var e = inherit(proto) // create object for its representation
    e.name = name // give name to it
    e.value = namesToValues[name] // and value
    enumeration[name] = e // make it constructor's property
    enumeration.values.push(e) // and save into 'values' array
  }
  // class' method for iteration over class instances in circle
  enumeration.foreach = function (f, c) {
    for (var i = 0; i < this.values.length; i++) f.call(c.this.values[i])
  }
  // return constructor, identifying new type
  return enumeration
}
function inherit (p) {
  if (p == null) throw TypeError()
  if (Object.create)
    return Object.create(p)
  var t = typeof p
  if (t !== 'object' && t !== 'function') throw TypeError()
  function F () {}
  F.prototype = p
  return new F()
}
function extend (o, p) {
  for (prop in p) {
    o[prop] = p[prop]
  }
  return o
}

/* ===== Set ===== */
function Set () {
  this.values = {}
  this.n = 0
  this.add.apply(this, arguments)
}
Set.prototype.add = function () {
  for (var i = 0; i < arguments.length; i++) {
    var val = arguments[i]
    var str = Set._v2s(val)
    if (!this.values.hasOwnProperty(str)) {
      this.values[str] = val
      this.n++
    }
  }
  return this
}
// deletes arguments from Set
Set.prototype.remove = function () {
  for (var i = 0; i < arguments.length; i++) {
    var str = Set._v2s(arguments[i])
    if (this.values.hasOwnProperty(str)) {
      delete this.values[str]
      this.n--
    }
  }
  return this
}
// check argument presence in the Set
Set.prototype.contains = function (value) {
  return this.values.hasOwnProperty(Set._v2s(value))
}
// returns Set's size
Set.prototype.size = function () { return this.n }
// for internal use, reflects any JS values into unique strings
Set._v2s = function (val) {
  switch (val) {
    case undefined:
      return 'u'
    case null:
      return 'n'
    case true:
      return 't'
    case false:
      return 'f'
    default:
      switch (typeof val) {
        case 'number':
          return '#' + val
        case 'string':
          return '"' + val
        default:
          return '@' + objectId(val)
      }
  }

  function objectId (o) {
    var prop = '|**objectId**|'
    if (!o.hasOwnProperty(prop))
      o[prop] = Set._v2s.next++
  }
}
Set._v2s.next = 100

/* ===== SingletonSet ===== */
function SingletonSet (member) {
  this.member = member
}
SingletonSet.prototype = Object.create(Set.prototype)
extend(SingletonSet.prototype, {
  constructor: SingletoneSet,
  add: function () { throw 'Set is read-only' },
  remove: function () { throw 'Set is read-only' },
  size: function () { return 1 },
  foreach: function (f, context) { f.call(context, this.member) },
  contains: function (x) { return x === this.member }
})

/* ===== NonNullSet ====== */
function NonNullSet () {
  Set.apply(this, arguments)
}

NonNullSet.prototype = Object.create(Set.prototype)
NonNullSet.prototype.constructor = NonNullSet

NonNullSet.prototype.add = function () {
  for (var i = 0; i < arguments; i++)
    if (arguments[i] == null)
      throw new Error('null and undefined is forbidden in NonNullSet')
  return Set.prototype.add.apply(this, arguments)
}

/* ===== filteredSetSubclass ====== */
function filteredSetSubclass (superclass, filter) {
  var constructor = function () {
    superclass.apply(this, arguments)
  }
  constructor.prototype = Object.create(superclass.prototype)
  constructor.prototype.constructor = constructor
  constructor.prototype.add = function () {
    for (var i = 0; i < arguments; i++) {
      var v = arguments[i]
      if (!filter(v)) throw ('value ' + v + ' rejected by filter')
    }
    superclass.prototype.add.apply(this, arguments)
  }
  return constructor
}
