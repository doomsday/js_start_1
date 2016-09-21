'use strict'
Object.prototype.extend = extend

/* ============================================================== */
/* ===== GENERICS =============================================== */
/* ============================================================== */

// Enumeration function. It is not a constructor: it does not define
// 'enumeration' class. It is a fabric: it creates and returns a new
// class with each call
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
  for (var name in namesToValues) { // for each value
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
  for (var prop in p) {
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
// function SingletonSet (member) {
//   this.member = member
// }
// SingletonSet.prototype = Object.create(Set.prototype)
// extend(SingletonSet.prototype, {
//   constructor: SingletonSet,
//   add: function () { throw 'Set is read-only' },
//   remove: function () { throw 'Set is read-only' },
//   size: function () { return 1 },
//   foreach: function (f, context) { f.call(context, this.member) },
//   contains: function (x) { return x === this.member }
// })

/* ===== NonNullSet ====== */
// function NonNullSet () {
//   Set.apply(this, arguments)
// }

// NonNullSet.prototype = Object.create(Set.prototype)
// NonNullSet.prototype.constructor = NonNullSet

// NonNullSet.prototype.add = function () {
//   for (var i = 0; i < arguments; i++)
//     if (arguments[i] == null)
//       throw new Error('null and undefined is forbidden in NonNullSet')
//   return Set.prototype.add.apply(this, arguments)
// }

/* ===== filteredSetSubclass ====== */
// function filteredSetSubclass (superclass, filter) {
//   var constructor = function () {
//     superclass.apply(this, arguments)
//   }
//   constructor.prototype = Object.create(superclass.prototype)
//   constructor.prototype.constructor = constructor
//   constructor.prototype.add = function () {
//     for (var i = 0; i < arguments; i++) {
//       var v = arguments[i]
//       if (!filter(v)) throw ('value ' + v + ' rejected by filter')
//     }
//     superclass.prototype.add.apply(this, arguments)
//   }
//   return constructor
// }

/* ============================================================== */
/* ===== HIERARCHY OF ABSTRACT AND CONCRETE CLASSES OF SETS ===== */
/* ============================================================== */

function abstractmethod () {
  throw new Error('Abstract method')
}

function AbstractSet () {
  throw new Error('Instantiation of abstract class is not allowed')
}
AbstractSet.prototype.contains = abstractmethod

/* ===== NotSet ===== */
/* Elements of this set are elements which are not elements of an another set */
var NotSet = AbstractSet.extend(
  function NotSet (set) { this.set = set },
  {
    contains: function (x) { return !this.set.contains(x) },
    toString: function (x) { return '~' + this.set.toString() },
    equals: function (that) {
      return that instanceof NotSet && this.set.equals(that.set)
    }
  }
)

/* ===== AbstractEnumerableSet ===== */
// Abstract subclass of class AbstractSet
var AbstractEnumerableSet = AbstractSet.extend(
  function () { return new Error('Instantiation of abstract class is not allowed') },
  {
    size: abstractmethod,
    foreach: abstractmethod,
    isEmpty: function () { return this.size() == 0 },
    toString: function () {
      var s = '{'
      var i = 0
      this.foreach(function (v) {
        if (i++ > 0) s += ', '
        s += v
      })
      return s + '}'
    },
    toLocaleString: function () {
      var s = '{'
      var i = 0
      this.foreach(function (v) {
        if (i++ > 0) s += ', '
        if (v == null) s += v
        else s += v.toLocaleString()
      })
      return s + '}'
    },
    toArray: function () {
      var a = []
      this.foreach(function (v) { a.push(v) })
      return a
    },
    equals: function (that) {
      // if is not AbstractEnumerableSet cannot be equal
      if (!(that instanceof AbstractEnumerableSet)) return false
      if (this.size() !== that.size()) return false
      try {
        this.foreach(function (v) {
          if (!that.contains(v)) throw false
          return true
        })
      } catch (x) {
        if (x === false) return false
        // rethrow if the exception is now ours
        throw x
      }
    }
  }
)

/* ===== SingletonSet ===== */
// Set of single element, read-only accessible
var SingletonSet = AbstractEnumerableSet.extend(
  function SingletonSet (member) { this.member = member },
  {
    contains: function (x) { return x === this.member },
    size: function () { return 1 },
    foreach: function (f, ctx) { f.call(ctx, this.member) }
  }
)

/* ===== AbstractWritableSet ===== */
// Abstract subclass of AbstractEnumerableSet
var AbstractWritableSet = AbstractEnumerableSet.extend(
  function () { return new Error('Instantiation of abstract class is not allowed') },
  {
    add: abstractmethod,
    remove: abstractmethod,
    union: function (that) {
      var self = this
      that.foreach(function (v) { self.add(v) })
      return this
    },
    intersection: function (that) {
      var self = this
      this.foreach(function (v) { if (!that.contains(v)) self.remove(v) })
      return this
    },
    difference: function (that) {
      var self = this
      that.foreach(function (v) { self.remove(v) })
      return this
    }
  }
)

/* ===== ArraySet ===== */
// Concrete subclass of AbstractWritableSet class
var ArraySet = AbstractWritableSet.extend(
  function ArraySet () {
    this.values = []
    this.add.apply(this, arguments)
  },
  {
    contains: function (v) { return this.values.indexOf(v) != -1 },
    size: function () { return this.values.length },
    foreach: function (f, c) { this.values.forEach(f, c) },
    add: function () {
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i]
        if (!this.contains(arg)) this.values.push(arg)
      }
      return this
    },
    remove: function () {
      for (var i = 0; i < arguments.length; i++) {
        var p = this.values.indexOf(arguments[i])
        // do nothing if exists
        if (p == -1) continue
        // delete item if exists in 'values'
        this.values.splice(p, 1)
      }
      return this
    }
  }
)

