(function () {
  var root = this;
  function seqit () {
    var reversed = false, config = {}, args = [].slice.call(arguments), stepSize = 1, obj;
    if (args.length > 1 && typeof args[args.length - 1] === 'object' && !Array.isArray(args[args.length - 1])) {
      config = args[args.length - 1];
      args.splice(args.length - 1, 1);
      if (typeof config.reversed === 'boolean') {
        reversed = config.reversed;
      }
      if (typeof config.step === 'number') {
        stepSize = config.step;
      }
      if (typeof config.obj === 'object' && !Array.isArray(config.obj)) {
        obj = config.obj;
      }
    }
    switch (typeof args[0]) {
      case 'string':
        return seqit([].slice.call(args[0]), config);
        break;
      case 'number':
        var begin = 0, end = args[0], step = 1;
        if (args.length > 1) {
          if (typeof args[1] !== 'number') throw TypeError('Ending range value must be a number.');
          end = args[1];
          begin = args[0];
        }
        if (args.length > 2) {
          if (typeof args[2] !== 'number') throw TypeError('Step size must be a number.');
          step = args[2];
        }
        return seqit(range(begin, end, step), config);
        break;
      case 'object':
        if (Array.isArray(args[0])) {
          return (function (arr) {
            var step = stepSize;
            var index = (reversed ? (arr.length - 1) : 0);
            var factory = Propertizer(Iterator);
            factory
              .prop('size')
                .get(function () { return arr.length; })
                .set(function (v) { arr.length = v; })
              .prop('end')
                .get(function () {
                  if (reversed ? index < 0 : index >= arr.length) return Iterator;
                  else return function (val) {
                    if (typeof val === 'undefined') return arr[reversed ? 0: (arr.length - 1)];
                    if (!obj) arr[reversed ? 0 : (arr.length - 1)] = val;
                    else arr[reversed ? 0 : (arr.length - 1)].value = val;
                    return val;
                  }
                })
                .set(function (v) {
                  if (!obj) arr[reversed ? 0 : (arr.length - 1)] = v;
                  else arr[reversed ? 0 : (arr.length - 1)].value = v;
                })
              .prop('reversed')
                .get(function () { return reversed; })
                .set(function (v) {
                  if (typeof v !== 'boolean') throw TypeError('Must be a boolean.');
                  reversed = v;
                })
              .prop('begin')
                .get(function () {
                  if (reversed ? index === (arr.length - 1) : !index) return Iterator;
                  return function (val) {
                    if (typeof val === 'undefined') return arr[reversed ? (arr.length - 1) : 0];
                    if (!obj) arr[reversed ? (arr.length - 1) : 0] = val;
                    else arr[reversed ? (arr.length - 1) : 0].value = val;
                    return val;
                  }
                })
                .set(function (v) {
                  if (!obj) arr[reversed ? (arr.length - 1) : 0] = v;
                  else arr[reversed ? (arr.length - 1) : 0].value = val;
                })
              .prop('step')
                .get(function () {
                  if (reversed) index -= step;
                  else index += step;
                  return function (v) {
                    if (reversed) {
                      index += step;
                      index -= v;
                    } else {
                      index -= step;
                      index += v;
                    }
                    return index;
                  }
                })
                .set(function (v) {
                  if (typeof v !== 'number') throw TypeError('Step size must be a number.');
                  step = v;
                })
              .prop('back')
                .get(function () {
                  if (reversed) index += step;
                  else index -= step;
                  return function (v) {
                    if (typeof v === 'number') {
                      if (reversed) {
                        index -= step;
                        index += v;
                      } else {
                        index += step;
                        index -= v;
                      }
                    }
                    return index;
                  }
                })
              .prop('index')
                .get(function () {
                  return index;
                })
                .set(function (v) {
                  if (typeof v !== 'number' || v % 1 !== 0) throw TypeError('Index must be an integer.');
                  index = v;
                })
              .prop('prev')
                .get(function () {
                  if (reversed && index < 0) index = 0; 
                  if (!reversed && index >= arr.length) index = arr.length - 1;
                  var tmp = this();
                  this.back;
                  return tmp;
                })
              .prop('next')
                .get(function () {
                  if (reversed && index >= arr.length) index = arr.length - 1;
                  if (!reversed && index < 0) index = 0;
                  var tmp = this();
                  this.step;
                  return tmp;
                })
              .prop('hasNext')
                .get(function () {
                  return (reversed ? index >= 0 : index < arr.length);
                })
              .prop('hasPrev')
                .get(function () {
                  return (reversed ? index < arr.length : index >= 0);
                })
              .prop('reset')
                .get(reset)
                .set(reset)
              .prop('current')
                .get(function () { return this(); })
                .set(function (v) { return this(v); })
            .apply();
            return Iterator;
            function reset () { index = 0; step = 1; return 0; }
            function Iterator(v) {
              if (index < 0 || index >= arr.length) throw RangeError('Out of range.');
              if (typeof v === 'undefined') {
                return arr[index];
              } else {
                if (obj) {
                  arr[index].value = v;
                } else {
                  arr[index] = v;
                }
              }
            }
          })(args[0]);
        } else {
          return (function (obj) {
            return seqit(Object.getOwnPropertyNames(obj).map(function (v) {
              return Accessor(obj, v);
            }), config);
          })(args[0]);
        }
        break;
      default:
        throw TypeError('Cannot iterate over a ' + typeof args[0] + '.');
    }
  }
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined') {
      exports = module.exports = seqit;
    }
  } else {
    root.seqit = seqit;
  }
  function ellipses(value, length) {
    if (!length) length = 20;
    var ser = JSON.stringify(value);
    if (typeof value === 'string') {
      ser = "'" + ser.substr(1, ser.length - 2).replace(/\\"/g) + "'";
    }
    if (ser.length > length) {
      ser = ser.substr(0, length - 5) + '...';
      switch (typeof value) {
        case 'object':
          if (Array.isArray(value)) ser += ']';
          else ser += '}';
          break;
        case 'string':
          ser += "'";
          break;
      }
    }
    return ser;
  }
  Accessor.prototype.inspect = function () {
    return "{[Accessor] key: " + ellipses(this.key) + ", value: " +  ellipses(this.value) + " }";
  }
  function Accessor(obj, key) {
    if (!(this instanceof Accessor)) return new Accessor(obj, key);
    var k = key;
    Propertizer(this)
      .prop('key')
        .set(function (v) {
          if (v !== key) {
            var tmp = obj[key];
            delete obj[key];
            obj[v] = tmp;
            k = v;
          }
        })
        .get(function () {
          return k;
        })
      .prop('value')
        .set(function (v) {
          if (v !== obj[k]) {
            obj[k] = v;
          }
        })
        .get(function () {
          return obj[k];
        })
    .apply();
  }
  function Propertizer(obj) {
    if (!(this instanceof Propertizer)) return new Propertizer(obj);
    this.obj = obj;
    this.props = {};
  }
  Propertizer.prototype = {
    prop: function (v) {
      this.props[v] = {};
      this.current = v;
      return this;
    },
    set: function (v) {
      this.props[this.current].set = v;
      return this;
    },
    get: function (v) {
      this.props[this.current].get = v;
      return this;
    },
    apply: function () {
      Object.getOwnPropertyNames(this.props).forEach(function (v) {
        Object.defineProperty(this.obj, v, {
          get: this.props[v].get,
          set: this.props[v].set
        });
      }, this);
      return this;
    }
  };
  function range(start, end, step) {
    var ret = [];
    for (var i = start; i < end; i += step) {
      ret.push(i);
    }
    return ret;
  }
}).call(this);