/* ============================================================== */

/* ===== Defining of nonenumerable properties ===== */
;(function () {
  Object.defineProperty(Object.prototype, 'objectId', {
    get: idGetter,
    enumerable: false,
    configurable: false
  })
  function idGetter () {
    if (!(idprop in this)) {
      if (!Object.isExtensible(this))
        throw Error('Impossible to find ID of nonenuberable object')
      Object.defineProperty(this, idprop, {
        value: nextid++,
        writable: false,
        enumerable: false,
        configurable: false
      })
    }
    return this[idprop]
  }
  var idprop = '|**ObjectId**|'
  var nextid = 1
}())

/* ===== Invariable class with read-only properties and methods ===== */
// function Range (from, to) {
//   // properties descriptors of 'from' and 'to' in read-only mode
//   var props = {
//     from: { value: from, enumerable: true, writable: false, configurable: false },
//     to: { value: to, enumerable: true, writable: false, configurable: false }
//   }
//   if (this instanceof Range) // if called as constructor
//     Object.defineProperties(this, props) // define properties
//   else // as fabric otherwise
//     return Object.create(Range.prototype, props) // create and return new Range object with properties
// }
// Object.defineProperties(Range.prototype, {
//   includes: {
//     value: function (x) { return this.from <= x && x <= this.to }
//   },
//   foreach: {
//     value: function (f) {
//       for (var x = Math.ceil(this.from); x <= this.to; x++) f(x)
//     }
//   },
//   toString: {
//     value: function () { return '(' + this.from + '...' + this.to + ')' }
//   }
// })

/* ===== Auxiliary functions to work with properties desctiptors ===== */
// Makes selected (or every) properties of 'o' object unconfigurable
function freezeProps (o) {
  var props = (arguments.length == 1) // if agrument is one
    ? Object.getOwnPropertyNames(o) // change all properties
    : Array.prototype.splice.call(arguments, 1) // remove first (object) argument
  props.forEach(function (n) { // Makes each property unconfigurable and read-only
    // skip unconfigurable properties
    if (!Object.getOwnPropertyDescriptor(o, n).configurable) return
    Object.defineProperty(o, n, {writable: false, configurable: false})
  })
  return o
}
// Makes selected (or every) properties of object 'o' non-enumerable
// if they are configurable
function hideProps (o) {
  var props = (arguments.length == 1) // if agrument is one
    ? Object.getOwnPropertyNames(o) // change all properties
    : Array.prototype.splice.call(arguments, 1) // remove first (object) argument
  props.forEach(function (n) { // Makes each property unconfigurable and read-only
    // skip unconfigurable properties
    if (!Object.getOwnPropertyDescriptor(o, n).configurable) return
    Object.defineProperty(o, n, {enumerable: false})
  })
  return o
}

// More simple definition of a read-only class
// function Range (from, to) {
//   this.from = from
//   this.to = to
//   freezeProps(this)
// }
// Range.prototype = hideProps({
//   constructor: Range,
//   includes: function (x) { return this.from <= x && x <= this.to },
//   foreach: function (f) { for (var x = Math.ceil(this.from); x <= this.to; x++) f(x) },
//   toString: function () { return '(' + this.from + '...' + this.to + ')' }
// })
/* =================================================================== */

/* ===== Range class with strictly incapsulated ranges ===== */
function Range (from, to) {
  // first check condition met
  if (from > to) throw new Error("Range: 'from' must be less than 'to'")
  // definition of access methods, which control condition fulfillment
  function getFrom () { return from }
  function getTo () { return to }
  function setFrom (f) {
    if (f <= to) from = f
    else throw new Error("Range: 'from' must be less than 'to'")
  }
  function setTo (t) {
    if (to >= from) to = t
    else throw new Error("Range: 'to' must be >= than 'from'")
  }
  // create enumerable, unconfigurable properties with access methods
  Object.defineProperties(this, {
    from: {get: getFrom, set: setFrom, enumerable: true, configurable: false},
    to: {get: getTo, set: setTo, enumerable: true, configurable: false}
  })
}
// prototype configuration stays the same
Range.prototype = hideProps({
  constructor: Range,
  includes: function (x) { return this.from <= x && x <= this.to },
  foreach: function (f) { for (var x = Math.ceil(this.from); x <= this.to; x++) f(x) },
  toString: function () { return '(' + this.from + '...' + this.to + ')' }
})

