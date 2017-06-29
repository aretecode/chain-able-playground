(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ms')) :
	typeof define === 'function' && define.amd ? define(['ms'], factory) :
	(global.fliplog = factory(global.ms));
}(this, (function (ms) {

ms = ms && 'default' in ms ? ms['default'] : ms;

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var arguments$1 = arguments;

    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments$1[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser$2 = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}
function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser$2,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var debug = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug[
  'default'
] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0,
    i;

  for (i in namespace) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length]
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {
  function debug() {
    var arguments$1 = arguments;

    // disabled?
    if (!debug.enabled) { return }

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms$$1 = curr - (prevTime || curr);
    self.diff = ms$$1;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments$1[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') { return match }
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) { continue } // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true
    }
  }
  return false
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) { return val.stack || val.message }
  return val
}
});

var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome &&
  'undefined' != typeof chrome.storage
  ? chrome.storage.local
  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson' ];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (
    typeof window !== 'undefined' &&
    window.process &&
    window.process.type === 'renderer'
  ) {
    return true
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (
    (typeof document !== 'undefined' &&
      document.documentElement &&
      document.documentElement.style &&
      document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' &&
      window.console &&
      (window.console.firebug ||
        (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' &&
      navigator.userAgent &&
      navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
      parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' &&
      navigator.userAgent &&
      navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
  )
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v)
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message
  }
};

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] =
    (useColors ? '%c' : '') +
    this.namespace +
    (useColors ? ' %c' : ' ') +
    args[0] +
    (useColors ? '%c ' : ' ') +
    '+' +
    exports.humanize(this.diff);

  if (!useColors) { return }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) { return }
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (
    'object' === typeof console &&
    console.log &&
    Function.prototype.apply.call(console.log, console, arguments)
  )
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch (e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage
  } catch (e) {}
}
});

var index = browser;

/**
 * @tutorial http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 * @tutorial https://github.com/sindresorhus/camelcase
 * @param  {string} str
 * @return {string}
 *
 * s.charAt(0).toLowerCase() + string.slice(1)
 */
function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) { return '' } // or if (/\s+/.test(match)) for white spaces

      // needs to be a loose 0 or first char will be uc if first char is -
      // eslint-disable-next-line
      return index == 0 ? match.toLowerCase() : match.toUpperCase()
    })
    .replace(/[-_]/g, '')
}

/**
 * @desc this duplicates keys, is simplest fastest
 * @NOTE mutates obj
 * @param  {Object} obj
 * @return {Object}
 */
function camelCaseKeys(obj) {
  var keys = Object.keys(obj);
  var camelKeys = keys.map(camelCase);
  for (var i = 0; i < keys.length; i++) {
    var camel = camelKeys[i];
    // console.log({camel, camelKeys, i, keys, c: camelKeys[i], k: keys[i]})
    if (camel.length === 0) { continue }
    obj[camel] = obj[keys[i]];
  }
  return obj
}

camelCase.keys = camelCaseKeys;
camelCase.str = camelCase;
var index$6 = camelCase;

// if dependency is already installed, use it, otherwise, fallback to inlined
var index$4 = function requireFromDepIfPossible(name) {
  var type = typeof name;

  // allow returning an obj
  if (type !== 'string' && Array.isArray(name)) {
    var obj = {};
    name.forEach(function (n) {
      obj[index$6(n)] = requireFromDepIfPossible(n);
    });
    return obj
  }
  else if (type !== 'string' && type === 'object') {
    var obj$1 = {};
    Object.keys(name).forEach(function (n) {
      obj$1[index$6(n)] = requireFromDepIfPossible(n);
    });
    return obj$1
  }

  try {
    commonjsRequire.resolve(name);
    var required = commonjsRequire(name);
    if (required) { return required }
    else { throw Error('not required') }
  }
  catch (e) {
    try {
      var dep = commonjsRequire('./' + name);
      return dep
    }
    catch (noModule) {
      return false
    }
  }
};

var ESCAPED_CHARACTERS = /(\\|\"|\')/g;

var printString = function printString(val) {
  return val.replace(ESCAPED_CHARACTERS, '\\$1')
};

var keyword = index$4('esutils').keyword;
var style = index$4('ansi-styles');


var toString = Object.prototype.toString;
var toISOString = Date.prototype.toISOString;
var errorToString = Error.prototype.toString;
var regExpToString = RegExp.prototype.toString;
var symbolToString = Symbol.prototype.toString;

var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
var NEWLINE_REGEXP = /\n/gi;

var getSymbols = Object.getOwnPropertySymbols || (function (obj) { return []; });

function isToStringedArrayType(toStringed) {
  return (
    toStringed === '[object Array]' ||
    toStringed === '[object ArrayBuffer]' ||
    toStringed === '[object DataView]' ||
    toStringed === '[object Float32Array]' ||
    toStringed === '[object Float64Array]' ||
    toStringed === '[object Int8Array]' ||
    toStringed === '[object Int16Array]' ||
    toStringed === '[object Int32Array]' ||
    toStringed === '[object Uint8Array]' ||
    toStringed === '[object Uint8ClampedArray]' ||
    toStringed === '[object Uint16Array]' ||
    toStringed === '[object Uint32Array]'
  )
}

function printNumber(val) {
  if (val != +val) { return 'NaN' }
  var isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? '-0' : '' + val
}

function printFunction(val, printFunctionName) {
  if (!printFunctionName) {
    return '[Function]'
  }
  else if (val.name === '') {
    return '[Function anonymous]'
  }
  else {
    return '[Function ' + val.name + ']'
  }
}

function printSymbol(val) {
  return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)')
}

function printError(val) {
  return '[' + errorToString.call(val) + ']'
}

function printBasicValue(val, printFunctionName, escapeRegex, colors) {
  if (val === true || val === false)
    { return colors.boolean.open + val + colors.boolean.close }
  if (val === undefined)
    { return colors.misc.open + 'undefined' + colors.misc.close }
  if (val === null) { return colors.misc.open + 'null' + colors.misc.close }

  var typeOf = typeof val;

  if (typeOf === 'number')
    { return colors.number.open + printNumber(val) + colors.number.close }
  if (typeOf === 'string')
    { return (
      colors.string.open + '"' + printString(val) + '"' + colors.string.close
    ) }
  if (typeOf === 'function')
    { return (
      colors.function.open +
      printFunction(val, printFunctionName) +
      colors.function.close
    ) }
  if (typeOf === 'symbol')
    { return colors.symbol.open + printSymbol(val) + colors.symbol.close }

  var toStringed = toString.call(val);

  if (toStringed === '[object WeakMap]')
    { return (
      colors.label.open +
      'WeakMap ' +
      colors.label.close +
      colors.bracket.open +
      '{}' +
      colors.bracket.close
    ) }
  if (toStringed === '[object WeakSet]')
    { return (
      colors.label.open +
      'WeakSet ' +
      colors.label.close +
      colors.bracket.open +
      '{}' +
      colors.bracket.close
    ) }
  if (
    toStringed === '[object Function]' ||
    toStringed === '[object GeneratorFunction]'
  )
    { return (
      colors.function.open +
      printFunction(val, printFunctionName) +
      colors.function.close
    ) }
  if (toStringed === '[object Symbol]')
    { return colors.symbol.open + printSymbol(val) + colors.symbol.close }
  if (toStringed === '[object Date]')
    { return colors.date.open + toISOString.call(val) + colors.date.close }
  if (toStringed === '[object Error]')
    { return colors.error.open + printError(val) + colors.error.close }
  if (toStringed === '[object RegExp]') {
    if (escapeRegex) {
      return (
        colors.regex.open +
        printString(regExpToString.call(val)) +
        colors.regex.close
      )
    }
    return colors.regex.open + regExpToString.call(val) + colors.regex.close
  }
  if (toStringed === '[object Arguments]' && val.length === 0)
    { return (
      colors.label.open +
      'Arguments ' +
      colors.label.close +
      colors.bracket.open +
      '[]' +
      colors.bracket.close
    ) }
  if (isToStringedArrayType(toStringed) && val.length === 0)
    { return (
      val.constructor.name + colors.bracket.open + ' []' + colors.bracket.close
    ) }

  if (val instanceof Error)
    { return colors.error.open + printError(val) + colors.error.close }

  return false
}

function printList(
  list,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  var body = '';

  if (list.length) {
    body += edgeSpacing;

    var innerIndent = prevIndent + indent;

    for (var i = 0; i < list.length; i++) {
      body +=
        innerIndent +
        print(
          list[i],
          indent,
          innerIndent,
          spacing,
          edgeSpacing,
          refs,
          maxDepth,
          currentDepth,
          plugins,
          min,
          callToJSON,
          printFunctionName,
          escapeRegex,
          colors
        );

      if (i < list.length - 1) {
        body += colors.comma.open + ',' + colors.comma.close + spacing;
      }
    }

    body +=
      (min ? '' : colors.comma.open + ',' + colors.comma.close) +
      edgeSpacing +
      prevIndent;
  }

  return (
    colors.bracket.open +
    '[' +
    colors.bracket.close +
    body +
    colors.bracket.open +
    ']' +
    colors.bracket.close
  )
}

function printArguments(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  return (
    colors.label.open +
    (min ? '' : 'Arguments ') +
    colors.label.close +
    printList(
      val,
      indent,
      prevIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors
    )
  )
}

function printArray(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  return (
    colors.label.open +
    (min ? '' : val.constructor.name + ' ') +
    colors.label.close +
    printList(
      val,
      indent,
      prevIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors
    )
  )
}

function printKey(
  key,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  var typeOf = typeof key;
  if (typeOf === 'string') {
    if (keyword.isIdentifierNameES6(key, true))
      { return colors.key.open + key + colors.key.close }
    if (/^\d+$/.test(key)) { return colors.key.open + key + colors.key.close }
    return colors.key.open + '"' + printString(key) + '"' + colors.key.close
  }
  if (typeOf === 'symbol')
    { return colors.key.open + printSymbol(key) + colors.key.close }

  return print(
    key,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors
  )
}

function printMap(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  var result =
    colors.label.open +
    'Map ' +
    colors.label.close +
    colors.bracket.open +
    '{' +
    colors.bracket.close;
  var iterator = val.entries();
  var current = iterator.next();

  if (!current.done) {
    result += edgeSpacing;

    var innerIndent = prevIndent + indent;

    while (!current.done) {
      var key = printKey(
        current.value[0],
        indent,
        innerIndent,
        spacing,
        edgeSpacing,
        refs,
        maxDepth,
        currentDepth,
        plugins,
        min,
        callToJSON,
        printFunctionName,
        escapeRegex,
        colors
      );
      var value = print(
        current.value[1],
        indent,
        innerIndent,
        spacing,
        edgeSpacing,
        refs,
        maxDepth,
        currentDepth,
        plugins,
        min,
        callToJSON,
        printFunctionName,
        escapeRegex,
        colors
      );

      result += innerIndent + key + ' => ' + value;

      current = iterator.next();

      if (!current.done) {
        result += colors.comma.open + ',' + colors.comma.close + spacing;
      }
    }

    result +=
      (min ? '' : colors.comma.open + ',' + colors.comma.close) +
      edgeSpacing +
      prevIndent;
  }

  return result + colors.bracket.open + '}' + colors.bracket.close
}

function printObject(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  var constructor = min ?
    '' :
    val.constructor ? val.constructor.name + ' ' : 'Object ';
  var result =
    colors.label.open +
    constructor +
    colors.label.close +
    colors.bracket.open +
    '{' +
    colors.bracket.close;
  var keys = Object.keys(val).sort();
  var symbols = getSymbols(val);

  if (symbols.length) {
    keys = keys
      .filter(
        function (key) { return !(typeof key === 'symbol' || toString.call(key) === '[object Symbol]'); }
      )
      .concat(symbols);
  }

  if (keys.length) {
    result += edgeSpacing;

    var innerIndent = prevIndent + indent;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var name = printKey(
        key,
        indent,
        innerIndent,
        spacing,
        edgeSpacing,
        refs,
        maxDepth,
        currentDepth,
        plugins,
        min,
        callToJSON,
        printFunctionName,
        escapeRegex,
        colors
      );
      var value = print(
        val[key],
        indent,
        innerIndent,
        spacing,
        edgeSpacing,
        refs,
        maxDepth,
        currentDepth,
        plugins,
        min,
        callToJSON,
        printFunctionName,
        escapeRegex,
        colors
      );

      result += innerIndent + name + ': ' + value;

      if (i < keys.length - 1) {
        result += colors.comma.open + ',' + colors.comma.close + spacing;
      }
    }

    result +=
      (min ? '' : colors.comma.open + ',' + colors.comma.close) +
      edgeSpacing +
      prevIndent;
  }

  return result + colors.bracket.open + '}' + colors.bracket.close
}

function printSet(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  var result =
    colors.label.open +
    'Set ' +
    colors.label.close +
    colors.bracket.open +
    '{' +
    colors.bracket.close;
  var iterator = val.entries();
  var current = iterator.next();

  if (!current.done) {
    result += edgeSpacing;

    var innerIndent = prevIndent + indent;

    while (!current.done) {
      result +=
        innerIndent +
        print(
          current.value[1],
          indent,
          innerIndent,
          spacing,
          edgeSpacing,
          refs,
          maxDepth,
          currentDepth,
          plugins,
          min,
          callToJSON,
          printFunctionName,
          escapeRegex,
          colors
        );

      current = iterator.next();

      if (!current.done) {
        result += colors.comma.open + ',' + colors.comma.close + spacing;
      }
    }

    result +=
      (min ? '' : colors.comma.open + ',' + colors.comma.close) +
      edgeSpacing +
      prevIndent;
  }

  return result + colors.bracket.open + '}' + colors.bracket.close
}

function printComplexValue(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  refs = refs.slice();
  if (refs.indexOf(val) > -1) {
    return '[Circular]'
  }
  else {
    refs.push(val);
  }

  currentDepth++;

  var hitMaxDepth = currentDepth > maxDepth;

  if (
    callToJSON &&
    !hitMaxDepth &&
    val.toJSON &&
    typeof val.toJSON === 'function'
  ) {
    return print(
      val.toJSON(),
      indent,
      prevIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors
    )
  }

  var toStringed = toString.call(val);
  if (toStringed === '[object Arguments]') {
    return hitMaxDepth ?
      '[Arguments]' :
      printArguments(
          val,
          indent,
          prevIndent,
          spacing,
          edgeSpacing,
          refs,
          maxDepth,
          currentDepth,
          plugins,
          min,
          callToJSON,
          printFunctionName,
          escapeRegex,
          colors
        )
  }
  else if (isToStringedArrayType(toStringed)) {
    return hitMaxDepth ?
      '[Array]' :
      printArray(
          val,
          indent,
          prevIndent,
          spacing,
          edgeSpacing,
          refs,
          maxDepth,
          currentDepth,
          plugins,
          min,
          callToJSON,
          printFunctionName,
          escapeRegex,
          colors
        )
  }
  else if (toStringed === '[object Map]') {
    return hitMaxDepth ?
      '[Map]' :
      printMap(
          val,
          indent,
          prevIndent,
          spacing,
          edgeSpacing,
          refs,
          maxDepth,
          currentDepth,
          plugins,
          min,
          callToJSON,
          printFunctionName,
          escapeRegex,
          colors
        )
  }
  else if (toStringed === '[object Set]') {
    return hitMaxDepth ?
      '[Set]' :
      printSet(
          val,
          indent,
          prevIndent,
          spacing,
          edgeSpacing,
          refs,
          maxDepth,
          currentDepth,
          plugins,
          min,
          callToJSON,
          printFunctionName,
          escapeRegex,
          colors
        )
  }
  else if (typeof val === 'object') {
    return hitMaxDepth ?
      '[Object]' :
      printObject(
          val,
          indent,
          prevIndent,
          spacing,
          edgeSpacing,
          refs,
          maxDepth,
          currentDepth,
          plugins,
          min,
          callToJSON,
          printFunctionName,
          escapeRegex,
          colors
        )
  }
}

function printPlugin(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  var match = false;
  var plugin;

  for (var p = 0; p < plugins.length; p++) {
    plugin = plugins[p];

    if (plugin.test(val)) {
      match = true;
      break
    }
  }

  if (!match) {
    return false
  }

  function boundPrint(val) {
    return print(
      val,
      indent,
      prevIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors
    )
  }

  function boundIndent(str) {
    var indentation = prevIndent + indent;
    return indentation + str.replace(NEWLINE_REGEXP, '\n' + indentation)
  }

  var opts = {
    edgeSpacing: edgeSpacing,
    spacing: spacing,
  };
  return plugin.print(val, boundPrint, boundIndent, opts, colors)
}

function print(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors
) {
  var basic = printBasicValue(val, printFunctionName, escapeRegex, colors);
  if (basic) { return basic }

  var plugin = printPlugin(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors
  );
  if (plugin) { return plugin }

  return printComplexValue(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors
  )
}

var DEFAULTS = {
  callToJSON: true,
  indent: 2,
  maxDepth: Infinity,
  min: false,
  plugins: [],
  printFunctionName: true,
  escapeRegex: false,
  highlight: false,
  theme: {
    tag: 'cyan',
    content: 'reset',
    prop: 'yellow',
    value: 'green',
    number: 'yellow',
    string: 'red',
    date: 'red',
    symbol: 'red',
    regex: 'red',
    function: 'blue',
    error: 'red',
    boolean: 'yellow',
    label: 'blue',
    bracket: 'grey',
    comma: 'grey',
    misc: 'grey',
    key: 'reset',
  },
};

function validateOptions(opts) {
  Object.keys(opts).forEach(function (key) {
    if (!DEFAULTS.hasOwnProperty(key)) {
      throw new Error('prettyFormat: Invalid option: ' + key)
    }
  });

  if (opts.min && opts.indent !== undefined && opts.indent !== 0) {
    throw new Error('prettyFormat: Cannot run with min option and indent')
  }
}

function normalizeOptions(opts) {
  var result = {};

  Object.keys(DEFAULTS).forEach(
    function (key) { return (result[key] = opts.hasOwnProperty(key) ? opts[key] : DEFAULTS[key]); }
  );

  if (result.min) {
    result.indent = 0;
  }

  return result
}

function createIndent(indent) {
  return new Array(indent + 1).join(' ')
}

function prettyFormat(val, opts) {
  if (!opts) {
    opts = DEFAULTS;
  }
  else {
    validateOptions(opts);
    opts = normalizeOptions(opts);
  }

  var colors = {};
  Object.keys(opts.theme).forEach(function (key) {
    if (opts.highlight) {
      colors[key] = style[opts.theme[key]];
    }
    else {
      colors[key] = {open: '', close: ''};
    }
  });

  var indent;
  var refs;
  var prevIndent = '';
  var currentDepth = 0;
  var spacing = opts.min ? ' ' : '\n';
  var edgeSpacing = opts.min ? '' : '\n';

  if (opts && opts.plugins.length) {
    indent = createIndent(opts.indent);
    refs = [];
    var pluginsResult = printPlugin(
      val,
      indent,
      prevIndent,
      spacing,
      edgeSpacing,
      refs,
      opts.maxDepth,
      currentDepth,
      opts.plugins,
      opts.min,
      opts.callToJSON,
      opts.printFunctionName,
      opts.escapeRegex,
      colors
    );
    if (pluginsResult) { return pluginsResult }
  }

  var basicResult = printBasicValue(
    val,
    opts.printFunctionName,
    opts.escapeRegex,
    colors
  );
  if (basicResult) { return basicResult }

  if (!indent) { indent = createIndent(opts.indent); }
  if (!refs) { refs = []; }
  return printComplexValue(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    opts.maxDepth,
    currentDepth,
    opts.plugins,
    opts.min,
    opts.callToJSON,
    opts.printFunctionName,
    opts.escapeRegex,
    colors
  )
}

var index$2 = prettyFormat;

// https://www.npmjs.com/package/kind-of
var toString$1 = Object.prototype.toString;

/**
 * @desc Get the native `typeof` a value.
 * @param  {any} val
 * @return {string} Native javascript type
 */
var index$8 = function kindOf(val) {
  var vtypeof = typeof val;

  // primitivies
  if (vtypeof === 'undefined') {
    return 'undefined'
  }
  if (val === null) {
    return 'null'
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean'
  }
  if (vtypeof === 'string' || val instanceof String) {
    return 'string'
  }
  if (vtypeof === 'number' || val instanceof Number) {
    return 'number'
  }
  // functions
  if (vtypeof === 'function' || val instanceof Function) {
    return 'function'
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array'
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp'
  }
  if (val instanceof Date) {
    return 'date'
  }

  if (val instanceof Set) {
    return 'set'
  }
  if (val instanceof Map) {
    return 'map'
  }

  // other objects
  var type = toString$1.call(val);

  if (type === '[object RegExp]') {
    return 'regexp'
  }
  if (type === '[object Date]') {
    return 'date'
  }
  if (type === '[object Arguments]') {
    return 'arguments'
  }
  if (type === '[object Error]') {
    return 'error'
  }
  if (type === '[object Promise]') {
    return 'promise'
  }

  // buffer
  if (
    val != null &&
    !!val.constructor &&
    typeof val.constructor.isBuffer === 'function' &&
    val.constructor.isBuffer(val)
  ) {
    return 'buffer'
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object WeakSet]') {
    return 'weakset'
  }
  if (type === '[object WeakMap]') {
    return 'weakmap'
  }
  if (type === '[object Symbol]') {
    return 'symbol'
  }

  // typed arrays
  if (type.includes('Array') === true) {
    return type
      .replace('[', '')
      .replace(']', '')
      .replace('object ', '')
      .toLowerCase()
  }

  // must be a plain object
  return 'object'
};

var chalk = index$4('chalk');
var lpadAlign = index$4('lpad-align');
var longest = index$4('longest');

function clean(s) {
  return s.replace(/\n\r?\s*/g, '')
}

// should not be using arguments
function tsml(sa) {
  var arguments$1 = arguments;

  var s = '';
  var i = 0;

  for (; i < arguments.length; i++)
    { s += clean(sa[i]) + (arguments$1[i + 1] || ''); }

  return s
}

var isPlainObj = function (o) { return o !== null && typeof o === 'object' && o.constructor === Object; };

var isLiteral = function (val) { return typeof val === 'boolean' || val === null || val === undefined; };

var annotate = function (formatter, keyword, val) { return tsml `
  ${formatter.annotation(`[${keyword} `)}
  ${formatter.string(val)}
  ${formatter.annotation(']')}
`; };

var formatFunction = function (formatter, functionType, fn) { return annotate(formatter, functionType, fn.displayName || fn.name || 'anonymous'); };

var formatRef = function (formatter, path) { return annotate(formatter, 'References', '~' + path.join('.')); };

var formatCollapsedObject = function (formatter) { return tsml `
  ${formatter.punctuation('(')}
  ${formatter.string('collapsed')}
  ${formatter.punctuation(')')}
`; };

var formatValue = function (formatter, val) {
  if (typeof val === 'number') {
    return formatter.number(val)
  }

  if (isLiteral(val)) {
    return formatter.literal(String(val))
  }

  var stringified = Object.prototype.toString.call(val);

  if (stringified === '[object Function]') {
    return formatFunction(formatter, 'Function', val)
  }

  if (stringified === '[object GeneratorFunction]') {
    return formatFunction(formatter, 'GeneratorFunction', val)
  }

  return tsml `
    ${formatter.punctuation('"')}
    ${formatter.string(val)}
    ${formatter.punctuation('"')}
  `
};

var isIterableWithKeys = function (val) { return isPlainObj(val) || Array.isArray(val); };

var createRefMap = function () {
  var map = new Map();

  return function (path, val, replacer) {
    if (!val || typeof val !== 'object') {
      return null
    }

    var ref = map.get(val);
    if (ref) { return replacer(ref) }
    map.set(val, path);
    return null
  }
};

var formatWithDepth = function (obj, formatter, ref) {
  var lookupRef = ref.lookupRef;
  var path = ref.path;
  var depth = ref.depth;
  var offset = ref.offset;

  var keys = Object.keys(obj);
  var coloredKeys = keys.map(function (key) { return formatter.property(key); });
  var colon = ': ';

  var parts = keys.map(function (key, i) {
    var nextPath = path.concat([key]);
    var val = obj[key];

    var ref = lookupRef(nextPath, val, function (npath) { return formatRef(formatter, npath); });

    var out = tsml `
      ${lpadAlign(coloredKeys[i], coloredKeys, offset)}
      ${formatter.punctuation(colon)}
    `;

    if (depth.curr > depth.max) {
      return out + formatCollapsedObject(formatter)
    }

    if (ref) {
      return out + ref
    }

    if (isIterableWithKeys(val)) {
      return (
        out +
        formatWithDepth(val, formatter, {
          offset: offset + longest(keys).length + colon.length,
          depth: {curr: depth.curr + 1, max: depth.max},
          path: nextPath,
          lookupRef: lookupRef,
        })
      )
    }
    else {
      return out + formatValue(formatter, val)
    }
  });

  return '\n' + parts.join('\n')
};

var identityFormatter = [
  'punctuation',
  'annotation',
  'property',
  'literal',
  'number',
  'string' ].reduce(function (acc, prop) { return Object.assign({}, acc, ( obj = {}, obj[prop] = function (x) { return x; }, obj ))
  var obj; }, {});

var createFormatter = function (opts) {
  if ( opts === void 0 ) opts = {};

  var offset = opts.offset || 2;
  var formatter = Object.assign({}, identityFormatter, opts.formatter);

  return function (obj, depth) {
    if ( depth === void 0 ) depth = Infinity;

    return formatWithDepth(obj, formatter, {
      depth: {curr: 0, max: depth},
      lookupRef: createRefMap(),
      path: [],
      offset: offset,
    })
  }
};

var format = createFormatter({
  formatter: {
    punctuation: chalk.yellow,
    annotation: chalk.gray,
    property: chalk.green,
    literal: chalk.magenta,
    number: chalk.cyan,
    string: chalk.bold,
  },
});

var index$10 = format;
var createFormatter_1 = createFormatter;

index$10.createFormatter = createFormatter_1;

var index$12 = createCommonjsModule(function (module, exports) {
/**
 * https://github.com/lodash/lodash/blob/4.17.4/lodash.js#L11101
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  objectTag = '[object Object]',
  promiseTag = '[object Promise]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]',
  weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[
  arrayBufferTag
] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[
  dateTag
] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[
  int8Tag
] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[
  mapTag
] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[
  regexpTag
] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[
  symbolTag
] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[
  uint16Tag
] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[
  weakMapTag
] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal =
  typeof commonjsGlobal === 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf =
  typeof self === 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =
  'object' === 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule =
  freeExports &&
  'object' === 'object' &&
  module &&
  !module.nodeType &&
  module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1, length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break
    }
  }
  return array
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1, length = values.length, offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1, length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key]
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString !== 'function') {
    try {
      result = !!(value + '');
    }
    catch (e) {}
  }
  return result
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1, result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg))
  }
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1, result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
  funcProto = Function.prototype,
  objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = (/[^.]+$/).exec(
    (coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || ''
  );
  return uid ? 'Symbol(src)_1.' + uid : ''
})();

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp(
  '^' +
    funcToString
      .call(hasOwnProperty)
      .replace(reRegExpChar, '\\$&')
      .replace(
        /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
        '$1.*?'
      ) +
    '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
  Symbol = root.Symbol,
  Uint8Array = root.Uint8Array,
  getPrototype = overArg(Object.getPrototypeOf, Object),
  objectCreate = Object.create,
  propertyIsEnumerable = objectProto.propertyIsEnumerable,
  splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
  nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
  nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
  Map = getNative(root, 'Map'),
  Promise = getNative(root, 'Promise'),
  Set = getNative(root, 'Set'),
  WeakMap = getNative(root, 'WeakMap'),
  nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
  mapCtorString = toSource(Map),
  promiseCtorString = toSource(Promise),
  setCtorString = toSource(Set),
  weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
  symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var this$1 = this;

  var index = -1, length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this$1.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key]
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key)
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype.delete = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var this$1 = this;

  var index = -1, length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this$1.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf(data, key);

  if (index < 0) {
    return false
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  }
  else {
    splice.call(data, index, 1);
  }
  return true
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1]
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  }
  else {
    data[index][1] = value;
  }
  return this
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype.delete = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var this$1 = this;

  var index = -1, length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this$1.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    hash: new Hash(),
    map: new (Map || ListCache)(),
    string: new Hash(),
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key).delete(key)
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key)
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key)
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype.delete = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__.delete(key)
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key)
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key)
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  // console.log({cache})
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      return this
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype.delete = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = isArray(value) || isArguments(value) ?
    baseTimes(value.length, String) :
    [];

  var length = result.length, skipIndexes = !!length;

  for (var key in value) {
    if (
      (inherited || hasOwnProperty.call(value, key)) &&
      !(skipIndexes && (key == 'length' || isIndex(key, length)))
    ) {
      result.push(key);
    }
  }
  return result
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (
    !(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
    (value === undefined && !(key in object))
  ) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length
    }
  }
  return -1
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object)
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result
  }
  if (!isObject(value)) {
    return value
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result)
    }
  }
  else {
    var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep)
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {}
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value))
      }
    }
    else {
      if (!cloneableTags[tag]) {
        return object ? value : {}
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(
      result,
      key,
      baseClone(subValue, isDeep, isFull, customizer, key, value, stack)
    );
  });
  return result
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {}
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object))
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value)
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false
  }
  var pattern = isFunction(value) || isHostObject(value) ?
    reIsNative :
    reIsHostCtor;
  return pattern.test(toSource(value))
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object)
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice()
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(
    buffer,
    dataView.byteOffset,
    dataView.byteLength
  )
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor())
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor())
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {}
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(
    buffer,
    typedArray.byteOffset,
    typedArray.length
  )
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1, length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1, length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer ?
      customizer(object[key], source[key], key, object, source) :
      undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object)
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols)
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ?
    data[typeof key === 'string' ? 'string' : 'hash'] :
    data.map
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ?
  overArg(nativeGetSymbols, Object) :
  stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if (
  (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
  (Map && getTag(new Map()) != mapTag) ||
  (Promise && getTag(Promise.resolve()) != promiseTag) ||
  (Set && getTag(new Set()) != setTag) ||
  (WeakMap && getTag(new WeakMap()) != weakMapTag)
) {
  getTag = function(value) {
    var result = objectToString.call(value),
      Ctor = result == objectTag ? value.constructor : undefined,
      ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag
        case mapCtorString:
          return mapTag
        case promiseCtorString:
          return promiseTag
        case setCtorString:
          return setTag
        case weakMapCtorString:
          return weakMapTag
      }
    }
    return result
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length, result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (
    length &&
    typeof array[0] === 'string' &&
    hasOwnProperty.call(array, 'index')
  ) {
    result.index = array.index;
    result.input = array.input;
  }
  return result
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return typeof object.constructor === 'function' && !isPrototype(object) ?
    baseCreate(getPrototype(object)) :
    {}
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object)

    case boolTag:
    case dateTag:
      return new Ctor(+object)

    case dataViewTag:
      return cloneDataView(object, isDeep)

    case float32Tag:
    case float64Tag:
    case int8Tag:
    case int16Tag:
    case int32Tag:
    case uint8Tag:
    case uint8ClampedTag:
    case uint16Tag:
    case uint32Tag:
      return cloneTypedArray(object, isDeep)

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc)

    case numberTag:
    case stringTag:
      return new Ctor(object)

    case regexpTag:
      return cloneRegExp(object)

    case setTag:
      return cloneSet(object, isDeep, cloneFunc)

    case symbolTag:
      return cloneSymbol(object)
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return (
    !!length &&
    (typeof value === 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length)
  )
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' ||
    type == 'number' ||
    type == 'symbol' ||
    type == 'boolean' ?
    value !== '__proto__' :
    value === null
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
    proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto;

  return value === proto
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func)
    }
    catch (e) {}
    try {
      return func + ''
    }
    catch (e) {}
  }
  return ''
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true)
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other)
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return (
    isArrayLikeObject(value) &&
    hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') ||
      objectToString.call(value) == argsTag)
  )
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value)
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value)
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return (
    typeof value === 'number' &&
    value > -1 &&
    value % 1 == 0 &&
    value <= MAX_SAFE_INTEGER
  )
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function')
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value === 'object'
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object)
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return []
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false
}

module.exports = cloneDeep;
});

var index$18 = createCommonjsModule(function (module) {
var colorConvert = index$4('color-convert');

var wrapAnsi16 = function (fn, offset) { return function() {
    var code = fn.apply(colorConvert, arguments);
    return `\u001B[${code + offset}m`
  }; };

var wrapAnsi256 = function (fn, offset) { return function() {
    var code = fn.apply(colorConvert, arguments);
    return `\u001B[${38 + offset};5;${code}m`
  }; };

var wrapAnsi16m = function (fn, offset) { return function() {
    var rgb = fn.apply(colorConvert, arguments);
    return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`
  }; };

function assembleStyles() {
  var styles = {
    modifier: {
      reset: [0, 0],
      // 21 isn't widely supported and 22 does the same thing
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29],
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      gray: [90, 39],

      // Bright color
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39],
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],

      // Bright color
      bgBlackBright: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49],
    },
  };

  // Fix humans
  styles.color.grey = styles.color.gray;

  Object.keys(styles).forEach(function (groupName) {
    var group = styles[groupName];

    Object.keys(group).forEach(function (styleName) {
      var style = group[styleName];

      styles[styleName] = {
        open: `\u001B[${style[0]}m`,
        close: `\u001B[${style[1]}m`,
      };

      group[styleName] = styles[styleName];
    });

    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false,
    });
  });

  var rgb2rgb = function (r, g, b) { return [r, g, b]; };

  styles.color.close = '\u001B[39m';
  styles.bgColor.close = '\u001B[49m';

  styles.color.ansi = {};
  styles.color.ansi256 = {};
  styles.color.ansi16m = {
    rgb: wrapAnsi16m(rgb2rgb, 0),
  };

  styles.bgColor.ansi = {};
  styles.bgColor.ansi256 = {};
  styles.bgColor.ansi16m = {
    rgb: wrapAnsi16m(rgb2rgb, 10),
  };

  for (var key of Object.keys(colorConvert)) {
    if (typeof colorConvert[key] !== 'object') {
      continue
    }

    var suite = colorConvert[key];

    if ('ansi16' in suite) {
      styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
      styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
    }

    if ('ansi256' in suite) {
      styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
      styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
    }

    if ('rgb' in suite) {
      styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
      styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
    }
  }

  return styles
}

Object.defineProperty(module, 'exports', {
  enumerable: true,
  get: assembleStyles,
});
});

var supportsColor = true;
// require('./supports-color')

var escapeStringRegexp = function (str) { return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'); };

var defineProps = Object.defineProperties;
var isSimpleWindowsTerm =
  process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

function Chalk(options) {
  // detect mode if not set manually
  this.enabled = !options || options.enabled === undefined
    ? supportsColor
    : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
  index$18.blue.open = '\u001b[94m';
}

var styles = {};

Object.keys(index$18).forEach(function (key) {
  index$18[key].closeRe = new RegExp(
    escapeStringRegexp(index$18[key].close),
    'g'
  );

  styles[key] = {
    get: function get() {
      return build.call(this, this._styles ? this._styles.concat(key) : [key])
    },
  };
});

// eslint-disable-next-line func-names
var proto = defineProps(function () {}, styles);

function build(_styles) {
  var builder = function() {
    return applyStyle.apply(builder, arguments)
  };

  var self = this;

  builder._styles = _styles;

  Object.defineProperty(builder, 'enabled', {
    enumerable: true,
    get: function get() {
      return self.enabled
    },
    set: function set(v) {
      self.enabled = v;
    },
  });

  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  /* eslint-disable no-proto */
  builder.__proto__ = proto;

  return builder
}

function applyStyle() {
  // support varags, but simply cast to string in case there's only one arg
  var args = arguments;
  var argsLen = args.length;
  var str = argsLen !== 0 && String(arguments[0]);

  if (argsLen > 1) {
    // don't slice `arguments`, it prevents v8 optimizations
    for (var a = 1; a < argsLen; a++) {
      str += ' ' + args[a];
    }
  }

  if (!this.enabled || !str) {
    return str
  }

  var nestedStyles = this._styles;
  var i = nestedStyles.length;

  // Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
  // see https://github.com/chalk/chalk/issues/58
  // If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
  var originalDim = index$18.dim.open;
  if (
    isSimpleWindowsTerm &&
    (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)
  ) {
    index$18.dim.open = '';
  }

  while (i--) {
    var code = index$18[nestedStyles[i]];

    // Replace any instances already present with a re-opening code
    // otherwise only the part of the string until said closing code
    // will be colored, and the rest will simply be 'plain'.
    str = code.open + str.replace(code.closeRe, code.open) + code.close;

    // Close the styling before a linebreak and reopen
    // after next line to fix a bleed issue on macOS
    // https://github.com/chalk/chalk/pull/92
    str = str.replace(/\r?\n/g, code.close + '$&' + code.open);
  }

  // Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
  index$18.dim.open = originalDim;

  return str
}

defineProps(Chalk.prototype, styles);

var index$16 = new Chalk();
var styles_1 = index$18;
var supportsColor_1 = supportsColor;

index$16.styles = styles_1;
index$16.supportsColor = supportsColor_1;

var base = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports['default'] = /*istanbul ignore end*/Diff;
function Diff() {}

Diff.prototype = {
  /*istanbul ignore start*/ /*istanbul ignore end*/diff: function diff(oldString, newString) {
    /*istanbul ignore start*/var /*istanbul ignore end*/options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var callback = options.callback;
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    this.options = options;

    var self = this;

    function done(value) {
      if (callback) {
        setTimeout(function () {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    }

    // Allow subclasses to massage the input prior to running
    oldString = this.castInput(oldString);
    newString = this.castInput(newString);

    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));

    var newLen = newString.length,
        oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    var bestPath = [{ newPos: -1, components: [] }];

    // Seed editLength = 0, i.e. the content starts with the same values
    var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      // Identity per the equality and tokenizer
      return done([{ value: this.join(newString), count: newString.length }]);
    }

    // Main worker method. checks all permutations of a given edit length for acceptance.
    function execEditLength() {
      for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        var basePath = /*istanbul ignore start*/void 0;
        var addPath = bestPath[diagonalPath - 1],
            removePath = bestPath[diagonalPath + 1],
            _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        var canAdd = addPath && addPath.newPos + 1 < newLen,
            canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;
        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        }

        // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph
        if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
          basePath = clonePath(removePath);
          self.pushComponent(basePath.components, undefined, true);
        } else {
          basePath = addPath; // No need to clone, we've pulled it from the list
          basePath.newPos++;
          self.pushComponent(basePath.components, true, undefined);
        }

        _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath);

        // If we have hit the end of both strings, then we are done
        if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
          return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
        } else {
          // Otherwise track this path as a potential candidate and continue.
          bestPath[diagonalPath] = basePath;
        }
      }

      editLength++;
    }

    // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced.
    if (callback) {
      (function exec() {
        setTimeout(function () {
          // This should not happen, but we want to be safe.
          /* istanbul ignore next */
          if (editLength > maxEditLength) {
            return callback();
          }

          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength) {
        var ret = execEditLength();
        if (ret) {
          return ret;
        }
      }
    }
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/pushComponent: function pushComponent(components, added, removed) {
    var last = components[components.length - 1];
    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = { count: last.count + 1, added: added, removed: removed };
    } else {
      components.push({ count: 1, added: added, removed: removed });
    }
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath,
        commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.components.push({ count: commonCount });
    }

    basePath.newPos = newPos;
    return oldPos;
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/equals: function equals(left, right) {
    return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/removeEmpty: function removeEmpty(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/castInput: function castInput(value) {
    return value;
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/tokenize: function tokenize(value) {
    return value.split('');
  },
  /*istanbul ignore start*/ /*istanbul ignore end*/join: function join(chars) {
    return chars.join('');
  }
};

function buildValues(diff, components, newString, oldString, useLongestToken) {
  var componentPos = 0,
      componentLen = components.length,
      newPos = 0,
      oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];
    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function (value, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });

        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }
      newPos += component.count;

      // Common case
      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count;

      // Reverse add and remove so removes are output first to match common convention
      // The diffing algorithm is tied to add then remove output and this is the simplest
      // route to get the desired output with minimal overhead.
      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  }

  // Special case handle for when one terminal is ignored. For this case we merge the
  // terminal into the prior string and drop the change.
  var lastComponent = components[componentLen - 1];
  if (componentLen > 1 && (lastComponent.added || lastComponent.removed) && diff.equals('', lastComponent.value)) {
    components[componentLen - 2].value += lastComponent.value;
    components.pop();
  }

  return components;
}

function clonePath(path) {
  return { newPos: path.newPos, components: path.components.slice(0) };
}

});

var character = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.characterDiff = undefined;
exports. /*istanbul ignore end*/diffChars = diffChars;



/*istanbul ignore start*/var _base2 = _interopRequireDefault(base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var characterDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/characterDiff = new /*istanbul ignore start*/_base2['default'] /*istanbul ignore end*/();
function diffChars(oldStr, newStr, options) {
  return characterDiff.diff(oldStr, newStr, options);
}

});

var params = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/generateOptions = generateOptions;
function generateOptions(options, defaults) {
  if (typeof options === 'function') {
    defaults.callback = options;
  } else if (options) {
    for (var name in options) {
      /* istanbul ignore else */
      if (options.hasOwnProperty(name)) {
        defaults[name] = options[name];
      }
    }
  }
  return defaults;
}

});

var word = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.wordDiff = undefined;
exports. /*istanbul ignore end*/diffWords = diffWords;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffWordsWithSpace = diffWordsWithSpace;



/*istanbul ignore start*/var _base2 = _interopRequireDefault(base);

/*istanbul ignore end*/

/*istanbul ignore start*/function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/ // Based on https://en.wikipedia.org/wiki/Latin_script_in_Unicode
//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF
var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;

var reWhitespace = /\S/;

var wordDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/wordDiff = new /*istanbul ignore start*/_base2['default'] /*istanbul ignore end*/();
wordDiff.equals = function (left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }
  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};
wordDiff.tokenize = function (value) {
  var tokens = value.split(/(\s+|\b)/);

  // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.
  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }

  return tokens;
};

function diffWords(oldStr, newStr, options) {
  options = /*istanbul ignore start*/(0, params.generateOptions) /*istanbul ignore end*/(options, { ignoreWhitespace: true });
  return wordDiff.diff(oldStr, newStr, options);
}

function diffWordsWithSpace(oldStr, newStr, options) {
  return wordDiff.diff(oldStr, newStr, options);
}

});

var line = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.lineDiff = undefined;
exports. /*istanbul ignore end*/diffLines = diffLines;
/*istanbul ignore start*/exports. /*istanbul ignore end*/diffTrimmedLines = diffTrimmedLines;



/*istanbul ignore start*/var _base2 = _interopRequireDefault(base);

/*istanbul ignore end*/

/*istanbul ignore start*/function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var lineDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/lineDiff = new /*istanbul ignore start*/_base2['default'] /*istanbul ignore end*/();
lineDiff.tokenize = function (value) {
  var this$1 = this;

  var retLines = [],
      linesAndNewlines = value.split(/(\n|\r\n)/);

  // Ignore the final empty token that occurs if the string ends with a new line
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }

  // Merge the content and line separators into single tokens
  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];

    if (i % 2 && !this$1.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this$1.options.ignoreWhitespace) {
        line = line.trim();
      }
      retLines.push(line);
    }
  }

  return retLines;
};

function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}
function diffTrimmedLines(oldStr, newStr, callback) {
  var options = /*istanbul ignore start*/(0, params.generateOptions) /*istanbul ignore end*/(callback, { ignoreWhitespace: true });
  return lineDiff.diff(oldStr, newStr, options);
}

});

var sentence = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.sentenceDiff = undefined;
exports. /*istanbul ignore end*/diffSentences = diffSentences;



/*istanbul ignore start*/var _base2 = _interopRequireDefault(base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var sentenceDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/sentenceDiff = new /*istanbul ignore start*/_base2['default'] /*istanbul ignore end*/();
sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};

function diffSentences(oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback);
}

});

var css = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.cssDiff = undefined;
exports. /*istanbul ignore end*/diffCss = diffCss;



/*istanbul ignore start*/var _base2 = _interopRequireDefault(base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var cssDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/cssDiff = new /*istanbul ignore start*/_base2['default'] /*istanbul ignore end*/();
cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};

function diffCss(oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback);
}

});

var json = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.jsonDiff = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports. /*istanbul ignore end*/diffJson = diffJson;
/*istanbul ignore start*/exports. /*istanbul ignore end*/canonicalize = canonicalize;



/*istanbul ignore start*/var _base2 = _interopRequireDefault(base);

/*istanbul ignore end*/

/*istanbul ignore start*/function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var objectPrototypeToString = Object.prototype.toString;

var jsonDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/jsonDiff = new /*istanbul ignore start*/_base2['default'] /*istanbul ignore end*/();
// Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:
jsonDiff.useLongestToken = true;

jsonDiff.tokenize = /*istanbul ignore start*/line.lineDiff /*istanbul ignore end*/.tokenize;
jsonDiff.castInput = function (value) {
  /*istanbul ignore start*/var /*istanbul ignore end*/undefinedReplacement = this.options.undefinedReplacement;


  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value), function (k, v) {
    if (typeof v === 'undefined') {
      return undefinedReplacement;
    }

    return v;
  }, '  ');
};
jsonDiff.equals = function (left, right) {
  return (/*istanbul ignore start*/_base2['default'] /*istanbul ignore end*/.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'))
  );
};

function diffJson(oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options);
}

// This function handles the presence of circular references by bailing out when encountering an
// object that is already on the "stack" of items being processed.
function canonicalize(obj, stack, replacementStack) {
  stack = stack || [];
  replacementStack = replacementStack || [];

  var i = /*istanbul ignore start*/void 0;

  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }

  var canonicalizedObj = /*istanbul ignore start*/void 0;

  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);
    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack);
    }
    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }

  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }

  if ( /*istanbul ignore start*/(typeof /*istanbul ignore end*/obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);
    var sortedKeys = [],
        key = /*istanbul ignore start*/void 0;
    for (key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(key)) {
        sortedKeys.push(key);
      }
    }
    sortedKeys.sort();
    for (i = 0; i < sortedKeys.length; i += 1) {
      key = sortedKeys[i];
      canonicalizedObj[key] = canonicalize(obj[key], stack, replacementStack);
    }
    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }
  return canonicalizedObj;
}

});

var array = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports.arrayDiff = undefined;
exports. /*istanbul ignore end*/diffArrays = diffArrays;



/*istanbul ignore start*/var _base2 = _interopRequireDefault(base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*istanbul ignore end*/var arrayDiff = /*istanbul ignore start*/exports. /*istanbul ignore end*/arrayDiff = new /*istanbul ignore start*/_base2['default'] /*istanbul ignore end*/();
arrayDiff.tokenize = arrayDiff.join = function (value) {
  return value.slice();
};

function diffArrays(oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback);
}

});

var parse = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/parsePatch = parsePatch;
function parsePatch(uniDiff) {
  /*istanbul ignore start*/var /*istanbul ignore end*/options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var diffstr = uniDiff.split(/\r\n|[\n\v\f\r\x85]/),
      delimiters = uniDiff.match(/\r\n|[\n\v\f\r\x85]/g) || [],
      list = [],
      i = 0;

  function parseIndex() {
    var index = {};
    list.push(index);

    // Parse diff metadata
    while (i < diffstr.length) {
      var line = diffstr[i];

      // File header found, end parsing diff metadata
      if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
        break;
      }

      // Diff index
      var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);
      if (header) {
        index.index = header[1];
      }

      i++;
    }

    // Parse file headers if they are defined. Unified diff requires them, but
    // there's no technical issues to have an isolated hunk without file header
    parseFileHeader(index);
    parseFileHeader(index);

    // Parse hunks
    index.hunks = [];

    while (i < diffstr.length) {
      var _line = diffstr[i];

      if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(_line)) {
        break;
      } else if (/^@@/.test(_line)) {
        index.hunks.push(parseHunk());
      } else if (_line && options.strict) {
        // Ignore unexpected content unless in strict mode
        throw new Error('Unknown line ' + (i + 1) + ' ' + JSON.stringify(_line));
      } else {
        i++;
      }
    }
  }

  // Parses the --- and +++ headers, if none are found, no lines
  // are consumed.
  function parseFileHeader(index) {
    var headerPattern = /^(---|\+\+\+)\s+([\S ]*)(?:\t(.*?)\s*)?$/;
    var fileHeader = headerPattern.exec(diffstr[i]);
    if (fileHeader) {
      var keyPrefix = fileHeader[1] === '---' ? 'old' : 'new';
      var fileName = fileHeader[2].replace(/\\\\/g, '\\');
      if (fileName.startsWith('"') && fileName.endsWith('"')) {
        fileName = fileName.substr(1, fileName.length - 2);
      }
      index[keyPrefix + 'FileName'] = fileName;
      index[keyPrefix + 'Header'] = fileHeader[3];

      i++;
    }
  }

  // Parses a hunk
  // This assumes that we are at the start of a hunk.
  function parseHunk() {
    var chunkHeaderIndex = i,
        chunkHeaderLine = diffstr[i++],
        chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);

    var hunk = {
      oldStart: +chunkHeader[1],
      oldLines: +chunkHeader[2] || 1,
      newStart: +chunkHeader[3],
      newLines: +chunkHeader[4] || 1,
      lines: [],
      linedelimiters: []
    };

    var addCount = 0,
        removeCount = 0;
    for (; i < diffstr.length; i++) {
      // Lines starting with '---' could be mistaken for the "remove line" operation
      // But they could be the header for the next file. Therefore prune such cases out.
      if (diffstr[i].indexOf('--- ') === 0 && i + 2 < diffstr.length && diffstr[i + 1].indexOf('+++ ') === 0 && diffstr[i + 2].indexOf('@@') === 0) {
        break;
      }
      var operation = diffstr[i][0];

      if (operation === '+' || operation === '-' || operation === ' ' || operation === '\\') {
        hunk.lines.push(diffstr[i]);
        hunk.linedelimiters.push(delimiters[i] || '\n');

        if (operation === '+') {
          addCount++;
        } else if (operation === '-') {
          removeCount++;
        } else if (operation === ' ') {
          addCount++;
          removeCount++;
        }
      } else {
        break;
      }
    }

    // Handle the empty block count case
    if (!addCount && hunk.newLines === 1) {
      hunk.newLines = 0;
    }
    if (!removeCount && hunk.oldLines === 1) {
      hunk.oldLines = 0;
    }

    // Perform optional sanity checking
    if (options.strict) {
      if (addCount !== hunk.newLines) {
        throw new Error('Added line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }
      if (removeCount !== hunk.oldLines) {
        throw new Error('Removed line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }
    }

    return hunk;
  }

  while (i < diffstr.length) {
    parseIndex();
  }

  return list;
}

});

var distanceIterator = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/"use strict";

exports.__esModule = true;

exports["default"] = /*istanbul ignore end*/function (start, minLine, maxLine) {
  var wantForward = true,
      backwardExhausted = false,
      forwardExhausted = false,
      localOffset = 1;

  return function iterator() {
    if (wantForward && !forwardExhausted) {
      if (backwardExhausted) {
        localOffset++;
      } else {
        wantForward = false;
      }

      // Check if trying to fit beyond text length, and if not, check it fits
      // after offset location (or desired location on first iteration)
      if (start + localOffset <= maxLine) {
        return localOffset;
      }

      forwardExhausted = true;
    }

    if (!backwardExhausted) {
      if (!forwardExhausted) {
        wantForward = true;
      }

      // Check if trying to fit before text beginning, and if not, check it fits
      // before offset location
      if (minLine <= start - localOffset) {
        return -localOffset++;
      }

      backwardExhausted = true;
      return iterator();
    }

    // We tried to fit hunk before text beginning and beyond text lenght, then
    // hunk can't fit on the text. Return undefined
  };
};

});

var apply = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/

exports.__esModule = true;
exports.applyPatch = applyPatch;
/*istanbul ignore start*/ exports.applyPatches = applyPatches;

 /*istanbul ignore end*/

 /*istanbul ignore end*/

/*istanbul ignore start*/ var _distanceIterator2 = _interopRequireDefault(
  distanceIterator
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

/*istanbul ignore end*/ function applyPatch(source, uniDiff) {
  /*istanbul ignore start*/ var /*istanbul ignore end*/ options = arguments.length >
    2 && arguments[2] !== undefined ?
    arguments[2] :
    {};

  if (typeof uniDiff === 'string') {
    uniDiff = /*istanbul ignore start*/ (0, parse.parsePatch)(uniDiff);
  }

  if (Array.isArray(uniDiff)) {
    if (uniDiff.length > 1) {
      throw new Error('applyPatch only works with a single input.')
    }

    uniDiff = uniDiff[0];
  }

  // Apply the diff to the input
  var lines = source.split(/\r\n|[\n\v\f\r\x85]/),
    delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || [],
    hunks = uniDiff.hunks,
    compareLine =
      options.compareLine ||
      function(
        lineNumber,
        line,
        operation,
        patchContent
      ) /*istanbul ignore start*/ {
        return /*istanbul ignore end*/ line === patchContent
      },
    errorCount = 0,
    fuzzFactor = options.fuzzFactor || 0,
    minLine = 0,
    offset = 0,
    removeEOFNL = /*istanbul ignore start*/ void 0 /*istanbul ignore end*/,
    addEOFNL = /*istanbul ignore start*/ void 0; /*istanbul ignore end*/

  /**
   * Checks if the hunk exactly fits on the provided location
   */
  function hunkFits(hunk, toPos) {
    for (var j = 0; j < hunk.lines.length; j++) {
      var line = hunk.lines[j], operation = line[0], content = line.substr(1);

      if (operation === ' ' || operation === '-') {
        // Context sanity check
        if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
          errorCount++;

          if (errorCount > fuzzFactor) {
            return false
          }
        }
        toPos++;
      }
    }

    return true
  }

  // Search best fit offsets for each hunk based on the previous ones
  for (var i = 0; i < hunks.length; i++) {
    var hunk = hunks[i],
      maxLine = lines.length - hunk.oldLines,
      localOffset = 0,
      toPos = offset + hunk.oldStart - 1;

    var iterator = /*istanbul ignore start*/ (0, _distanceIterator2.default)(
      toPos,
      minLine,
      maxLine
    );

    for (; localOffset !== undefined; localOffset = iterator()) {
      if (hunkFits(hunk, toPos + localOffset)) {
        hunk.offset = offset += localOffset;
        break
      }
    }

    if (localOffset === undefined) {
      return false
    }

    // Set lower text limit to end of the current hunk, so next ones don't try
    // to fit over already patched text
    minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
  }

  // Apply patch hunks
  for (var _i = 0; _i < hunks.length; _i++) {
    var _hunk = hunks[_i], _toPos = _hunk.offset + _hunk.newStart - 1;
    if (_hunk.newLines == 0) {
      _toPos++;
    }

    for (var j = 0; j < _hunk.lines.length; j++) {
      var line = _hunk.lines[j],
        operation = line[0],
        content = line.substr(1),
        delimiter = _hunk.linedelimiters[j];

      if (operation === ' ') {
        _toPos++;
      }
      else if (operation === '-') {
        lines.splice(_toPos, 1);
        delimiters.splice(_toPos, 1);
        /* istanbul ignore else */
      }
      else if (operation === '+') {
        lines.splice(_toPos, 0, content);
        delimiters.splice(_toPos, 0, delimiter);
        _toPos++;
      }
      else if (operation === '\\') {
        var previousOperation = _hunk.lines[j - 1] ?
          _hunk.lines[j - 1][0] :
          null;
        if (previousOperation === '+') {
          removeEOFNL = true;
        }
        else if (previousOperation === '-') {
          addEOFNL = true;
        }
      }
    }
  }

  // Handle EOFNL insertion/removal
  if (removeEOFNL) {
    while (!lines[lines.length - 1]) {
      lines.pop();
      delimiters.pop();
    }
  }
  else if (addEOFNL) {
    lines.push('');
    delimiters.push('\n');
  }
  for (var _k = 0; _k < lines.length - 1; _k++) {
    lines[_k] = lines[_k] + delimiters[_k];
  }
  return lines.join('')
}

// Wrapper that supports multiple file patches via callbacks.
function applyPatches(uniDiff, options) {
  if (typeof uniDiff === 'string') {
    uniDiff = /*istanbul ignore start*/ (0, parse.parsePatch)(uniDiff);
  }

  var currentIndex = 0;
  function processIndex() {
    var index = uniDiff[currentIndex++];
    if (!index) {
      return options.complete()
    }

    options.loadFile(index, function (err, data) {
      if (err) {
        return options.complete(err)
      }

      var updatedContent = applyPatch(data, index, options);
      options.patched(index, updatedContent, function (err) {
        if (err) {
          return options.complete(err)
        }

        processIndex();
      });
    });
  }
  processIndex();
}

});

var create = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/structuredPatch = structuredPatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/createTwoFilesPatch = createTwoFilesPatch;
/*istanbul ignore start*/exports. /*istanbul ignore end*/createPatch = createPatch;



/*istanbul ignore start*/function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*istanbul ignore end*/function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }
  if (typeof options.context === 'undefined') {
    options.context = 4;
  }

  var diff = /*istanbul ignore start*/(0, line.diffLines) /*istanbul ignore end*/(oldStr, newStr, options);
  diff.push({ value: '', lines: [] }); // Append an empty value to make cleanup easier

  function contextLines(lines) {
    return lines.map(function (entry) {
      return ' ' + entry;
    });
  }

  var hunks = [];
  var oldRangeStart = 0,
      newRangeStart = 0,
      curRange = [],
      oldLine = 1,
      newLine = 1;

  /*istanbul ignore start*/var _loop = function _loop( /*istanbul ignore end*/i) {
    var current = diff[i],
        lines = current.lines || current.value.replace(/\n$/, '').split('\n');
    current.lines = lines;

    if (current.added || current.removed) {
      /*istanbul ignore start*/var _curRange;

      /*istanbul ignore end*/ // If we have previous context, start with that
      if (!oldRangeStart) {
        var prev = diff[i - 1];
        oldRangeStart = oldLine;
        newRangeStart = newLine;

        if (prev) {
          curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
          oldRangeStart -= curRange.length;
          newRangeStart -= curRange.length;
        }
      }

      // Output our changes
      /*istanbul ignore start*/(_curRange = /*istanbul ignore end*/curRange).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_curRange /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/lines.map(function (entry) {
        return (current.added ? '+' : '-') + entry;
      })));

      // Track the updated file position
      if (current.added) {
        newLine += lines.length;
      } else {
        oldLine += lines.length;
      }
    } else {
      // Identical context lines. Track line changes
      if (oldRangeStart) {
        // Close out any changes that have been output (or join overlapping)
        if (lines.length <= options.context * 2 && i < diff.length - 2) {
          /*istanbul ignore start*/var _curRange2;

          /*istanbul ignore end*/ // Overlapping
          /*istanbul ignore start*/(_curRange2 = /*istanbul ignore end*/curRange).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_curRange2 /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/contextLines(lines)));
        } else {
          /*istanbul ignore start*/var _curRange3;

          /*istanbul ignore end*/ // end the range and output
          var contextSize = Math.min(lines.length, options.context);
          /*istanbul ignore start*/(_curRange3 = /*istanbul ignore end*/curRange).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_curRange3 /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/contextLines(lines.slice(0, contextSize))));

          var hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange
          };
          if (i >= diff.length - 2 && lines.length <= options.context) {
            // EOF is inside this hunk
            var oldEOFNewline = /\n$/.test(oldStr);
            var newEOFNewline = /\n$/.test(newStr);
            if (lines.length == 0 && !oldEOFNewline) {
              // special case: old has no eol and no trailing context; no-nl can end up before adds
              curRange.splice(hunk.oldLines, 0, '\\ No newline at end of file');
            } else if (!oldEOFNewline || !newEOFNewline) {
              curRange.push('\\ No newline at end of file');
            }
          }
          hunks.push(hunk);

          oldRangeStart = 0;
          newRangeStart = 0;
          curRange = [];
        }
      }
      oldLine += lines.length;
      newLine += lines.length;
    }
  };

  for (var i = 0; i < diff.length; i++) {
    /*istanbul ignore start*/_loop( /*istanbul ignore end*/i);
  }

  return {
    oldFileName: oldFileName, newFileName: newFileName,
    oldHeader: oldHeader, newHeader: newHeader,
    hunks: hunks
  };
}

function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  var diff = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);

  var ret = [];
  if (oldFileName == newFileName) {
    ret.push('Index: ' + oldFileName);
  }
  ret.push('===================================================================');
  ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
  ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));

  for (var i = 0; i < diff.hunks.length; i++) {
    var hunk = diff.hunks[i];
    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
    ret.push.apply(ret, hunk.lines);
  }

  return ret.join('\n') + '\n';
}

function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}

});

var array$2 = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/"use strict";

exports.__esModule = true;
exports. /*istanbul ignore end*/arrayEqual = arrayEqual;
/*istanbul ignore start*/exports. /*istanbul ignore end*/arrayStartsWith = arrayStartsWith;
function arrayEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  return arrayStartsWith(a, b);
}

function arrayStartsWith(array, start) {
  if (start.length > array.length) {
    return false;
  }

  for (var i = 0; i < start.length; i++) {
    if (start[i] !== array[i]) {
      return false;
    }
  }

  return true;
}

});

var merge_1 = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/calcLineCount = calcLineCount;
/*istanbul ignore start*/exports. /*istanbul ignore end*/merge = merge;







/*istanbul ignore start*/function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*istanbul ignore end*/function calcLineCount(hunk) {
  var conflicted = false;

  hunk.oldLines = 0;
  hunk.newLines = 0;

  hunk.lines.forEach(function (line) {
    if (typeof line !== 'string') {
      conflicted = true;
      return;
    }

    if (line[0] === '+' || line[0] === ' ') {
      hunk.newLines++;
    }
    if (line[0] === '-' || line[0] === ' ') {
      hunk.oldLines++;
    }
  });

  if (conflicted) {
    delete hunk.oldLines;
    delete hunk.newLines;
  }
}

function merge(mine, theirs, base) {
  mine = loadPatch(mine, base);
  theirs = loadPatch(theirs, base);

  var ret = {};

  // For index we just let it pass through as it doesn't have any necessary meaning.
  // Leaving sanity checks on this to the API consumer that may know more about the
  // meaning in their own context.
  if (mine.index || theirs.index) {
    ret.index = mine.index || theirs.index;
  }

  if (mine.newFileName || theirs.newFileName) {
    if (!fileNameChanged(mine)) {
      // No header or no change in ours, use theirs (and ours if theirs does not exist)
      ret.oldFileName = theirs.oldFileName || mine.oldFileName;
      ret.newFileName = theirs.newFileName || mine.newFileName;
      ret.oldHeader = theirs.oldHeader || mine.oldHeader;
      ret.newHeader = theirs.newHeader || mine.newHeader;
    } else if (!fileNameChanged(theirs)) {
      // No header or no change in theirs, use ours
      ret.oldFileName = mine.oldFileName;
      ret.newFileName = mine.newFileName;
      ret.oldHeader = mine.oldHeader;
      ret.newHeader = mine.newHeader;
    } else {
      // Both changed... figure it out
      ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
      ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
      ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
      ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
    }
  }

  ret.hunks = [];

  var mineIndex = 0,
      theirsIndex = 0,
      mineOffset = 0,
      theirsOffset = 0;

  while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
    var mineCurrent = mine.hunks[mineIndex] || { oldStart: Infinity },
        theirsCurrent = theirs.hunks[theirsIndex] || { oldStart: Infinity };

    if (hunkBefore(mineCurrent, theirsCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
      mineIndex++;
      theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
    } else if (hunkBefore(theirsCurrent, mineCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
      theirsIndex++;
      mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
    } else {
      // Overlap, merge as best we can
      var mergedHunk = {
        oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
        oldLines: 0,
        newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
        newLines: 0,
        lines: []
      };
      mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
      theirsIndex++;
      mineIndex++;

      ret.hunks.push(mergedHunk);
    }
  }

  return ret;
}

function loadPatch(param, base) {
  if (typeof param === 'string') {
    if (/^@@/m.test(param) || /^Index:/m.test(param)) {
      return (/*istanbul ignore start*/(0, parse.parsePatch) /*istanbul ignore end*/(param)[0]
      );
    }

    if (!base) {
      throw new Error('Must provide a base reference or pass in a patch');
    }
    return (/*istanbul ignore start*/(0, create.structuredPatch) /*istanbul ignore end*/(undefined, undefined, base, param)
    );
  }

  return param;
}

function fileNameChanged(patch) {
  return patch.newFileName && patch.newFileName !== patch.oldFileName;
}

function selectField(index, mine, theirs) {
  if (mine === theirs) {
    return mine;
  } else {
    index.conflict = true;
    return { mine: mine, theirs: theirs };
  }
}

function hunkBefore(test, check) {
  return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
}

function cloneHunk(hunk, offset) {
  return {
    oldStart: hunk.oldStart, oldLines: hunk.oldLines,
    newStart: hunk.newStart + offset, newLines: hunk.newLines,
    lines: hunk.lines
  };
}

function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
  // This will generally result in a conflicted hunk, but there are cases where the context
  // is the only overlap where we can successfully merge the content here.
  var mine = { offset: mineOffset, lines: mineLines, index: 0 },
      their = { offset: theirOffset, lines: theirLines, index: 0 };

  // Handle any leading content
  insertLeading(hunk, mine, their);
  insertLeading(hunk, their, mine);

  // Now in the overlap content. Scan through and select the best changes from each.
  while (mine.index < mine.lines.length && their.index < their.lines.length) {
    var mineCurrent = mine.lines[mine.index],
        theirCurrent = their.lines[their.index];

    if ((mineCurrent[0] === '-' || mineCurrent[0] === '+') && (theirCurrent[0] === '-' || theirCurrent[0] === '+')) {
      // Both modified ...
      mutualChange(hunk, mine, their);
    } else if (mineCurrent[0] === '+' && theirCurrent[0] === ' ') {
      /*istanbul ignore start*/var _hunk$lines;

      /*istanbul ignore end*/ // Mine inserted
      /*istanbul ignore start*/(_hunk$lines = /*istanbul ignore end*/hunk.lines).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_hunk$lines /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/collectChange(mine)));
    } else if (theirCurrent[0] === '+' && mineCurrent[0] === ' ') {
      /*istanbul ignore start*/var _hunk$lines2;

      /*istanbul ignore end*/ // Theirs inserted
      /*istanbul ignore start*/(_hunk$lines2 = /*istanbul ignore end*/hunk.lines).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_hunk$lines2 /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/collectChange(their)));
    } else if (mineCurrent[0] === '-' && theirCurrent[0] === ' ') {
      // Mine removed or edited
      removal(hunk, mine, their);
    } else if (theirCurrent[0] === '-' && mineCurrent[0] === ' ') {
      // Their removed or edited
      removal(hunk, their, mine, true);
    } else if (mineCurrent === theirCurrent) {
      // Context identity
      hunk.lines.push(mineCurrent);
      mine.index++;
      their.index++;
    } else {
      // Context mismatch
      conflict(hunk, collectChange(mine), collectChange(their));
    }
  }

  // Now push anything that may be remaining
  insertTrailing(hunk, mine);
  insertTrailing(hunk, their);

  calcLineCount(hunk);
}

function mutualChange(hunk, mine, their) {
  var myChanges = collectChange(mine),
      theirChanges = collectChange(their);

  if (allRemoves(myChanges) && allRemoves(theirChanges)) {
    // Special case for remove changes that are supersets of one another
    if ( /*istanbul ignore start*/(0, array$2.arrayStartsWith) /*istanbul ignore end*/(myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)) {
      /*istanbul ignore start*/var _hunk$lines3;

      /*istanbul ignore end*/ /*istanbul ignore start*/(_hunk$lines3 = /*istanbul ignore end*/hunk.lines).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_hunk$lines3 /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/myChanges));
      return;
    } else if ( /*istanbul ignore start*/(0, array$2.arrayStartsWith) /*istanbul ignore end*/(theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)) {
      /*istanbul ignore start*/var _hunk$lines4;

      /*istanbul ignore end*/ /*istanbul ignore start*/(_hunk$lines4 = /*istanbul ignore end*/hunk.lines).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_hunk$lines4 /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/theirChanges));
      return;
    }
  } else if ( /*istanbul ignore start*/(0, array$2.arrayEqual) /*istanbul ignore end*/(myChanges, theirChanges)) {
    /*istanbul ignore start*/var _hunk$lines5;

    /*istanbul ignore end*/ /*istanbul ignore start*/(_hunk$lines5 = /*istanbul ignore end*/hunk.lines).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_hunk$lines5 /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/myChanges));
    return;
  }

  conflict(hunk, myChanges, theirChanges);
}

function removal(hunk, mine, their, swap) {
  var myChanges = collectChange(mine),
      theirChanges = collectContext(their, myChanges);
  if (theirChanges.merged) {
    /*istanbul ignore start*/var _hunk$lines6;

    /*istanbul ignore end*/ /*istanbul ignore start*/(_hunk$lines6 = /*istanbul ignore end*/hunk.lines).push. /*istanbul ignore start*/apply /*istanbul ignore end*/( /*istanbul ignore start*/_hunk$lines6 /*istanbul ignore end*/, /*istanbul ignore start*/_toConsumableArray( /*istanbul ignore end*/theirChanges.merged));
  } else {
    conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
  }
}

function conflict(hunk, mine, their) {
  hunk.conflict = true;
  hunk.lines.push({
    conflict: true,
    mine: mine,
    theirs: their
  });
}

function insertLeading(hunk, insert, their) {
  while (insert.offset < their.offset && insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
    insert.offset++;
  }
}
function insertTrailing(hunk, insert) {
  while (insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
  }
}

function collectChange(state) {
  var ret = [],
      operation = state.lines[state.index][0];
  while (state.index < state.lines.length) {
    var line = state.lines[state.index];

    // Group additions that are immediately after subtractions and treat them as one "atomic" modify change.
    if (operation === '-' && line[0] === '+') {
      operation = '+';
    }

    if (operation === line[0]) {
      ret.push(line);
      state.index++;
    } else {
      break;
    }
  }

  return ret;
}
function collectContext(state, matchChanges) {
  var changes = [],
      merged = [],
      matchIndex = 0,
      contextChanges = false,
      conflicted = false;
  while (matchIndex < matchChanges.length && state.index < state.lines.length) {
    var change = state.lines[state.index],
        match = matchChanges[matchIndex];

    // Once we've hit our add, then we are done
    if (match[0] === '+') {
      break;
    }

    contextChanges = contextChanges || change[0] !== ' ';

    merged.push(match);
    matchIndex++;

    // Consume any additions in the other block as a conflict to attempt
    // to pull in the remaining context after this
    if (change[0] === '+') {
      conflicted = true;

      while (change[0] === '+') {
        changes.push(change);
        change = state.lines[++state.index];
      }
    }

    if (match.substr(1) === change.substr(1)) {
      changes.push(change);
      state.index++;
    } else {
      conflicted = true;
    }
  }

  if ((matchChanges[matchIndex] || '')[0] === '+' && contextChanges) {
    conflicted = true;
  }

  if (conflicted) {
    return changes;
  }

  while (matchIndex < matchChanges.length) {
    merged.push(matchChanges[matchIndex++]);
  }

  return {
    merged: merged,
    changes: changes
  };
}

function allRemoves(changes) {
  return changes.reduce(function (prev, change) {
    return prev && change[0] === '-';
  }, true);
}
function skipRemoveSuperset(state, removeChanges, delta) {
  for (var i = 0; i < delta; i++) {
    var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);
    if (state.lines[state.index + i] !== ' ' + changeContent) {
      return false;
    }
  }

  state.index += delta;
  return true;
}

});

var dmp = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/"use strict";

exports.__esModule = true;
exports. /*istanbul ignore end*/convertChangesToDMP = convertChangesToDMP;
// See: http://code.google.com/p/google-diff-match-patch/wiki/API
function convertChangesToDMP(changes) {
  var ret = [],
      change = /*istanbul ignore start*/void 0 /*istanbul ignore end*/,
      operation = /*istanbul ignore start*/void 0;
  for (var i = 0; i < changes.length; i++) {
    change = changes[i];
    if (change.added) {
      operation = 1;
    } else if (change.removed) {
      operation = -1;
    } else {
      operation = 0;
    }

    ret.push([operation, change.value]);
  }
  return ret;
}

});

var xml = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/'use strict';

exports.__esModule = true;
exports. /*istanbul ignore end*/convertChangesToXML = convertChangesToXML;
function convertChangesToXML(changes) {
  var ret = [];
  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];
    if (change.added) {
      ret.push('<ins>');
    } else if (change.removed) {
      ret.push('<del>');
    }

    ret.push(escapeHTML(change.value));

    if (change.added) {
      ret.push('</ins>');
    } else if (change.removed) {
      ret.push('</del>');
    }
  }
  return ret.join('');
}

function escapeHTML(s) {
  var n = s;
  n = n.replace(/&/g, '&amp;');
  n = n.replace(/</g, '&lt;');
  n = n.replace(/>/g, '&gt;');
  n = n.replace(/"/g, '&quot;');

  return n;
}

});

var index$20 = createCommonjsModule(function (module, exports) {
/*istanbul ignore start*/

exports.__esModule = true;
exports.canonicalize = exports.convertChangesToXML = exports.convertChangesToDMP = exports.merge = exports.parsePatch = exports.applyPatches = exports.applyPatch = exports.createPatch = exports.createTwoFilesPatch = exports.structuredPatch = exports.diffArrays = exports.diffJson = exports.diffCss = exports.diffSentences = exports.diffTrimmedLines = exports.diffLines = exports.diffWordsWithSpace = exports.diffWords = exports.diffChars = exports.Diff = undefined;

/*istanbul ignore end*/  /*istanbul ignore end*/

/*istanbul ignore start*/ var _base2 = _interopRequireDefault(base);

/*istanbul ignore end*/  /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

 /*istanbul ignore end*/

/*istanbul ignore start*/ function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

/* See LICENSE file for terms of use */

/*
 * Text diff implementation.
 *
 * This library supports the following APIS:
 * JsDiff.diffChars: Character by character diff
 * JsDiff.diffWords: Word (as defined by \b regex) diff which ignores whitespace
 * JsDiff.diffLines: Line based diff
 *
 * JsDiff.diffCss: Diff targeted at CSS content
 *
 * These methods are based on the implementation proposed in
 * "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).
 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
 */
exports.Diff = _base2.default;
/*istanbul ignore start*/ exports.diffChars = character.diffChars;
/*istanbul ignore start*/ exports.diffWords = word.diffWords;
/*istanbul ignore start*/ exports.diffWordsWithSpace = word.diffWordsWithSpace;
/*istanbul ignore start*/ exports.diffLines = line.diffLines;
/*istanbul ignore start*/ exports.diffTrimmedLines = line.diffTrimmedLines;
/*istanbul ignore start*/ exports.diffSentences = sentence.diffSentences;
/*istanbul ignore start*/ exports.diffCss = css.diffCss;
/*istanbul ignore start*/ exports.diffJson = json.diffJson;
/*istanbul ignore start*/ exports.diffArrays = array.diffArrays;
/*istanbul ignore start*/ exports.structuredPatch = create.structuredPatch;
/*istanbul ignore start*/ exports.createTwoFilesPatch =
  create.createTwoFilesPatch;
/*istanbul ignore start*/ exports.createPatch = create.createPatch;
/*istanbul ignore start*/ exports.applyPatch = apply.applyPatch;
/*istanbul ignore start*/ exports.applyPatches = apply.applyPatches;
/*istanbul ignore start*/ exports.parsePatch = parse.parsePatch;
/*istanbul ignore start*/ exports.merge = merge_1.merge;
/*istanbul ignore start*/ exports.convertChangesToDMP = dmp.convertChangesToDMP;
/*istanbul ignore start*/ exports.convertChangesToXML = xml.convertChangesToXML;
/*istanbul ignore start*/ exports.canonicalize = json.canonicalize;

});

/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
function diff_match_patch() {
  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  this.Match_Threshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  this.Match_Distance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
  // end points of a delete need to match.
  this.Patch_DeleteThreshold = 0.5;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  // The number of bits in an int.
  this.Match_MaxBits = 32;
}

//  DIFF FUNCTIONS

/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff.
 * @param {number} opt_deadline Optional time when the diff should be complete
 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
 *     instead.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 */
diff_match_patch.prototype.diff_main = function(
  text1,
  text2,
  opt_checklines,
  opt_deadline
) {
  // Set a deadline by which time the diff must be complete.
  if (typeof opt_deadline === 'undefined') {
    if (this.Diff_Timeout <= 0) {
      opt_deadline = Number.MAX_VALUE;
    }
    else {
      opt_deadline = new Date().getTime() + this.Diff_Timeout * 1000;
    }
  }
  var deadline = opt_deadline;

  // Check for null inputs.
  if (text1 == null || text2 == null) {
    throw new Error('Null input. (diff_main)')
  }

  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]]
    }
    return []
  }

  if (typeof opt_checklines === 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup).
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  this.diff_cleanupMerge(diffs);
  return diffs
};

/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_compute_ = function(
  text1,
  text2,
  checklines,
  deadline
) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]]
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]]
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [
      [DIFF_INSERT, longtext.substring(0, i)],
      [DIFF_EQUAL, shorttext],
      [DIFF_INSERT, longtext.substring(i + shorttext.length)] ];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]]
  }

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b)
  }

  if (checklines && text1.length > 100 && text2.length > 100) {
    return this.diff_lineMode_(text1, text2, deadline)
  }

  return this.diff_bisect_(text1, text2, deadline)
};

/**
 * Do a quick line-level diff on both strings, then rediff the parts for
 * greater accuracy.
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
  var this$1 = this;

  // Scan the text on a line-by-line basis first.
  var a = this.diff_linesToChars_(text1, text2);
  text1 = a.chars1;
  text2 = a.chars2;
  var linearray = a.lineArray;

  var diffs = this.diff_main(text1, text2, false, deadline);

  // Convert the diff back to original text.
  this.diff_charsToLines_(diffs, linearray);
  // Eliminate freak matches (e.g. blank lines)
  this.diff_cleanupSemantic(diffs);

  // Rediff any replacement blocks, this time character-by-character.
  // Add a dummy entry at the end.
  diffs.push([DIFF_EQUAL, '']);
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        break
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        break
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          diffs.splice(
            pointer - count_delete - count_insert,
            count_delete + count_insert
          );
          pointer = pointer - count_delete - count_insert;
          var a = this$1.diff_main(text_delete, text_insert, false, deadline);
          for (var j = a.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, a[j]);
          }
          pointer = pointer + a.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break
    }
    pointer++;
  }
  diffs.pop(); // Remove the dummy entry at the end.

  return diffs
};

/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
  var this$1 = this;

  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = delta % 2 != 0;
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Bail out if deadline is reached.
    if (new Date().getTime() > deadline) {
      break
    }

    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      }
      else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (
        x1 < text1_length &&
        y1 < text2_length &&
        text1.charAt(x1) == text2.charAt(y1)
      ) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      }
      else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      }
      else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return this$1.diff_bisectSplit_(text1, text2, x1, y1, deadline)
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      }
      else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (
        x2 < text1_length &&
        y2 < text2_length &&
        text1.charAt(text1_length - x2 - 1) ==
          text2.charAt(text2_length - y2 - 1)
      ) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      }
      else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      }
      else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return this$1.diff_bisectSplit_(text1, text2, x1, y1, deadline)
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]]
};

/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisectSplit_ = function(
  text1,
  text2,
  x,
  y,
  deadline
) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = this.diff_main(text1a, text2a, false, deadline);
  var diffsb = this.diff_main(text1b, text2b, false, deadline);

  return diffs.concat(diffsb)
};

/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
 *     An object containing the encoded text1, the encoded text2 and
 *     the array of unique strings.
 *     The zeroth element of the array of unique strings is intentionally blank.
 * @private
 */
diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
  var lineArray = []; // e.g. lineArray[4] == 'Hello\n'
  var lineHash = {}; // e.g. lineHash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  lineArray[0] = '';

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {string} text String to encode.
   * @return {string} Encoded string.
   * @private
   */
  function diff_linesToCharsMunge_(text) {
    var chars = '';
    // Walk the text, pulling out a substring for each line.
    // text.split('\n') would would temporarily double our memory footprint.
    // Modifying text would create many large strings to garbage collect.
    var lineStart = 0;
    var lineEnd = -1;
    // Keeping our own length variable is faster than looking it up.
    var lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf('\n', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      var line = text.substring(lineStart, lineEnd + 1);
      lineStart = lineEnd + 1;

      if (
        lineHash.hasOwnProperty ?
          lineHash.hasOwnProperty(line) :
          lineHash[line] !== undefined
      ) {
        chars += String.fromCharCode(lineHash[line]);
      }
      else {
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
    }
    return chars
  }

  var chars1 = diff_linesToCharsMunge_(text1);
  var chars2 = diff_linesToCharsMunge_(text2);
  return {chars1: chars1, chars2: chars2, lineArray: lineArray}
};

/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {!Array.<string>} lineArray Array of unique strings.
 * @private
 */
diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
  for (var x = 0; x < diffs.length; x++) {
    var chars = diffs[x][1];
    var text = [];
    for (var y = 0; y < chars.length; y++) {
      text[y] = lineArray[chars.charCodeAt(y)];
    }
    diffs[x][1] = text.join('');
  }
};

/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (
      text1.substring(pointerstart, pointermid) ==
      text2.substring(pointerstart, pointermid)
    ) {
      pointermin = pointermid;
      pointerstart = pointermin;
    }
    else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid
};

/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
  // Quick check for common null cases.
  if (
    !text1 ||
    !text2 ||
    text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)
  ) {
    return 0
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (
      text1.substring(text1.length - pointermid, text1.length - pointerend) ==
      text2.substring(text2.length - pointermid, text2.length - pointerend)
    ) {
      pointermin = pointermid;
      pointerend = pointermin;
    }
    else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid
};

/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  }
  else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best
    }
    length += found;
    if (
      found == 0 ||
      text1.substring(text_length - length) == text2.substring(0, length)
    ) {
      best = length;
      length++;
    }
  }
};

/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 * @private
 */
diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
  if (this.Diff_Timeout <= 0) {
    // Don't risk returning a non-optimal diff if we have unlimited time.
    return null
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null // Pointless.
  }
  var dmp = this; // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(
        longtext.substring(i),
        shorttext.substring(j)
      );
      var suffixLength = dmp.diff_commonSuffix(
        longtext.substring(0, i),
        shorttext.substring(0, j)
      );
      if (best_common.length < suffixLength + prefixLength) {
        best_common =
          shorttext.substring(j - suffixLength, j) +
          shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [
        best_longtext_a,
        best_longtext_b,
        best_shorttext_a,
        best_shorttext_b,
        best_common ]
    }
    else {
      return null
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(
    longtext,
    shorttext,
    Math.ceil(longtext.length / 4)
  );
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(
    longtext,
    shorttext,
    Math.ceil(longtext.length / 2)
  );
  var hm;
  if (!hm1 && !hm2) {
    return null
  }
  else if (!hm2) {
    hm = hm1;
  }
  else if (!hm1) {
    hm = hm2;
  }
  else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  }
  else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common]
};

/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
  var this$1 = this;

  var changes = false;
  var equalities = []; // Stack of indices where equalities are found.
  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0; // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {
      // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    }
    else {
      // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      }
      else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (
        lastequality &&
        lastequality.length <=
          Math.max(length_insertions1, length_deletions1) &&
        lastequality.length <= Math.max(length_insertions2, length_deletions2)
      ) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0, [
          DIFF_DELETE,
          lastequality ]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0; // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (
      diffs[pointer - 1][0] == DIFF_DELETE &&
      diffs[pointer][0] == DIFF_INSERT
    ) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = this$1.diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = this$1.diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (
          overlap_length1 >= deletion.length / 2 ||
          overlap_length1 >= insertion.length / 2
        ) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0, [
            DIFF_EQUAL,
            insertion.substring(0, overlap_length1) ]);
          diffs[pointer - 1][1] = deletion.substring(
            0,
            deletion.length - overlap_length1
          );
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      }
      else if (
        overlap_length2 >= deletion.length / 2 ||
        overlap_length2 >= insertion.length / 2
      ) {
        // Reverse overlap found.
        // Insert an equality and swap and trim the surrounding edits.
        diffs.splice(pointer, 0, [
          DIFF_EQUAL,
          deletion.substring(0, overlap_length2) ]);
        diffs[pointer - 1][0] = DIFF_INSERT;
        diffs[pointer - 1][1] = insertion.substring(
          0,
          insertion.length - overlap_length2
        );
        diffs[pointer + 1][0] = DIFF_DELETE;
        diffs[pointer + 1][1] = deletion.substring(overlap_length2);
        pointer++;
      }
      pointer++;
    }
    pointer++;
  }
};

/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
  var this$1 = this;

  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
    var whitespace1 =
      nonAlphaNumeric1 && char1.match(diff_match_patch.whitespaceRegex_);
    var whitespace2 =
      nonAlphaNumeric2 && char2.match(diff_match_patch.whitespaceRegex_);
    var lineBreak1 =
      whitespace1 && char1.match(diff_match_patch.linebreakRegex_);
    var lineBreak2 =
      whitespace2 && char2.match(diff_match_patch.linebreakRegex_);
    var blankLine1 =
      lineBreak1 && one.match(diff_match_patch.blanklineEndRegex_);
    var blankLine2 =
      lineBreak2 && two.match(diff_match_patch.blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5
    }
    else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4
    }
    else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3
    }
    else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2
    }
    else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1
    }
    return 0
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (
      diffs[pointer - 1][0] == DIFF_EQUAL &&
      diffs[pointer + 1][0] == DIFF_EQUAL
    ) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this$1.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore =
        diff_cleanupSemanticScore_(equality1, edit) +
        diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score =
          diff_cleanupSemanticScore_(equality1, edit) +
          diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        }
        else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        }
        else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
};

// Define some regex patterns for matching boundaries.
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
  var this$1 = this;

  var changes = false;
  var equalities = []; // Stack of indices where equalities are found.
  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0; // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {
      // Equality found.
      if (
        diffs[pointer][1].length < this$1.Diff_EditCost &&
        (post_ins || post_del)
      ) {
        // Candidate found.
        equalities[equalitiesLength++] = pointer;
        pre_ins = post_ins;
        pre_del = post_del;
        lastequality = diffs[pointer][1];
      }
      else {
        // Not a candidate, and can never become one.
        equalitiesLength = 0;
        lastequality = null;
      }
      post_ins = post_del = false;
    }
    else {
      // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      }
      else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (
        lastequality &&
        ((pre_ins && pre_del && post_ins && post_del) ||
          (lastequality.length < this$1.Diff_EditCost / 2 &&
            pre_ins + pre_del + post_ins + post_del == 3))
      ) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0, [
          DIFF_DELETE,
          lastequality ]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--; // Throw away the equality we just deleted;
        lastequality = null;
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalitiesLength = 0;
        }
        else {
          equalitiesLength--; // Throw away the previous equality.
          pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};

/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
  var this$1 = this;

  diffs.push([DIFF_EQUAL, '']); // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = this$1.diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if (
                pointer - count_delete - count_insert > 0 &&
                diffs[pointer - count_delete - count_insert - 1][0] ==
                  DIFF_EQUAL
              ) {
                diffs[
                  pointer - count_delete - count_insert - 1
                ][1] += text_insert.substring(0, commonlength);
              }
              else {
                diffs.splice(0, 0, [
                  DIFF_EQUAL,
                  text_insert.substring(0, commonlength) ]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = this$1.diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] =
                text_insert.substring(text_insert.length - commonlength) +
                diffs[pointer][1];
              text_insert = text_insert.substring(
                0,
                text_insert.length - commonlength
              );
              text_delete = text_delete.substring(
                0,
                text_delete.length - commonlength
              );
            }
          }
          // Delete the offending records and add the merged ones.
          if (count_delete === 0) {
            diffs.splice(pointer - count_insert, count_delete + count_insert, [
              DIFF_INSERT,
              text_insert ]);
          }
          else if (count_insert === 0) {
            diffs.splice(pointer - count_delete, count_delete + count_insert, [
              DIFF_DELETE,
              text_delete ]);
          }
          else {
            diffs.splice(
              pointer - count_delete - count_insert,
              count_delete + count_insert,
              [DIFF_DELETE, text_delete],
              [DIFF_INSERT, text_insert]
            );
          }
          pointer =
            pointer -
            count_delete -
            count_insert +
            (count_delete ? 1 : 0) +
            (count_insert ? 1 : 0) +
            1;
        }
        else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        }
        else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop(); // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (
      diffs[pointer - 1][0] == DIFF_EQUAL &&
      diffs[pointer + 1][0] == DIFF_EQUAL
    ) {
      // This is a single edit surrounded by equalities.
      if (
        diffs[pointer][1].substring(
          diffs[pointer][1].length - diffs[pointer - 1][1].length
        ) == diffs[pointer - 1][1]
      ) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] =
          diffs[pointer - 1][1] +
          diffs[pointer][1].substring(
            0,
            diffs[pointer][1].length - diffs[pointer - 1][1].length
          );
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      }
      else if (
        diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
        diffs[pointer + 1][1]
      ) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
          diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
          diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};

/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {number} loc Location within text1.
 * @return {number} Location within text2.
 */
diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {
      // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {
      // Overshot the location.
      break
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1)
};

/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
  var html = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_para = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0]; // Operation (insert, delete, equal)
    var data = diffs[x][1]; // Text of change.
    var text = data
      .replace(pattern_amp, '&amp;')
      .replace(pattern_lt, '&lt;')
      .replace(pattern_gt, '&gt;')
      .replace(pattern_para, '&para;<br>');
    switch (op) {
      case DIFF_INSERT:
        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
        break
      case DIFF_DELETE:
        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
        break
      case DIFF_EQUAL:
        html[x] = '<span>' + text + '</span>';
        break
    }
  }
  return html.join('')
};

/**
 * Compute and return the source text (all equalities and deletions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Source text.
 */
diff_match_patch.prototype.diff_text1 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('')
};

/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Destination text.
 */
diff_match_patch.prototype.diff_text2 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('')
};

/**
 * Compute the Levenshtein distance; the number of inserted, deleted or
 * substituted characters.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {number} Number of changes.
 */
diff_match_patch.prototype.diff_levenshtein = function(diffs) {
  var levenshtein = 0;
  var insertions = 0;
  var deletions = 0;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];
    var data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break
      case DIFF_DELETE:
        deletions += data.length;
        break
      case DIFF_EQUAL:
        // A deletion and an insertion is one substitution.
        levenshtein += Math.max(insertions, deletions);
        insertions = 0;
        deletions = 0;
        break
    }
  }
  levenshtein += Math.max(insertions, deletions);
  return levenshtein
};

/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Delta text.
 */
diff_match_patch.prototype.diff_toDelta = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case DIFF_INSERT:
        text[x] = '+' + encodeURI(diffs[x][1]);
        break
      case DIFF_DELETE:
        text[x] = '-' + diffs[x][1].length;
        break
      case DIFF_EQUAL:
        text[x] = '=' + diffs[x][1].length;
        break
    }
  }
  return text.join('\t').replace(/%20/g, ' ')
};

/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {string} text1 Source string for the diff.
 * @param {string} delta Delta text.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
  var diffs = [];
  var diffsLength = 0; // Keeping our own length var is faster in JS.
  var pointer = 0; // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    // Each token begins with a one character parameter which specifies the
    // operation of this token (delete, insert, equality).
    var param = tokens[x].substring(1);
    switch (tokens[x].charAt(0)) {
      case '+':
        try {
          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
        }
        catch (ex) {
          // Malformed URI sequence.
          throw new Error('Illegal escape in diff_fromDelta: ' + param)
        }
        break
      case '-':
      // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          throw new Error('Invalid number in diff_fromDelta: ' + param)
        }
        var text = text1.substring(pointer, (pointer += n));
        if (tokens[x].charAt(0) == '=') {
          diffs[diffsLength++] = [DIFF_EQUAL, text];
        }
        else {
          diffs[diffsLength++] = [DIFF_DELETE, text];
        }
        break
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          throw new Error(
            'Invalid diff operation in diff_fromDelta: ' + tokens[x]
          )
        }
    }
  }
  if (pointer != text1.length) {
    throw new Error(
      'Delta length (' +
        pointer +
        ') does not equal source text length (' +
        text1.length +
        ').'
    )
  }
  return diffs
};

//  MATCH FUNCTIONS

/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 */
diff_match_patch.prototype.match_main = function(text, pattern, loc) {
  // Check for null inputs.
  if (text == null || pattern == null || loc == null) {
    throw new Error('Null input. (match_main)')
  }

  loc = Math.max(0, Math.min(loc, text.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0
  }
  else if (!text.length) {
    // Nothing to match.
    return -1
  }
  else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc
  }
  else {
    // Do a fuzzy compare.
    return this.match_bitap_(text, pattern, loc)
  }
};

/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 * @private
 */
diff_match_patch.prototype.match_bitap_ = function(text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    throw new Error('Pattern too long for this browser.')
  }

  // Initialise the alphabet.
  var s = this.match_alphabet_(pattern);

  var dmp = this; // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc and pattern through being a closure.
   * @param {number} e Number of errors in match.
   * @param {number} x Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length;
    var proximity = Math.abs(loc - x);
    if (!dmp.Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy
    }
    return accuracy + proximity / dmp.Match_Distance
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold = Math.min(
        match_bitapScore_(0, best_loc),
        score_threshold
      );
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      }
      else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {
        // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
      }
      else {
        // Subsequent passes: fuzzy match.
        rd[j] =
          (((rd[j + 1] << 1) | 1) & charMatch) |
          (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
          last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          }
          else {
            // Already passed loc, downhill from here on in.
            break
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break
    }
    last_rd = rd;
  }
  return best_loc
};

/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {string} pattern The text to encode.
 * @return {!Object} Hash of character locations.
 * @private
 */
diff_match_patch.prototype.match_alphabet_ = function(pattern) {
  var s = {};
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
  }
  return s
};

//  PATCH FUNCTIONS

/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
 * @param {string} text Source text.
 * @private
 */
diff_match_patch.prototype.patch_addContext_ = function(patch, text) {
  var this$1 = this;

  if (text.length == 0) {
    return
  }
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;

  // Look for the first and last matches of pattern in text.  If two different
  // matches are found, increase the pattern length.
  while (
    text.indexOf(pattern) != text.lastIndexOf(pattern) &&
    pattern.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin
  ) {
    padding += this$1.Patch_Margin;
    pattern = text.substring(
      patch.start2 - padding,
      patch.start2 + patch.length1 + padding
    );
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;

  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix) {
    patch.diffs.unshift([DIFF_EQUAL, prefix]);
  }
  // Add the suffix.
  var suffix = text.substring(
    patch.start2 + patch.length1,
    patch.start2 + patch.length1 + padding
  );
  if (suffix) {
    patch.diffs.push([DIFF_EQUAL, suffix]);
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};

/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * There are four ways to call this function, depending on what data is
 * available to the caller:
 * Method 1:
 * a = text1, b = text2
 * Method 2:
 * a = diffs
 * Method 3 (optimal):
 * a = text1, b = diffs
 * Method 4 (deprecated, use method 3):
 * a = text1, b = text2, c = diffs
 *
 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
 * Array of diff tuples for text1 to text2 (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
  var this$1 = this;

  var text1, diffs;
  if (
    typeof a === 'string' &&
    typeof opt_b === 'string' &&
    typeof opt_c === 'undefined'
  ) {
    // Method 1: text1, text2
    // Compute diffs from text1 and text2.
    text1 /** @type {string} */ = a;
    diffs = this.diff_main(text1 /** @type {string} */, opt_b, true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  }
  else if (
    a &&
    typeof a === 'object' &&
    typeof opt_b === 'undefined' &&
    typeof opt_c === 'undefined'
  ) {
    // Method 2: diffs
    // Compute text1 from diffs.
    diffs /** @type {!Array.<!diff_match_patch.Diff>} */ = a;
    text1 = this.diff_text1(diffs);
  }
  else if (
    typeof a === 'string' &&
    opt_b &&
    typeof opt_b === 'object' &&
    typeof opt_c === 'undefined'
  ) {
    // Method 3: text1, diffs
    text1 /** @type {string} */ = a;
    diffs /** @type {!Array.<!diff_match_patch.Diff>} */ = opt_b;
  }
  else if (
    typeof a === 'string' &&
    typeof opt_b === 'string' &&
    opt_c &&
    typeof opt_c === 'object'
  ) {
    // Method 4: text1, text2, diffs
    // text2 is not used.
    text1 /** @type {string} */ = a;
    diffs /** @type {!Array.<!diff_match_patch.Diff>} */ = opt_c;
  }
  else {
    throw new Error('Unknown call format to patch_make.')
  }

  if (diffs.length === 0) {
    return [] // Get rid of the null case.
  }
  var patches = [];
  var patch = new diff_match_patch.patch_obj();
  var patchDiffLength = 0; // Keeping our own length var is faster in JS.
  var char_count1 = 0; // Number of characters into the text1 string.
  var char_count2 = 0; // Number of characters into the text2 string.
  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
  // text2 (postpatch_text).  We recreate the patches one by one to determine
  // context info.
  var prepatch_text = text1;
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    switch (diff_type) {
      case DIFF_INSERT:
        patch.diffs[patchDiffLength++] = diffs[x];
        patch.length2 += diff_text.length;
        postpatch_text =
          postpatch_text.substring(0, char_count2) +
          diff_text +
          postpatch_text.substring(char_count2);
        break
      case DIFF_DELETE:
        patch.length1 += diff_text.length;
        patch.diffs[patchDiffLength++] = diffs[x];
        postpatch_text =
          postpatch_text.substring(0, char_count2) +
          postpatch_text.substring(char_count2 + diff_text.length);
        break
      case DIFF_EQUAL:
        if (
          diff_text.length <= 2 * this$1.Patch_Margin &&
          patchDiffLength &&
          diffs.length != x + 1
        ) {
          // Small equality inside a patch.
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length1 += diff_text.length;
          patch.length2 += diff_text.length;
        }
        else if (diff_text.length >= 2 * this$1.Patch_Margin) {
          // Time for a new patch.
          if (patchDiffLength) {
            this$1.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
            patch = new diff_match_patch.patch_obj();
            patchDiffLength = 0;
            // Unlike Unidiff, our patch lists have a rolling context.
            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
            // Update prepatch text & pos to reflect the application of the
            // just completed patch.
            prepatch_text = postpatch_text;
            char_count1 = char_count2;
          }
        }
        break
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patchDiffLength) {
    this.patch_addContext_(patch, prepatch_text);
    patches.push(patch);
  }

  return patches
};

/**
 * Given an array of patches, return another array that is identical.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_deepCopy = function(patches) {
  // Making deep copies is hard in JavaScript.
  var patchesCopy = [];
  for (var x = 0; x < patches.length; x++) {
    var patch = patches[x];
    var patchCopy = new diff_match_patch.patch_obj();
    patchCopy.diffs = [];
    for (var y = 0; y < patch.diffs.length; y++) {
      patchCopy.diffs[y] = patch.diffs[y].slice();
    }
    patchCopy.start1 = patch.start1;
    patchCopy.start2 = patch.start2;
    patchCopy.length1 = patch.length1;
    patchCopy.length2 = patch.length2;
    patchesCopy[x] = patchCopy;
  }
  return patchesCopy
};

/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @param {string} text Old text.
 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
 *      new text and an array of boolean values.
 */
diff_match_patch.prototype.patch_apply = function(patches, text) {
  var this$1 = this;

  if (patches.length == 0) {
    return [text, []]
  }

  // Deep copy the patches so that no changes are made to originals.
  patches = this.patch_deepCopy(patches);

  var nullPadding = this.patch_addPadding(patches);
  text = nullPadding + text + nullPadding;

  this.patch_splitMax(patches);
  // delta keeps track of the offset between the expected and actual location
  // of the previous patch.  If there are patches expected at positions 10 and
  // 20, but the first patch was found at 12, delta is 2 and the second patch
  // has an effective expected position of 22.
  var delta = 0;
  var results = [];
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this$1.diff_text1(patches[x].diffs);
    var start_loc;
    var end_loc = -1;
    if (text1.length > this$1.Match_MaxBits) {
      // patch_splitMax will only provide an oversized pattern in the case of
      // a monster delete.
      start_loc = this$1.match_main(
        text,
        text1.substring(0, this$1.Match_MaxBits),
        expected_loc
      );
      if (start_loc != -1) {
        end_loc = this$1.match_main(
          text,
          text1.substring(text1.length - this$1.Match_MaxBits),
          expected_loc + text1.length - this$1.Match_MaxBits
        );
        if (end_loc == -1 || start_loc >= end_loc) {
          // Can't find valid trailing context.  Drop this patch.
          start_loc = -1;
        }
      }
    }
    else {
      start_loc = this$1.match_main(text, text1, expected_loc);
    }
    if (start_loc == -1) {
      // No match found.  :(
      results[x] = false;
      // Subtract the delta for this failed patch from subsequent patches.
      delta -= patches[x].length2 - patches[x].length1;
    }
    else {
      // Found a match.  :)
      results[x] = true;
      delta = start_loc - expected_loc;
      var text2;
      if (end_loc == -1) {
        text2 = text.substring(start_loc, start_loc + text1.length);
      }
      else {
        text2 = text.substring(start_loc, end_loc + this$1.Match_MaxBits);
      }
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text =
          text.substring(0, start_loc) +
          this$1.diff_text2(patches[x].diffs) +
          text.substring(start_loc + text1.length);
      }
      else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indices.
        var diffs = this$1.diff_main(text1, text2, false);
        if (
          text1.length > this$1.Match_MaxBits &&
          this$1.diff_levenshtein(diffs) / text1.length >
            this$1.Patch_DeleteThreshold
        ) {
          // The end points match, but the content is unacceptably bad.
          results[x] = false;
        }
        else {
          this$1.diff_cleanupSemanticLossless(diffs);
          var index1 = 0;
          var index2;
          for (var y = 0; y < patches[x].diffs.length; y++) {
            var mod = patches[x].diffs[y];
            if (mod[0] !== DIFF_EQUAL) {
              index2 = this$1.diff_xIndex(diffs, index1);
            }
            if (mod[0] === DIFF_INSERT) {
              // Insertion
              text =
                text.substring(0, start_loc + index2) +
                mod[1] +
                text.substring(start_loc + index2);
            }
            else if (mod[0] === DIFF_DELETE) {
              // Deletion
              text =
                text.substring(0, start_loc + index2) +
                text.substring(
                  start_loc + this$1.diff_xIndex(diffs, index1 + mod[1].length)
                );
            }
            if (mod[0] !== DIFF_DELETE) {
              index1 += mod[1].length;
            }
          }
        }
      }
    }
  }
  // Strip the padding off.
  text = text.substring(nullPadding.length, text.length - nullPadding.length);
  return [text, results]
};

/**
 * Add some padding on text start and end so that edges can match something.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} The padding string added to each side.
 */
diff_match_patch.prototype.patch_addPadding = function(patches) {
  var paddingLength = this.Patch_Margin;
  var nullPadding = '';
  for (var x = 1; x <= paddingLength; x++) {
    nullPadding += String.fromCharCode(x);
  }

  // Bump all the patches forward.
  for (var x = 0; x < patches.length; x++) {
    patches[x].start1 += paddingLength;
    patches[x].start2 += paddingLength;
  }

  // Add some padding on start of first diff.
  var patch = patches[0];
  var diffs = patch.diffs;
  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.unshift([DIFF_EQUAL, nullPadding]);
    patch.start1 -= paddingLength; // Should be 0.
    patch.start2 -= paddingLength; // Should be 0.
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  }
  else if (paddingLength > diffs[0][1].length) {
    // Grow first equality.
    var extraLength = paddingLength - diffs[0][1].length;
    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
    patch.start1 -= extraLength;
    patch.start2 -= extraLength;
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  // Add some padding on end of last diff.
  patch = patches[patches.length - 1];
  diffs = patch.diffs;
  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.push([DIFF_EQUAL, nullPadding]);
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  }
  else if (paddingLength > diffs[diffs.length - 1][1].length) {
    // Grow last equality.
    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  return nullPadding
};

/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function(patches) {
  var this$1 = this;

  var patch_size = this.Match_MaxBits;
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patch_size) {
      continue
    }
    var bigpatch = patches[x];
    // Remove the big old patch.
    patches.splice(x--, 1);
    var start1 = bigpatch.start1;
    var start2 = bigpatch.start2;
    var precontext = '';
    while (bigpatch.diffs.length !== 0) {
      // Create one of several smaller patches.
      var patch = new diff_match_patch.patch_obj();
      var empty = true;
      patch.start1 = start1 - precontext.length;
      patch.start2 = start2 - precontext.length;
      if (precontext !== '') {
        patch.length1 = patch.length2 = precontext.length;
        patch.diffs.push([DIFF_EQUAL, precontext]);
      }
      while (
        bigpatch.diffs.length !== 0 &&
        patch.length1 < patch_size - this.Patch_Margin
      ) {
        var diff_type = bigpatch.diffs[0][0];
        var diff_text = bigpatch.diffs[0][1];
        if (diff_type === DIFF_INSERT) {
          // Insertions are harmless.
          patch.length2 += diff_text.length;
          start2 += diff_text.length;
          patch.diffs.push(bigpatch.diffs.shift());
          empty = false;
        }
        else if (
          diff_type === DIFF_DELETE &&
          patch.diffs.length == 1 &&
          patch.diffs[0][0] == DIFF_EQUAL &&
          diff_text.length > 2 * patch_size
        ) {
          // This is a large deletion.  Let it pass in one chunk.
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          empty = false;
          patch.diffs.push([diff_type, diff_text]);
          bigpatch.diffs.shift();
        }
        else {
          // Deletion or equality.  Only take as much as we can stomach.
          diff_text = diff_text.substring(
            0,
            patch_size - patch.length1 - this$1.Patch_Margin
          );
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          if (diff_type === DIFF_EQUAL) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
          }
          else {
            empty = false;
          }
          patch.diffs.push([diff_type, diff_text]);
          if (diff_text == bigpatch.diffs[0][1]) {
            bigpatch.diffs.shift();
          }
          else {
            bigpatch.diffs[0][1] = bigpatch.diffs[0][1].substring(
              diff_text.length
            );
          }
        }
      }
      // Compute the head context for the next patch.
      precontext = this$1.diff_text2(patch.diffs);
      precontext = precontext.substring(precontext.length - this$1.Patch_Margin);
      // Append the end context for this patch.
      var postcontext = this$1.diff_text1(bigpatch.diffs).substring(
        0,
        this$1.Patch_Margin
      );
      if (postcontext !== '') {
        patch.length1 += postcontext.length;
        patch.length2 += postcontext.length;
        if (
          patch.diffs.length !== 0 &&
          patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL
        ) {
          patch.diffs[patch.diffs.length - 1][1] += postcontext;
        }
        else {
          patch.diffs.push([DIFF_EQUAL, postcontext]);
        }
      }
      if (!empty) {
        patches.splice(++x, 0, patch);
      }
    }
  }
};

/**
 * Take a list of patches and return a textual representation.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function(patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text[x] = patches[x];
  }
  return text.join('')
};

/**
 * Parse a textual representation of patches and return a list of Patch objects.
 * @param {string} textline Text representation of patches.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.patch_fromText = function(textline) {
  var patches = [];
  if (!textline) {
    return patches
  }
  var text = textline.split('\n');
  var textPointer = 0;
  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
  while (textPointer < text.length) {
    var m = text[textPointer].match(patchHeader);
    if (!m) {
      throw new Error('Invalid patch string: ' + text[textPointer])
    }
    var patch = new diff_match_patch.patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    }
    else if (m[2] == '0') {
      patch.length1 = 0;
    }
    else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    }
    else if (m[4] == '0') {
      patch.length2 = 0;
    }
    else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    textPointer++;

    while (textPointer < text.length) {
      var sign = text[textPointer].charAt(0);
      try {
        var line = decodeURI(text[textPointer].substring(1));
      }
      catch (ex) {
        // Malformed URI sequence.
        throw new Error('Illegal escape in patch_fromText: ' + line)
      }
      if (sign == '-') {
        // Deletion.
        patch.diffs.push([DIFF_DELETE, line]);
      }
      else if (sign == '+') {
        // Insertion.
        patch.diffs.push([DIFF_INSERT, line]);
      }
      else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push([DIFF_EQUAL, line]);
      }
      else if (sign == '@') {
        // Start of next patch.
        break
      }
      else if (sign === '') {
        // Blank line?  Whatever.
      }
      else {
        // WTF?
        throw new Error('Invalid patch mode "' + sign + '" in: ' + line)
      }
      textPointer++;
    }
  }
  return patches
};

/**
 * Class representing one patch operation.
 * @constructor
 */
diff_match_patch.patch_obj = function() {
  /** @type {!Array.<!diff_match_patch.Diff>} */
  this.diffs = [];
  /** @type {?number} */
  this.start1 = null;
  /** @type {?number} */
  this.start2 = null;
  /** @type {number} */
  this.length1 = 0;
  /** @type {number} */
  this.length2 = 0;
};

/**
 * Emmulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indicies are printed as 1-based, not 0-based.
 * @return {string} The GNU diff string.
 */
diff_match_patch.patch_obj.prototype.toString = function() {
  var this$1 = this;

  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  }
  else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  }
  else {
    coords1 = this.start1 + 1 + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  }
  else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  }
  else {
    coords2 = this.start2 + 1 + ',' + this.length2;
  }
  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
  var op;
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch (this$1.diffs[x][0]) {
      case DIFF_INSERT:
        op = '+';
        break
      case DIFF_DELETE:
        op = '-';
        break
      case DIFF_EQUAL:
        op = ' ';
        break
    }
    text[x + 1] = op + encodeURI(this$1.diffs[x][1]) + '\n';
  }
  return text.join('').replace(/%20/g, ' ')
};

// The following export code was added by @ForbesLindesay
var index$22 = diff_match_patch;
var diff_match_patch_1 = diff_match_patch;
var DIFF_DELETE_1 = DIFF_DELETE;
var DIFF_INSERT_1 = DIFF_INSERT;
var DIFF_EQUAL_1 = DIFF_EQUAL;

index$22.diff_match_patch = diff_match_patch_1;
index$22.DIFF_DELETE = DIFF_DELETE_1;
index$22.DIFF_INSERT = DIFF_INSERT_1;
index$22.DIFF_EQUAL = DIFF_EQUAL_1;

// https://github.com/sindresorhus/indent-string/blob/master/index.js
var index$24 = function indentString(str, count, indent) {
  indent = indent === undefined ? ' ' : indent;
  count = count === undefined ? 1 : count;

  if (typeof str !== 'string') {
    throw new TypeError(
      `Expected \`input\` to be a \`string\`, got \`${typeof str}\``
    )
  }

  if (typeof count !== 'number') {
    throw new TypeError(
      `Expected \`count\` to be a \`number\`, got \`${typeof count}\``
    )
  }

  if (typeof indent !== 'string') {
    throw new TypeError(
      `Expected \`indent\` to be a \`string\`, got \`${typeof indent}\``
    )
  }

  if (count === 0) {
    return str
  }

  return str.replace(/^(?!\s*$)/gm, indent.repeat(count))
};

var index$14 = createCommonjsModule(function (module, exports) {
// https://github.com/avajs/ava/blob/146c3e25df31d39165b4ad99f4d523e7806c30fb/lib/format-assert-error.js#L6






function formatValue(value, options) {
  return index$2(
    value,
    Object.assign(
      {
        callToJSON: false,
        highlight: true,
      },
      options
    )
  )
}

var cleanUp = function (line) {
  if (line[0] === '+') {
    return `${index$16.green('+')} ${line.slice(1)}`
  }

  if (line[0] === '-') {
    return `${index$16.red('-')} ${line.slice(1)}`
  }

  if (line.match(/@@/)) {
    return null
  }

  if (line.match(/\\ No newline/)) {
    return null
  }

  return ` ${line}`
};

var getType = function (value) {
  var type = typeof value;
  if (type === 'object') {
    if (type === null) {
      return 'null'
    }
    if (Array.isArray(value)) {
      return 'array'
    }
  }
  return type
};

function formatDiff(actual, expected, hack) {
  if ( hack === void 0 ) hack = false;

  var actualType = getType(actual);
  var expectedType = getType(expected);
  if (actualType !== expectedType) {
    return null
  }

  if (actualType === 'array' || actualType === 'object') {
    var formatted = index$20
      .createPatch('string', formatValue(actual), formatValue(expected))
      .split('\n')
      .slice(4)
      .map(cleanUp)
      .filter(Boolean)
      .join('\n')
      .trimRight();

    return formatted
    return {label: 'Difference:', formatted: formatted}
  }

  if (actualType === 'string') {
    var formatted$1 = new index$22()
      .diff_main(
        formatValue(actual, {highlight: false}),
        formatValue(expected, {highlight: false})
      )
      .map(function (part) {
        if (part[0] === 1) {
          if (hack === false) { return index$16.bgGreen.black(part[1]) }
          var noSpaces = part[1].replace(/[\s]/gim, '');
          // const eh = noSpaces
          // console.log({eh})
          var diff1 = index$16.bgGreen.black(noSpaces);
          var first = true;
          return part[1].replace(/[\S]/gim, function (match) {
            if (first === true) {
              first = false;
              return diff1
            }
            return ''
          })
        }

        if (part[0] === -1) {
          return index$16.bgRed.black(part[1])
        }

        return index$16.blue(part[1])
      })
      .join('')
      .trimRight();

    return formatted$1
    return {label: 'Difference:', formatted: formatted$1}
  }

  return null
}

function formatWithLabel(label, value) {
  return {label: label, formatted: formatValue(value)}
}

function formatSerializedError(error) {
  if (error.statements.length === 0 && error.values.length === 0) {
    return null
  }

  var result = error.values
    .map(
      function (value) { return `${value.label}\n\n${index$24(value.formatted, 2).trimRight()}\n`; }
    )
    .join('\n');

  if (error.statements.length > 0) {
    if (error.values.length > 0) {
      result += '\n';
    }

    result += error.statements
      .map(
        function (statement) { return `${statement[0]}\n${index$16.grey('=>')} ${statement[1]}\n`; }
      )
      .join('\n');
  }

  return result
}

formatDiff.formatSerializedError = formatSerializedError;
formatDiff.formatWithLabel = formatWithLabel;
formatDiff.formatDiff = formatDiff;
formatDiff.formatValue = formatValue;

function diffs(current, last, hack) {
  if ( hack === void 0 ) hack = false;

  // obj, hack = true
  // const state = obj || this.getSnapshot('ast', 2)
  // const last = this.getSnapshot('ast')

  // const prettyState = indentString(state).replace(/[']/gim, '')
  // const prettyLast = indentString(last).replace(/[']/gim, '')
  // let prettyState = state.replace(/[']/gim, '')
  // let prettyLast = last.replace(/[']/gim, '')
  // prettyState = indentString(state).replace(/[']/gim, '').replace(',', '\n')
  // prettyLast = indentString(last).replace(/[']/gim, '').replace(',', '\n')

  // require('fliplog').quick(generate(state))
  // require('fliplog').quick({state, last, t: this})
  return formatDiff(current, last, hack)
}

diffs.diffs = diffs;
diffs.diff = diffs;
exports = module.exports = diffs;
});

var index$26 = ansiHTML;

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/;

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888',
};
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey',
};
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>', // delete
};
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>', // reset delete
};[0, 21, 22, 27, 28, 39, 49].forEach(function(n) {
  _closeTags[n] = '</span>';
});

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML(text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = [];
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function(match, seq) {
    var ot = _openTags[seq];
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) {
        // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop();
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq);
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq];
    if (ct) {
      // Pop sequence
      ansiCodes.pop();
      return ct
    }
    return ''
  });

  // Make sure tags are closed.
  var l = ansiCodes.length;
  l > 0 && (ret += Array(l + 1).join('</span>'));

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function(colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {};
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null;
    if (!hex) {
      _finalColors[key] = _defColors[key];
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex];
      }
      if (
        !Array.isArray(hex) ||
        hex.length === 0 ||
        hex.some(function(h) {
          return typeof h !== 'string'
        })
      ) {
        throw new Error(
          'The value of `' +
            key +
            '` property must be an Array and each item could only be a hex string, e.g.: FF0000'
        )
      }
      var defHexColor = _defColors[key];
      if (!hex[0]) {
        hex[0] = defHexColor[0];
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]];
        hex.push(defHexColor[1]);
      }

      hex = hex.slice(0, 2);
    } else if (typeof hex !== 'string') {
      throw new Error(
        'The value of `' + key + '` property must be a hex string, e.g.: FF0000'
      )
    }
    _finalColors[key] = hex;
  }
  _setTags(_finalColors);
};

/**
 * Reset colors.
 */
ansiHTML.reset = function() {
  _setTags(_defColors);
};

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {};

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function() {
      return _openTags
    },
  });
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function() {
      return _closeTags
    },
  });
} else {
  ansiHTML.tags.open = _openTags;
  ansiHTML.tags.close = _closeTags;
}

function _setTags(colors) {
  // reset all
  _openTags['0'] =
    'font-weight:normal;opacity:1;color:#' +
    colors.reset[0] +
    ';background:#' +
    colors.reset[1];
  // inverse
  _openTags['7'] =
    'color:#' + colors.reset[1] + ';background:#' + colors.reset[0];
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey;

  for (var code in _styles) {
    var color = _styles[code];
    var oriColor = colors[color] || '000';
    _openTags[code] = 'color:#' + oriColor;
    code = parseInt(code);
    _openTags[(code + 10).toString()] = 'background:#' + oriColor;
  }
}

ansiHTML.reset();

var index$28 = function styledConsoleLog() {
  var arguments$1 = arguments;

  var argArray = [];

  if (arguments.length) {
    var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
    var endTagRe = /<\/span>/gi;

    var reResultArray;
    argArray.push(
      arguments[0].replace(startTagRe, '%c').replace(endTagRe, '%c')
    );
    while ((reResultArray = startTagRe.exec(arguments[0]))) {
      argArray.push(reResultArray[2]);
      argArray.push('');
    }

    // pass through subsequent args since chrome dev tools does not (yet) support console.log styling of the following form: console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
    for (var j = 1; j < arguments.length; j++) {
      argArray.push(arguments$1[j]);
    }
  }

  console.log.apply(console, argArray);
};

var capture = function capturePlugin(ref) {
  var shh = ref.shh;

  return {

    /**
     * @tutorial https://gist.github.com/pguillory/729616#gistcomment-332391
     * @param  {any} data
     * @param  {any} fileDescriptor not implemented
     * @return {FlipLog} @chainable
     */
    saveLog: function saveLog(data, fileDescriptor) {
      this.fileDescriptor = fileDescriptor;
      this.savedLog.push(data);
      return this
    },

    /**
     * @tutorial https://github.com/fliphub/fliplog#-silencing
     * @desc by-reference mutates object property to silence all
     * @return {FlipLog} @chainable
     */
    shush: function shush() {
      shh.shushed = true;
      return this
    },

    /**
     * @see FlipLog.shush
     * @desc inverse of shush
     * @return {FlipLog} @chainable
     */
    unshush: function unshush() {
      shh.shushed = false;
      return this
    },

    /**
     * @desc captures all stdout content
     * @tutorial https://github.com/fliphub/fliplog#capture-all
     * @param  {Boolean} [output=false]
     * @return {FlipLog} @chainable
     */
    startCapturing: function startCapturing(output) {
      if ( output === void 0 ) output = false;

      var saveLog = this.saveLog.bind(this);
      this.stdoutWriteRef = process.stdout.write;
      process.stdout.write = (function(write) {
        return function(string, encoding, fileDescriptor) {
          saveLog(string, fileDescriptor);
          // write.apply(process.stdout, arguments)
        }
      })(process.stdout.write);
      return this
    },

    /**
     * @desc restores original stdout
     * @see FlipLog.startCapturing
     * @return {FlipLog} @chainable
     */
    stopCapturing: function stopCapturing() {
      process.stdout.write = this.stdoutWriteRef;
      return this
    },
  }
};

var chalk$2 = {
  /**
   * @since 0.0.1
   * @see chalk
   * @param  {string} color
   * @return {FlipLog}
   */
  color: function color(color$1) {
    var clr = color$1;

    if (this.has('color') === true) {
      clr = this.get('color') + '.' + color$1;
    }

    return this.set('color', clr)
  },

  /**
   * @since 0.2.2
   * @desc pass in text, return it colored
   * @param {string} msg
   * @param {string} [color=null]
   * @return {string} highlighted
   */
  colored: function colored(msg, color) {
    if ( color === void 0 ) color = null;

    if (color !== null) { this.color(color); }
    var colored = this.text(msg).logText();
    this.reset();
    return colored
  },

  /**
   * @since 0.2.1
   * @see chalk
   * @return {Object} chalk
   */
  chalk: function chalk() {
    return this.requirePkg('chalk')
  },
};

var diff$1 = {
  reset: function reset() {
    this.delete('diffs');

    return this
  },

  /**
   * @desc
   *  take in 2 things to diff
   *  can pass in a diff1 and then call diff again to diff again
   *
   * @author https://github.com/challenger532 for this
   * @return {FlipLog} @chainable
   */
  diff: function diff() {
    var this$1 = this;

    var clone = this.requirePkg('lodash.clonedeep'); // eslint-disable-line

    if (this.has('diffs') === false) {
      this.set('diffs', []);
    }

    var diffs = this.get('diffs');
    var args = Array.from(arguments).map(function (arg) { return clone(arg); });

    this.set('diffs', diffs.concat(args));

    this.formatter(function () {
      var differ = this$1.requirePkg('diffs');
      var result = differ.apply(void 0, this$1.get('diffs'));

      // console.log('result?', result)
      if (this$1.has('text') === false) {
        this$1.bold('diff:\n\n');
      }

      return result
    });

    return this
  },

  /**
   * @depreciated @depricated v0.3.0
   * @see FlipLog.diff
   * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#%EF%B8%8F-diff
   * @return {string} table of diffs
   */
  diffs: function diffs() {
    var differ = this.requirePkg('diffs');
    var result = differ.apply(void 0, this.get('diffs'));

    // console.log('result?', result)
    if (this.has('text') === false) {
      this.bold('diff:\n\n');
    }
    return this.data(result)
  },
};

// https://github.com/sindresorhus/matcher/blob/master/index.js
var toArr = function (x) { return [].concat(x); };
var escapeStringRegexp$1 = function (str) { return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'); };
var toRegExp = function (str) { return escapeStringRegexp$1(str).replace(/\\\*/g, '.*'); };
var isFunction = function (x) { return typeof x === 'function' || x instanceof Function; };
var isRegExp = function (x) { return x instanceof RegExp; };

// @TODO: default strings without slashes to node_modules, if that is best
var reCache = new Map();

function map(patterns, shouldNegate, beginningEnd) {
  if ( beginningEnd === void 0 ) beginningEnd = false;

  return toArr(patterns).map(function (pattern) { return makeRe(pattern, shouldNegate, beginningEnd); }
  )
}
function makeRe(pattern, shouldNegate, beginningEnd) {
  if ( beginningEnd === void 0 ) beginningEnd = false;

  var cacheKey = pattern + shouldNegate;
  if (reCache.has(cacheKey)) { return reCache.get(cacheKey) }

  // @NOTE: added for function callbacks
  if (isFunction(pattern) && !pattern.test) { pattern.test = pattern; }
  if (isFunction(pattern) || isRegExp(pattern)) { return pattern }

  var negated = pattern[0] === '!';
  if (negated) { pattern = pattern.slice(1); }

  pattern = toRegExp(pattern);

  if (negated && shouldNegate) { pattern = `(?!${pattern})`; }
  var re = new RegExp(`${pattern}`, 'i');
  if (beginningEnd === true) { re = new RegExp(`^${pattern}$`, 'i'); }

  re.negated = negated;
  reCache.set(cacheKey, re);

  return re
}

var matcher$1 = function (inputs, patterns) {
  if (!(Array.isArray(inputs) && Array.isArray(patterns))) {
    throw new TypeError(
      `Expected two arrays, got ${typeof inputs} ${typeof patterns}`
    )
  }

  if (patterns.length === 0) { return inputs }
  var firstNegated = patterns[0][0] === '!';
  var matchesToReturn = [];
  patterns = patterns.map(function (x) { return makeRe(x, false); });

  inputs.forEach(function (input) {
    // If first pattern is negated we include everything to match user expectation
    var matches = firstNegated;

    // TODO: Figure out why tests fail when I use a for-of loop here
    for (var j = 0; j < patterns.length; j++) {
      if (patterns[j].test(input)) {
        matches = !patterns[j].negated;
      }
    }

    if (matches) { matchesToReturn.push(input); }
  });

  return matchesToReturn
};

var isMatch = function (input, pattern, negate, beginningEnd) {
    if ( negate === void 0 ) negate = false;
    if ( beginningEnd === void 0 ) beginningEnd = false;

    return map(pattern, negate, beginningEnd).map(function (fn) { return fn.test(input); });
};

var isMatchCurry = function (pattern, negate, beginningEnd) {
  if ( negate === void 0 ) negate = false;
  if ( beginningEnd === void 0 ) beginningEnd = false;

  return function (input) { return matcher$1(input, map(pattern, negate, beginningEnd)); };
};

var matcher_1 = matcher$1;
var isMatch_1 = isMatch;
var isMatchCurry_1 = isMatchCurry;
var makeRe_1 = makeRe;
var matcher_2 = matcher$1;
var map_1 = map;

matcher_1.isMatch = isMatch_1;
matcher_1.isMatchCurry = isMatchCurry_1;
matcher_1.makeRe = makeRe_1;
matcher_1.matcher = matcher_2;
matcher_1.map = map_1;

var index$30 = 0;
var debugs = {};

function tagPasses(tags, filter, not) {
  if (tags.length === 0) { return true }

  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    var includes = filter.includes(tag);
    debugs[index$30].tags.push({tag: tag, i: i, not: not, includes: includes});

    if (not && includes) { return false }
    // @TODO: later if only whitelisting...
    if (includes) { return true }
  }

  return true
}

// pass in tags & instance here just for fn filter
function shouldFilter$1(ref) {
  var filters = ref.filters;
  var tags = ref.tags;
  var checkTags = ref.checkTags;
  var instance = ref.instance;

  var hasStarFilter = filters.includes('*');
  var hasSilentFilter = filters.includes('silent');
  debugs[index$30].filters.push({hasStarFilter: hasStarFilter, hasSilentFilter: hasSilentFilter});

  if (hasStarFilter) { return false }
  if (hasSilentFilter) { return true }

  var shouldBeFiltered = false;

  for (var i = 0; i < filters.length; i++) {
    var filter = filters[i];

    if (typeof filter === 'function') {
      // because filter `allows` things through
      // whereas we are checking if it *should* be filtered OUT
      // and so it needs to return `false` to say it should be allowed :s
      // whitelist vs blacklist
      shouldBeFiltered = filter(
        Object.assign(instance.entries(), {
          tags: tags,
          checkTags: checkTags,
          debugs: debugs,
          index: index$30,
          filters: filters,
        })
      );
      if (shouldBeFiltered === true) { shouldBeFiltered = false; }
      else if (shouldBeFiltered === false) { shouldBeFiltered = true; }
      else if (shouldBeFiltered === null) { shouldBeFiltered = true; }
      return shouldBeFiltered
    }

    var not = filter.includes('!');
    var shouldFilterTag = false;

    // @TODO: later, for arithmetics
    // if (filter.includes('&')) {
    //   // if it has `&` combine the filters
    //   shouldFilterTag = !filter
    //     .split('&')
    //     .map((tag) => tagPasses(filter, not))
    //     .filter((tag) => tag === false)
    //     .length === filter.split('&').length
    // }
    // else {
    shouldFilterTag = checkTags(filter, not);

    debugs[index$30].filters.push({not: not, filter: filter, shouldFilterTag: shouldFilterTag});

    if (shouldFilterTag === false) { return true }
  }

  return shouldBeFiltered
}

/**
 * @param  {Array<string>} filters filters to check
 * @param  {Array<string>} tags tags to check
 * @param  {Log} instance - fliplog instance
 * @return {boolean}
 */
function tagAndFilters(ref) {
  var filters = ref.filters;
  var tags = ref.tags;
  var instance = ref.instance;

  // setup debug values for later
  index$30 = index$30 + 1;
  debugs[index$30] = {
    filters: [],
    tags: [],
  };

  // bind the tags to the first arg
  var checkTags = tagPasses.bind(null, tags);

  // check whether we should filter
  var should = shouldFilter$1({checkTags: checkTags, filters: filters, tags: tags, instance: instance});
  // console.log(inspector(filters))
  return should
}

tagAndFilters.debugs = debugs;

var filter$2 = tagAndFilters;

var toArr$1 = function toArr(ar) {
  if (!ar) { return [] }
  if (Array.isArray(ar)) { return ar }
  if (typeof ar === 'string') { return ar.includes(',') ? ar.split(',') : [ar] }
  if (ar instanceof Set || ar instanceof Map || ar.values) {
    var vals = [];
    ar.values().forEach(function (v) { return vals.push(v); });
    return vals
  }

  return [ar]
};

// module.exports.slice = Array.prototype.slice.call.bind(Array.prototype.slice)

var toarr;
var shouldFilter;
var matcher;

var isNumber = function (obj) { return Object.prototype.toString.call(obj) === '[object Number]' ||
  (/^0x[0-9a-f]+$/i).test(obj) ||
  (/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/).test(obj); };

var stripSpaces = function (str) { return str.replace(/([\s\t\n\r ])*/gim, ''); };
var stripSymbols = function (str) { return str.replace(/[><=]/gim, ''); };
var levelFilterRegExp = /[><=]\d+/;
var isLogLevel = function (str) { return str && levelFilterRegExp.test(str); };

var levelFactory = function (filter) {
  var num = stripSymbols(filter);
  if (filter.includes('<=')) { return function (lv) { return lv <= num; } }
  else if (filter.includes('>=')) { return function (lv) { return lv >= num; } }
  else if (filter.includes('>')) { return function (lv) { return lv > num; } }
  else if (filter.includes('<')) { return function (lv) { return lv < num; } }
  else if (filter.includes('=')) { return function (lv) { return lv == num; } }
  else
    { return function (lv) {
      throw new Error('invalid filter')
    } }
};

var filterLevelFactory = function (filter) {
  var levelMatcher = levelFactory(filter);

  // @TODO: add a way to enforce level tagging
  // @TODO: if ONLY checking level, could be more optimized
  // @TODO: unsure if level needs to be diff from tags...
  return function (entries) {
    // spread, add safety
    var level = entries.level;
    var tags = entries.tags;
    var namespace = entries.namespace;
    var nums = tags || [];

    // merge level, filter numbers
    if (level !== undefined) { nums.push(level); }
    nums = nums.filter(isNumber);

    // console.log({level, tags, nums})

    if (nums.length) {
      var passing = nums.filter(levelMatcher);
      // console.log({passing})
      if (!passing.length) { return false }
    }

    return true
  }
};

var filterMatcherFactory = function (filter) {
  if (!matcher) { matcher = matcher_1; }

  var matchFn = matcher.map(filter);
  return function (entries) {
    var level = entries.level;
    var tags = entries.tags;
    var namespace = entries.namespace;
    var input = tags || [];
    if (level !== undefined) { input.push(level); }

    var matches = matcher(input, matchFn);
    // @TODO: reason for matching internalActivityLog here

    if (matches.length === 0) { return false }
    return true
  }
};

// could also be named abstractFilterFactory
var filterFactory = function (filter) {
  if (typeof filter === 'string') {
    // console.log('is string')
    var stripped = stripSpaces(filter);
    // console.log({stripped})
    if (isLogLevel(stripped)) {
      return filterLevelFactory(stripSpaces(filter))
    }
  }

  // just using a single function, allow full access?
  if (typeof filter === 'function') {
    return filter
  }

  return filterMatcherFactory(filter)

  // return isMatchCurry(toarr(filter))
};

// https://github.com/visionmedia/debug#wildcards
// DEBUG=''

var filter = function (chain) {
  chain.lvl = function (_level) { return chain.level(_level); };
  chain.tag = function (_tags) { return chain.tags(_tags); };
  chain.ns = function (_namespace) { return chain.namespace(_namespace); };
  chain.set('filterer', function (args) {
    if (!shouldFilter) { shouldFilter = filter$2; }
    return shouldFilter(args)
  });

  var plugin = {
    reset: function reset() {
      this.delete('tags');
    },

    /**
     * @TODO: filter with prop like
     * .filterWith('prop', prop => )...
     *
     * @TODO: this and weights
     * @see weights
     * @desc set levels for namespaces
     * @param {Object} namespaces
     * @type {FlipLog} @chainable
     */
    // namespaces(namespaces) {},
    // namespace(namespace) {
    //   return this.set('namespace', namespace)
    // },

    /**
     * @alias lvl
     * @since 0.4.0
     * @param  {number} level
     * @return {[type]}
     */
    level: function level(level$1) {
      return this.set('level', level$1).tags(level$1)
    },

    /**
     * @TODO
     * - [ ] wildcard, best using [] instead
     * - [ ] use debugFor.js
     * - [ ] enableTags, disableTags
     * - [ ] handle keys here...
     *
     *  {boolean} [verbose=true] if disabled & only a fn is passed as first param, only tags are returned
     *
     * @since 0.1.0
     * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#-filtering
     * @param {string | Array<string> | Function} filters filter white or black flags
     * @return {FlipLog} @chainable
     */
    filter: function filter(filters) {
      toarr = toarr ? toarr : toArr$1;
      var filter = toarr(filters);

      // @NOTE: keeps some maintainability with the old since desc is string, arr, of fn
      if (filter.length <= 1) {
        filter = filterFactory(filters);
      }
      
      var merged = toarr(filter).concat(this.get('filter') || []);

      // would need a double tap...
      // this.tap('filter', existing => existing || [])
      return this.set('filter', merged)
    },

    /**
     * @alias tag
     * @since 0.1.0
     * @desc tag the log for filtering when needed
     * @param {string | Array<string>} names tags to use
     * @return {FlipLog} @chainable
     */
    tags: function tags(names) {
      toarr = toarr ? toarr : toArr$1;
      var tags = this.get('tags') || [];
      var updated = tags.concat(toarr(names));
      return this.set('tags', updated)
    },

    /**
     * @protected
     * @since 0.1.0
     * @desc check if the filters allow the tags
     * @return {FlipLog} @chainable
     */
    _filter: function _filter() {
      var filterer = this.get('filterer');
      var tags = this.get('tags') || [];
      var filters = this.get('filter') || [];
      var should = filterer.call(this, {filters: filters, tags: tags, instance: this});
      if (should) { return this.silent(true) }
      return this
      // console.log(tags, filters)
    },
  };

  return plugin
};

var formatter = {
  reset: function reset() {
    this.delete('formatter');
    return this
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#-formatter
   * @param  {Function} [cb] callback with data, returns formatted data
   * @return {FlipLog} @chainable
   */
  formatter: function formatter(cb) {
    var this$1 = this;

    if (!cb)
      { cb = function (arg) {
        if (arg && typeof arg === 'object') {
          Object.keys(arg).forEach(function (key) {
            if (typeof arg[key] === 'string') {
              arg[key] = arg[key].replace('', '');
            }
            else if (Array.isArray(arg[key])) {
              arg[key] = arg[key].map(function (a) { return cb(a); });
            }
          });
        }
        return arg
      }; }

    // merge in formatters
    // if already array, append
    // otherwise, make an array
    if (this.has('formatter') === true) {
      var formatter = this.get('formatter');

      if (Array.isArray(formatter.fns)) {
        formatter.fns.push(cb);
        return this.set('formatter', formatter)
      }
      else {
        // go through them
        // if they return null, ignore it
        var formatterFn = function (arg) {
          var formatters = this$1.get('formatter').fns;
          var data = arg;
          formatters.forEach(function (fmtr) {
            data = fmtr(arg);
            if (data === null) { data = arg; }
          });
          return data
        };
        formatterFn.fns = [cb];

        return this.set('formatter', formatterFn)
      }
    }
    else {
      this.set('formatter', cb);
    }

    return this
  },
};

// @TODO use build script with .replace for each
var isNode =
  typeof process === 'object' &&
  typeof false === 'object' &&
  false.name === 'node';

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString$2 = {}.toString;

var isArray$1 = Array.isArray || function (arr) {
  return toString$2.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */


var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    // Object.defineProperty(Buffer, Symbol.species, {
    //   value: null,
    //   configurable: true
    // })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray$1(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}


Buffer.isBuffer = isBuffer$1;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) { return 0 }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) { return -1 }
  if (y < x) { return 1 }
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray$1(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) { return 0 }

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) { return utf8ToBytes(string).length } // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var this$1 = this;

  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) { encoding = 'utf8'; }

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this$1, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this$1, start, end)

      case 'ascii':
        return asciiSlice(this$1, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this$1, start, end)

      case 'base64':
        return base64Slice(this$1, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this$1, start, end)

      default:
        if (loweredCase) { throw new TypeError('Unknown encoding: ' + encoding) }
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var this$1 = this;

  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this$1, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var this$1 = this;

  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this$1, i, i + 3);
    swap(this$1, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var this$1 = this;

  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this$1, i, i + 7);
    swap(this$1, i + 1, i + 6);
    swap(this$1, i + 2, i + 5);
    swap(this$1, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) { return '' }
  if (arguments.length === 0) { return utf8Slice(this, 0, length) }
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) { throw new TypeError('Argument must be a Buffer') }
  if (this === b) { return true }
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) { str += ' ... '; }
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) { return 0 }

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) { return -1 }
  if (y < x) { return 1 }
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) { return -1 }

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) { byteOffset = buffer.length + byteOffset; }
  if (byteOffset >= buffer.length) {
    if (dir) { return -1 }
    else { byteOffset = buffer.length - 1; }
  } else if (byteOffset < 0) {
    if (dir) { byteOffset = 0; }
    else { return -1 }
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read$$1 (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read$$1(arr, i) === read$$1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) { foundIndex = i; }
        if (i - foundIndex + 1 === valLength) { return foundIndex * indexSize }
      } else {
        if (foundIndex !== -1) { i -= i - foundIndex; }
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) { byteOffset = arrLength - valLength; }
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read$$1(arr, i + j) !== read$$1(val, j)) {
          found = false;
          break
        }
      }
      if (found) { return i }
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) { throw new TypeError('Invalid hex string') }

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) { return i }
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write$$1 (string, offset, length, encoding) {
  var this$1 = this;

  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) { encoding = 'utf8'; }
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) { length = remaining; }

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) { encoding = 'utf8'; }

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this$1, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this$1, string, offset, length)

      case 'ascii':
        return asciiWrite(this$1, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this$1, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this$1, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this$1, string, offset, length)

      default:
        if (loweredCase) { throw new TypeError('Unknown encoding: ' + encoding) }
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) { start = 0; }
  if (!end || end < 0 || end > len) { end = len; }

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var this$1 = this;

  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) { start = 0; }
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) { end = 0; }
  } else if (end > len) {
    end = len;
  }

  if (end < start) { end = start; }

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this$1[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) { throw new RangeError('offset is not uint') }
  if (offset + ext > length) { throw new RangeError('Trying to access beyond buffer length') }
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  var this$1 = this;

  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) { checkOffset(offset, byteLength, this.length); }

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this$1[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  var this$1 = this;

  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this$1[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 1, this.length); }
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 2, this.length); }
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 2, this.length); }
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 4, this.length); }

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 4, this.length); }

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  var this$1 = this;

  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) { checkOffset(offset, byteLength, this.length); }

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this$1[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) { val -= Math.pow(2, 8 * byteLength); }

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  var this$1 = this;

  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) { checkOffset(offset, byteLength, this.length); }

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this$1[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) { val -= Math.pow(2, 8 * byteLength); }

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 1, this.length); }
  if (!(this[offset] & 0x80)) { return (this[offset]) }
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 2, this.length); }
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 2, this.length); }
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 4, this.length); }

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 4, this.length); }

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 4, this.length); }
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 4, this.length); }
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 8, this.length); }
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) { checkOffset(offset, 8, this.length); }
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) { throw new TypeError('"buffer" argument must be a Buffer instance') }
  if (value > max || value < min) { throw new RangeError('"value" argument is out of bounds') }
  if (offset + ext > buf.length) { throw new RangeError('Index out of range') }
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  var this$1 = this;

  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this$1[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  var this$1 = this;

  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this$1[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 1, 0xff, 0); }
  if (!Buffer.TYPED_ARRAY_SUPPORT) { value = Math.floor(value); }
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) { value = 0xffff + value + 1; }
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 2, 0xffff, 0); }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 2, 0xffff, 0); }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) { value = 0xffffffff + value + 1; }
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 4, 0xffffffff, 0); }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 4, 0xffffffff, 0); }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  var this$1 = this;

  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this$1[offset + i - 1] !== 0) {
      sub = 1;
    }
    this$1[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  var this$1 = this;

  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this$1[offset + i + 1] !== 0) {
      sub = 1;
    }
    this$1[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 1, 0x7f, -0x80); }
  if (!Buffer.TYPED_ARRAY_SUPPORT) { value = Math.floor(value); }
  if (value < 0) { value = 0xff + value + 1; }
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 2, 0x7fff, -0x8000); }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 2, 0x7fff, -0x8000); }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000); }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) { checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000); }
  if (value < 0) { value = 0xffffffff + value + 1; }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) { throw new RangeError('Index out of range') }
  if (offset < 0) { throw new RangeError('Index out of range') }
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  var this$1 = this;

  if (!start) { start = 0; }
  if (!end && end !== 0) { end = this.length; }
  if (targetStart >= target.length) { targetStart = target.length; }
  if (!targetStart) { targetStart = 0; }
  if (end > 0 && end < start) { end = start; }

  // Copy 0 bytes; we're done
  if (end === start) { return 0 }
  if (target.length === 0 || this.length === 0) { return 0 }

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) { throw new RangeError('sourceStart out of bounds') }
  if (end < 0) { throw new RangeError('sourceEnd out of bounds') }

  // Are we oob?
  if (end > this.length) { end = this.length; }
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this$1[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this$1[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  var this$1 = this;

  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) { val = 0; }

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this$1[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this$1[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) { return '' }
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) { return str.trim() }
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) { return '0' + n.toString(16) }
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) { bytes.push(0xEF, 0xBF, 0xBD); }
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) { bytes.push(0xEF, 0xBF, 0xBD); }
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) { bytes.push(0xEF, 0xBF, 0xBD); }
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) { bytes.push(0xEF, 0xBF, 0xBD); }
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) { break }
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) { break }
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) { break }
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) { break }
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) { break }

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) { break }
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer$1(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var inherits;
if (typeof Object.create === 'function'){
  inherits = function inherits(ctor, superCtor) {
    // implementation from standard node.js 'util' module
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
var inherits$1 = inherits;

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var formatRegExp = /%[sdj%]/g;
function format$1(f) {
  var arguments$1 = arguments;

  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect$2(arguments$1[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') { return '%'; }
    if (i >= len) { return x; }
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect$2(x);
    }
  }
  return str;
}


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
function deprecate(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global$1.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}


var debugs$1 = {};
var debugEnviron;
function debuglog(set) {
  if (isUndefined(debugEnviron))
    { debugEnviron = process.env.NODE_DEBUG || ''; }
  set = set.toUpperCase();
  if (!debugs$1[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = 0;
      debugs$1[set] = function() {
        var msg = format$1.apply(null, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs$1[set] = function() {};
    }
  }
  return debugs$1[set];
}


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect$2(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) { ctx.depth = arguments[2]; }
  if (arguments.length >= 4) { ctx.colors = arguments[3]; }
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) { ctx.showHidden = false; }
  if (isUndefined(ctx.depth)) { ctx.depth = 2; }
  if (isUndefined(ctx.colors)) { ctx.colors = false; }
  if (isUndefined(ctx.customInspect)) { ctx.customInspect = true; }
  if (ctx.colors) { ctx.stylize = stylizeWithColor; }
  return formatValue$1(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect$2.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect$2.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect$2.styles[styleType];

  if (style) {
    return '\u001b[' + inspect$2.colors[style][0] + 'm' + str +
           '\u001b[' + inspect$2.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue$1(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction$1(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect$2 &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue$1(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction$1(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp$1(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction$1(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp$1(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp$1(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    { return ctx.stylize('undefined', 'undefined'); }
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber$1(value))
    { return ctx.stylize('' + value, 'number'); }
  if (isBoolean(value))
    { return ctx.stylize('' + value, 'boolean'); }
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    { return ctx.stylize('null', 'null'); }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue$1(ctx, desc.value, null);
      } else {
        str = formatValue$1(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) { numLinesEst++; }
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isNull(arg) {
  return arg === null;
}

function isNullOrUndefined(arg) {
  return arg == null;
}

function isNumber$1(arg) {
  return typeof arg === 'number';
}

function isString(arg) {
  return typeof arg === 'string';
}

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

function isUndefined(arg) {
  return arg === void 0;
}

function isRegExp$1(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

function isFunction$1(arg) {
  return typeof arg === 'function';
}

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}

function isBuffer(maybeBuf) {
  return isBuffer$1(maybeBuf);
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
function log() {
  console.log('%s - %s', timestamp(), format$1.apply(null, arguments));
}


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) { return origin; }

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var util = {
  inherits: inherits$1,
  _extend: _extend,
  log: log,
  isBuffer: isBuffer,
  isPrimitive: isPrimitive,
  isFunction: isFunction$1,
  isError: isError,
  isDate: isDate,
  isObject: isObject,
  isRegExp: isRegExp$1,
  isUndefined: isUndefined,
  isSymbol: isSymbol,
  isString: isString,
  isNumber: isNumber$1,
  isNullOrUndefined: isNullOrUndefined,
  isNull: isNull,
  isBoolean: isBoolean,
  isArray: isArray,
  inspect: inspect$2,
  deprecate: deprecate,
  format: format$1,
  debuglog: debuglog
};


var util$1 = Object.freeze({
	format: format$1,
	deprecate: deprecate,
	debuglog: debuglog,
	inspect: inspect$2,
	isArray: isArray,
	isBoolean: isBoolean,
	isNull: isNull,
	isNullOrUndefined: isNullOrUndefined,
	isNumber: isNumber$1,
	isString: isString,
	isSymbol: isSymbol,
	isUndefined: isUndefined,
	isRegExp: isRegExp$1,
	isObject: isObject,
	isDate: isDate,
	isError: isError,
	isFunction: isFunction$1,
	isPrimitive: isPrimitive,
	isBuffer: isBuffer,
	log: log,
	inherits: inherits$1,
	_extend: _extend,
	default: util
});

var web$1 = createCommonjsModule(function (module, exports) {
!(function(e) {
  { module.exports = e(); }
})(function() {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof commonjsRequire == 'function' && commonjsRequire;
          if (!u && a) { return a(o, !0) }
          if (i) { return i(o, !0) }
          var f = new Error("Cannot find module '" + o + "'");
          throw ((f.code = 'MODULE_NOT_FOUND'), f)
        }
        var l = (n[o] = {exports: {}});
        t[o][0].call(
          l.exports,
          function(e) {
            var n = t[o][1][e];
            return s(n ? n : e)
          },
          l,
          l.exports,
          e,
          t,
          n,
          r
        );
      }
      return n[o].exports
    }
    var i = typeof commonjsRequire == 'function' && commonjsRequire;
    for (var o = 0; o < r.length; o++) { s(r[o]); }
    return s
  })(
    {
      1: [
        function(require, module, exports) {
          if (typeof Object.create === 'function') {
            // implementation from standard node.js 'util' module
            module.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                  value: ctor,
                  enumerable: false,
                  writable: true,
                  configurable: true,
                },
              });
            };
          } else {
            // old school shim for old browsers
            module.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              var TempCtor = function() {};
              TempCtor.prototype = superCtor.prototype;
              ctor.prototype = new TempCtor();
              ctor.prototype.constructor = ctor;
            };
          }
        },
        {} ],
      2: [
        function(require, module, exports) {
          // shim for using process in browser

          var process = (module.exports = {});

          process.nextTick = (function() {
            var canSetImmediate =
              typeof window !== 'undefined' && window.setImmediate;
            var canMutationObserver =
              typeof window !== 'undefined' && window.MutationObserver;
            var canPost =
              typeof window !== 'undefined' &&
              window.postMessage &&
              window.addEventListener;

            if (canSetImmediate) {
              return function(f) {
                return window.setImmediate(f)
              }
            }

            var queue = [];

            if (canMutationObserver) {
              var hiddenDiv = document.createElement('div');
              var observer = new MutationObserver(function() {
                var queueList = queue.slice();
                queue.length = 0;
                queueList.forEach(function(fn) {
                  fn();
                });
              });

              observer.observe(hiddenDiv, {attributes: true});

              return function nextTick(fn) {
                if (!queue.length) {
                  hiddenDiv.setAttribute('yes', 'no');
                }
                queue.push(fn);
              }
            }

            if (canPost) {
              window.addEventListener(
                'message',
                function(ev) {
                  var source = ev.source;
                  if (
                    (source === window || source === null) &&
                    ev.data === 'process-tick'
                  ) {
                    ev.stopPropagation();
                    if (queue.length > 0) {
                      var fn = queue.shift();
                      fn();
                    }
                  }
                },
                true
              );

              return function nextTick(fn) {
                queue.push(fn);
                window.postMessage('process-tick', '*');
              }
            }

            return function nextTick(fn) {
              setTimeout(fn, 0);
            }
          })();

          process.title = 'browser';
          process.browser = true;
          process.env = {};
          process.argv = [];

          function noop() {}

          process.on = noop;
          process.addListener = noop;
          process.once = noop;
          process.off = noop;
          process.removeListener = noop;
          process.removeAllListeners = noop;
          process.emit = noop;

          process.binding = function(name) {
            throw new Error('process.binding is not supported')
          };

          // TODO(shtylman)
          process.cwd = function() {
            return '/'
          };
          process.chdir = function(dir) {
            throw new Error('process.chdir is not supported')
          };
        },
        {} ],
      3: [
        function(require, module, exports) {
          module.exports = function isBuffer(arg) {
            return (
              arg &&
              typeof arg === 'object' &&
              typeof arg.copy === 'function' &&
              typeof arg.fill === 'function' &&
              typeof arg.readUInt8 === 'function'
            )
          };
        },
        {} ],
      4: [
        function(require, module, exports) {
          (function(process, global) {
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.

            var formatRegExp = /%[sdj%]/g;
            exports.format = function(f) {
              var arguments$1 = arguments;

              if (!isString(f)) {
                var objects = [];
                for (var i = 0; i < arguments.length; i++) {
                  objects.push(inspect(arguments$1[i]));
                }
                return objects.join(' ')
              }

              var i = 1;
              var args = arguments;
              var len = args.length;
              var str = String(f).replace(formatRegExp, function(x) {
                if (x === '%%') { return '%' }
                if (i >= len) { return x }
                switch (x) {
                  case '%s':
                    return String(args[i++])
                  case '%d':
                    return Number(args[i++])
                  case '%j':
                    try {
                      return JSON.stringify(args[i++])
                    } catch (_) {
                      return '[Circular]'
                    }
                  default:
                    return x
                }
              });
              for (var x = args[i]; i < len; x = args[++i]) {
                if (isNull(x) || !isObject(x)) {
                  str += ' ' + x;
                } else {
                  str += ' ' + inspect(x);
                }
              }
              return str
            };

            // Mark that a method should not be used.
            // Returns a modified function which warns once by default.
            // If --no-deprecation is set, then it is a no-op.
            exports.deprecate = function(fn, msg) {
              // Allow for deprecating things in the process of starting up.
              if (isUndefined(global.process)) {
                return function() {
                  return exports.deprecate(fn, msg).apply(this, arguments)
                }
              }

              if (process.noDeprecation === true) {
                return fn
              }

              var warned = false;
              function deprecated() {
                if (!warned) {
                  if (process.throwDeprecation) {
                    throw new Error(msg)
                  } else if (process.traceDeprecation) {
                    console.trace(msg);
                  } else {
                    console.error(msg);
                  }
                  warned = true;
                }
                return fn.apply(this, arguments)
              }

              return deprecated
            };

            var debugs = {};
            var debugEnviron;
            exports.debuglog = function(set) {
              if (isUndefined(debugEnviron))
                { debugEnviron = process.env.NODE_DEBUG || ''; }
              set = set.toUpperCase();
              if (!debugs[set]) {
                if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                  var pid = process.pid;
                  debugs[set] = function() {
                    var msg = exports.format.apply(exports, arguments);
                    console.error('%s %d: %s', set, pid, msg);
                  };
                } else {
                  debugs[set] = function() {};
                }
              }
              return debugs[set]
            };

            /**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
            /* legacy: obj, showHidden, depth, colors*/
            function inspect(obj, opts) {
              // default options
              var ctx = {
                seen: [],
                stylize: stylizeNoColor,
              };
              // legacy...
              if (arguments.length >= 3) { ctx.depth = arguments[2]; }
              if (arguments.length >= 4) { ctx.colors = arguments[3]; }
              if (isBoolean(opts)) {
                // legacy...
                ctx.showHidden = opts;
              } else if (opts) {
                // got an "options" object
                exports._extend(ctx, opts);
              }
              // set default options
              if (isUndefined(ctx.showHidden)) { ctx.showHidden = false; }
              if (isUndefined(ctx.depth)) { ctx.depth = 2; }
              if (isUndefined(ctx.colors)) { ctx.colors = false; }
              if (isUndefined(ctx.customInspect)) { ctx.customInspect = true; }
              if (ctx.colors) { ctx.stylize = stylizeWithColor; }
              return formatValue(ctx, obj, ctx.depth)
            }
            exports.inspect = inspect;

            // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
            inspect.colors = {
              bold: [1, 22],
              italic: [3, 23],
              underline: [4, 24],
              inverse: [7, 27],
              white: [37, 39],
              grey: [90, 39],
              black: [30, 39],
              blue: [34, 39],
              cyan: [36, 39],
              green: [32, 39],
              magenta: [35, 39],
              red: [31, 39],
              yellow: [33, 39],
            };

            // Don't use 'blue' not visible on cmd.exe
            inspect.styles = {
              special: 'cyan',
              number: 'yellow',
              boolean: 'yellow',
              undefined: 'grey',
              null: 'bold',
              string: 'green',
              date: 'magenta',
              // "name": intentionally not styling
              regexp: 'red',
            };

            function stylizeWithColor(str, styleType) {
              var style = inspect.styles[styleType];

              if (style) {
                return (
                  '\u001b[' +
                  inspect.colors[style][0] +
                  'm' +
                  str +
                  '\u001b[' +
                  inspect.colors[style][1] +
                  'm'
                )
              } else {
                return str
              }
            }

            function stylizeNoColor(str, styleType) {
              return str
            }

            function arrayToHash(array) {
              var hash = {};

              array.forEach(function(val, idx) {
                hash[val] = true;
              });

              return hash
            }

            function formatValue(ctx, value, recurseTimes) {
              // Provide a hook for user-specified inspect functions.
              // Check that value is an object with an inspect function on it
              if (
                ctx.customInspect &&
                value &&
                isFunction(value.inspect) &&
                // Filter out the util module, it's inspect function is special
                value.inspect !== exports.inspect &&
                // Also filter out any prototype objects using the circular check.
                !(value.constructor && value.constructor.prototype === value)
              ) {
                var ret = value.inspect(recurseTimes, ctx);
                if (!isString(ret)) {
                  ret = formatValue(ctx, ret, recurseTimes);
                }
                return ret
              }

              // Primitive types cannot have properties
              var primitive = formatPrimitive(ctx, value);
              if (primitive) {
                return primitive
              }

              // Look up the keys of the object.
              var keys = Object.keys(value);
              var visibleKeys = arrayToHash(keys);

              if (ctx.showHidden) {
                keys = Object.getOwnPropertyNames(value);
              }

              // IE doesn't make error fields non-enumerable
              // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
              if (
                isError(value) &&
                (keys.indexOf('message') >= 0 ||
                  keys.indexOf('description') >= 0)
              ) {
                return formatError(value)
              }

              // Some type of object without properties can be shortcutted.
              if (keys.length === 0) {
                if (isFunction(value)) {
                  var name = value.name ? ': ' + value.name : '';
                  return ctx.stylize('[Function' + name + ']', 'special')
                }
                if (isRegExp(value)) {
                  return ctx.stylize(
                    RegExp.prototype.toString.call(value),
                    'regexp'
                  )
                }
                if (isDate(value)) {
                  return ctx.stylize(
                    Date.prototype.toString.call(value),
                    'date'
                  )
                }
                if (isError(value)) {
                  return formatError(value)
                }
              }

              var base = '',
                array = false,
                braces = ['{', '}'];

              // Make Array say that they are Array
              if (isArray(value)) {
                array = true;
                braces = ['[', ']'];
              }

              // Make functions say that they are functions
              if (isFunction(value)) {
                var n = value.name ? ': ' + value.name : '';
                base = ' [Function' + n + ']';
              }

              // Make RegExps say that they are RegExps
              if (isRegExp(value)) {
                base = ' ' + RegExp.prototype.toString.call(value);
              }

              // Make dates with properties first say the date
              if (isDate(value)) {
                base = ' ' + Date.prototype.toUTCString.call(value);
              }

              // Make error with message first say the error
              if (isError(value)) {
                base = ' ' + formatError(value);
              }

              if (keys.length === 0 && (!array || value.length == 0)) {
                return braces[0] + base + braces[1]
              }

              if (recurseTimes < 0) {
                if (isRegExp(value)) {
                  return ctx.stylize(
                    RegExp.prototype.toString.call(value),
                    'regexp'
                  )
                } else {
                  return ctx.stylize('[Object]', 'special')
                }
              }

              ctx.seen.push(value);

              var output;
              if (array) {
                output = formatArray(
                  ctx,
                  value,
                  recurseTimes,
                  visibleKeys,
                  keys
                );
              } else {
                output = keys.map(function(key) {
                  return formatProperty(
                    ctx,
                    value,
                    recurseTimes,
                    visibleKeys,
                    key,
                    array
                  )
                });
              }

              ctx.seen.pop();

              return reduceToSingleString(output, base, braces)
            }

            function formatPrimitive(ctx, value) {
              if (isUndefined(value))
                { return ctx.stylize('undefined', 'undefined') }
              if (isString(value)) {
                var simple =
                  "'" +
                  JSON.stringify(value)
                    .replace(/^"|"$/g, '')
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"') +
                  "'";
                return ctx.stylize(simple, 'string')
              }
              if (isNumber(value)) { return ctx.stylize('' + value, 'number') }
              if (isBoolean(value)) { return ctx.stylize('' + value, 'boolean') }
              // For some reason typeof null is "object", so special case here.
              if (isNull(value)) { return ctx.stylize('null', 'null') }
            }

            function formatError(value) {
              return '[' + Error.prototype.toString.call(value) + ']'
            }

            function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
              var output = [];
              for (var i = 0, l = value.length; i < l; ++i) {
                if (hasOwnProperty(value, String(i))) {
                  output.push(
                    formatProperty(
                      ctx,
                      value,
                      recurseTimes,
                      visibleKeys,
                      String(i),
                      true
                    )
                  );
                } else {
                  output.push('');
                }
              }
              keys.forEach(function(key) {
                if (!key.match(/^\d+$/)) {
                  output.push(
                    formatProperty(
                      ctx,
                      value,
                      recurseTimes,
                      visibleKeys,
                      key,
                      true
                    )
                  );
                }
              });
              return output
            }

            function formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              key,
              array
            ) {
              var name, str, desc;
              desc = Object.getOwnPropertyDescriptor(value, key) || {
                value: value[key],
              };
              if (desc.get) {
                if (desc.set) {
                  str = ctx.stylize('[Getter/Setter]', 'special');
                } else {
                  str = ctx.stylize('[Getter]', 'special');
                }
              } else {
                if (desc.set) {
                  str = ctx.stylize('[Setter]', 'special');
                }
              }
              if (!hasOwnProperty(visibleKeys, key)) {
                name = '[' + key + ']';
              }
              if (!str) {
                if (ctx.seen.indexOf(desc.value) < 0) {
                  if (isNull(recurseTimes)) {
                    str = formatValue(ctx, desc.value, null);
                  } else {
                    str = formatValue(ctx, desc.value, recurseTimes - 1);
                  }
                  if (str.indexOf('\n') > -1) {
                    if (array) {
                      str = str
                        .split('\n')
                        .map(function(line) {
                          return '  ' + line
                        })
                        .join('\n')
                        .substr(2);
                    } else {
                      str =
                        '\n' +
                        str
                          .split('\n')
                          .map(function(line) {
                            return '   ' + line
                          })
                          .join('\n');
                    }
                  }
                } else {
                  str = ctx.stylize('[Circular]', 'special');
                }
              }
              if (isUndefined(name)) {
                if (array && key.match(/^\d+$/)) {
                  return str
                }
                name = JSON.stringify('' + key);
                if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                  name = name.substr(1, name.length - 2);
                  name = ctx.stylize(name, 'name');
                } else {
                  name = name
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"')
                    .replace(/(^"|"$)/g, "'");
                  name = ctx.stylize(name, 'string');
                }
              }

              return name + ': ' + str
            }

            function reduceToSingleString(output, base, braces) {
              var numLinesEst = 0;
              var length = output.reduce(function(prev, cur) {
                numLinesEst++;
                if (cur.indexOf('\n') >= 0) { numLinesEst++; }
                return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1
              }, 0);

              if (length > 60) {
                return (
                  braces[0] +
                  (base === '' ? '' : base + '\n ') +
                  ' ' +
                  output.join(',\n  ') +
                  ' ' +
                  braces[1]
                )
              }

              return (
                braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1]
              )
            }

            // NOTE: These type checking functions intentionally don't use `instanceof`
            // because it is fragile and can be easily faked with `Object.create()`.
            function isArray(ar) {
              return Array.isArray(ar)
            }
            exports.isArray = isArray;

            function isBoolean(arg) {
              return typeof arg === 'boolean'
            }
            exports.isBoolean = isBoolean;

            function isNull(arg) {
              return arg === null
            }
            exports.isNull = isNull;

            function isNullOrUndefined(arg) {
              return arg == null
            }
            exports.isNullOrUndefined = isNullOrUndefined;

            function isNumber(arg) {
              return typeof arg === 'number'
            }
            exports.isNumber = isNumber;

            function isString(arg) {
              return typeof arg === 'string'
            }
            exports.isString = isString;

            function isSymbol(arg) {
              return typeof arg === 'symbol'
            }
            exports.isSymbol = isSymbol;

            function isUndefined(arg) {
              return arg === void 0
            }
            exports.isUndefined = isUndefined;

            function isRegExp(re) {
              return isObject(re) && objectToString(re) === '[object RegExp]'
            }
            exports.isRegExp = isRegExp;

            function isObject(arg) {
              return typeof arg === 'object' && arg !== null
            }
            exports.isObject = isObject;

            function isDate(d) {
              return isObject(d) && objectToString(d) === '[object Date]'
            }
            exports.isDate = isDate;

            function isError(e) {
              return (
                isObject(e) &&
                (objectToString(e) === '[object Error]' || e instanceof Error)
              )
            }
            exports.isError = isError;

            function isFunction(arg) {
              return typeof arg === 'function'
            }
            exports.isFunction = isFunction;

            function isPrimitive(arg) {
              return (
                arg === null ||
                typeof arg === 'boolean' ||
                typeof arg === 'number' ||
                typeof arg === 'string' ||
                typeof arg === 'symbol' || // ES6 symbol
                typeof arg === 'undefined'
              )
            }
            exports.isPrimitive = isPrimitive;

            exports.isBuffer = require('./support/isBuffer');

            function objectToString(o) {
              return Object.prototype.toString.call(o)
            }

            function pad(n) {
              return n < 10 ? '0' + n.toString(10) : n.toString(10)
            }

            var months = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec' ];

            // 26 Feb 16:19:34
            function timestamp() {
              var d = new Date();
              var time = [
                pad(d.getHours()),
                pad(d.getMinutes()),
                pad(d.getSeconds()) ].join(':');
              return [d.getDate(), months[d.getMonth()], time].join(' ')
            }

            // log is just a thin wrapper to console.log that prepends a timestamp
            exports.log = function() {
              console.log(
                '%s - %s',
                timestamp(),
                exports.format.apply(exports, arguments)
              );
            };

            /**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
            exports.inherits = require('inherits');

            exports._extend = function(origin, add) {
              // Don't do anything if add isn't an object
              if (!add || !isObject(add)) { return origin }

              var keys = Object.keys(add);
              var i = keys.length;
              while (i--) {
                origin[keys[i]] = add[keys[i]];
              }
              return origin
            };

            function hasOwnProperty(obj, prop) {
              return Object.prototype.hasOwnProperty.call(obj, prop)
            }
          }.call(
            this,
            require('_process'),
            typeof commonjsGlobal !== 'undefined'
              ? commonjsGlobal
              : typeof self !== 'undefined'
                ? self
                : typeof window !== 'undefined' ? window : {}
          ));
        },
        {'./support/isBuffer': 3, _process: 2, inherits: 1} ],
      5: [
        function(require, module, exports) {
          module.exports = require('util');
        },
        {util: 4} ],
    },
    {},
    [5]
  )(5)
});
});

var require$$0$3 = ( util$1 && util ) || util$1;

var index$33 = createCommonjsModule(function (module) {
if (isNode) {
  module.exports = require$$0$3;
} else {
  module.exports = web$1;
}
});

var index$35 = createCommonjsModule(function (module, exports) {
(function(root, stringify) {
  /* istanbul ignore else */
  if (
    typeof commonjsRequire === 'function' &&
    'object' === 'object' &&
    'object' === 'object'
  ) {
    // Node.
    module.exports = stringify();
  }
  else if (typeof undefined === 'function' && undefined.amd) {
    // AMD, registers as an anonymous module.
    undefined(function () {
      return stringify()
    });
  }
  else {
    // Browser global.
    root.javascriptStringify = stringify();
  }
})(commonjsGlobal, function () {
  /**
   * Match all characters that need to be escaped in a string. Modified from
   * source to match single quotes instead of double.
   *
   * Source: https://github.com/douglascrockford/JSON-js/blob/master/json2.js
   */
  var ESCAPABLE = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  /**
   * Map of characters to escape characters.
   */
  var META_CHARS = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\'': '\\\'',
    '"': '\\"',
    '\\': '\\\\',
  };

  /**
   * Escape any character into its literal JavaScript string.
   *
   * @param  {string} char
   * @return {string}
   */
  function escapeChar(char) {
    var meta = META_CHARS[char];

    return meta || '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4)
  }

  /**
   * JavaScript reserved word list.
   */
  var RESERVED_WORDS = {};('break else new var case finally return void catch for switch while ' +
    'continue function this with default if throw delete in try ' +
    'do instanceof typeof abstract enum int short boolean export ' +
    'interface static byte extends long super char final native synchronized ' +
    'class float package throws const goto private transient debugger ' +
    'implements protected volatile double import public let yield')
    .split(' ')
    .map(function (key) {
      RESERVED_WORDS[key] = true;
    });

  /**
   * Test for valid JavaScript identifier.
   */
  var IS_VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

  /**
   * Check if a variable name is valid.
   *
   * @param  {string}  name
   * @return {boolean}
   */
  function isValidVariableName(name) {
    return !RESERVED_WORDS[name] && IS_VALID_IDENTIFIER.test(name)
  }

  /**
   * Return the global variable name.
   *
   * @return {string}
   */
  function toGlobalVariable(value) {
    return 'Function(' + stringify('return this;') + ')()'
  }

  /**
   * Serialize the path to a string.
   *
   * @param  {Array}  path
   * @return {string}
   */
  function toPath(path) {
    var result = '';

    for (var i = 0; i < path.length; i++) {
      if (isValidVariableName(path[i])) {
        result += '.' + path[i];
      }
      else {
        result += '[' + stringify(path[i]) + ']';
      }
    }

    return result
  }

  /**
   * Stringify an array of values.
   *
   * @param  {Array}    array
   * @param  {string}   indent
   * @param  {Function} next
   * @return {string}
   */
  function stringifyArray(array, indent, next) {
    // Map array values to their stringified values with correct indentation.
    var values = array
      .map(function (value, index) {
        var str = next(value, index);

        if (str === undefined) {
          return String(str)
        }

        return indent + str.split('\n').join('\n' + indent)
      })
      .join(indent ? ',\n' : ',');

    // Wrap the array in newlines if we have indentation set.
    if (indent && values) {
      return '[\n' + values + '\n]'
    }

    return '[' + values + ']'
  }

  /**
   * Stringify a map of values.
   *
   * @param  {Object}   object
   * @param  {string}   indent
   * @param  {Function} next
   * @return {string}
   */
  function stringifyObject(object, indent, next) {
    // Iterate over object keys and concat string together.
    var values = Object.keys(object)
      .reduce(function (values, key) {
        var value = next(object[key], key);

        // Omit `undefined` object values.
        if (value === undefined) {
          return values
        }

        // String format the key and value data.
        key = isValidVariableName(key) ? key : stringify(key);
        value = String(value).split('\n').join('\n' + indent);

        // Push the current object key and value into the values array.
        values.push(
          indent + '"' + key + '"' + ':' + (indent ? ' ' : '') + value
        );
        // values.push(
        //   indent + key + ':' + (indent ? ' ' : '') + '"' + value + '"'
        // )

        return values
      }, [])
      .join(indent ? ',\n' : ',');

    // Wrap the object in newlines if we have indentation set.
    if (indent && values) {
      return '{\n' + values + '\n}'
    }

    return '{' + values + '}'
  }

  /**
   * Convert JavaScript objects into strings.
   */
  var OBJECT_TYPES = {
    '[object Array]': stringifyArray,
    '[object Object]': stringifyObject,
    '[object Error]': function(error) {
      return 'new Error(' + stringify(error.message) + ')'
    },
    '[object Date]': function(date) {
      return 'new Date(' + date.getTime() + ')'
    },
    '[object String]': function(string) {
      return 'new String(' + stringify(string.toString()) + ')'
    },
    '[object Number]': function(number) {
      return 'new Number(' + number + ')'
    },
    '[object Boolean]': function(boolean) {
      return 'new Boolean(' + boolean + ')'
    },
    '[object Uint8Array]': function(array, indent) {
      return 'new Uint8Array(' + stringifyArray(array) + ')'
    },
    '[object Set]': function(array, indent, next) {
      if (typeof Array.from === 'function') {
        return 'new Set(' + stringify(Array.from(array), indent, next) + ')'
      }
      else { return undefined }
    },
    '[object Map]': function(array, indent, next) {
      if (typeof Array.from === 'function') {
        return 'new Map(' + stringify(Array.from(array), indent, next) + ')'
      }
      else { return undefined }
    },
    '[object RegExp]': String,
    '[object Function]': String,
    '[object global]': toGlobalVariable,
    '[object Window]': toGlobalVariable,
  };

  /**
   * Convert JavaScript primitives into strings.
   */
  var PRIMITIVE_TYPES = {
    string: function string(string$1) {
      return '\'' + string$1.replace(ESCAPABLE, escapeChar) + '\''
    },
    number: String,
    object: String,
    boolean: String,
    symbol: String,
    undefined: String,
  };

  /**
   * Convert any value to a string.
   *
   * @param  {*}        value
   * @param  {string}   indent
   * @param  {Function} next
   * @return {string}
   */
  function stringify(value, indent, next) {
    // Convert primitives into strings.
    if (Object(value) !== value) {
      return PRIMITIVE_TYPES[typeof value](value, indent, next)
    }

    // Handle buffer objects before recursing (node < 6 was an object, node >= 6 is a `Uint8Array`).
    if (typeof Buffer === 'function' && isBuffer$1(value)) {
      return 'new Buffer(' + next(value.toString()) + ')'
    }

    // Use the internal object string to select stringification method.
    var toString = OBJECT_TYPES[Object.prototype.toString.call(value)];

    // Convert objects into strings.
    return toString ? toString(value, indent, next) : undefined
  }

  /**
   * Stringify an object into the literal string.
   *
   * @param  {*}               value
   * @param  {Function}        [replacer]
   * @param  {(number|string)} [space]
   * @param  {Object}          [options]
   * @return {string}
   */
  return function(value, replacer, space, options) {
    options = options || {};

    // Convert the spaces into a string.
    if (typeof space !== 'string') {
      space = new Array(Math.max(0, space | 0) + 1).join(' ');
    }

    var maxDepth = Number(options.maxDepth) || 100;
    var references = !!options.references;
    var skipUndefinedProperties = !!options.skipUndefinedProperties;
    var valueCount = Number(options.maxValues) || 100000;

    var path = [];
    var stack = [];
    var encountered = [];
    var paths = [];
    var restore = [];

    /**
     * Stringify the next value in the stack.
     *
     * @param  {*}      value
     * @param  {string} key
     * @return {string}
     */
    function next(value, key) {
      if (skipUndefinedProperties && value === undefined) {
        return undefined
      }

      path.push(key);
      var result = recurse(value, stringify);
      path.pop();
      return result
    }

    /**
     * Handle recursion by checking if we've visited this node every iteration.
     *
     * @param  {*}        value
     * @param  {Function} stringify
     * @return {string}
     */
    var recurse = references ?
      function(value, stringify) {
        if (
            value &&
            (typeof value === 'object' || typeof value === 'function')
          ) {
          var seen = encountered.indexOf(value);

            // Track nodes to restore later.
          if (seen > -1) {
            restore.push(path.slice(), paths[seen]);
            return
          }

            // Track encountered nodes.
          encountered.push(value);
          paths.push(path.slice());
        }

          // Stop when we hit the max depth.
        if (path.length > maxDepth || valueCount-- <= 0) {
          return
        }

          // Stringify the value and fallback to
        return stringify(value, space, next)
      } :
      function(value, stringify) {
        var seen = stack.indexOf(value);

        if (seen > -1 || path.length > maxDepth || valueCount-- <= 0) {
          return
        }

        stack.push(value);
        var value = stringify(value, space, next);
        stack.pop();
        return value
      };

    // If the user defined a replacer function, make the recursion function
    // a double step process - `recurse -> replacer -> stringify`.
    if (typeof replacer === 'function') {
      var before = recurse;

      // Intertwine the replacer function with the regular recursion.
      recurse = function(value, stringify) {
        return before(value, function (value, space, next) {
          return replacer(value, space, function (value) {
            return stringify(value, space, next)
          })
        })
      };
    }

    var result = recurse(value, stringify);

    // Attempt to restore circular references.
    if (restore.length) {
      var sep = space ? '\n' : '';
      var assignment = space ? ' = ' : '=';
      var eol = ';' + sep;
      var before = space ? '(function () {' : '(function(){';
      var after = '}())';
      var results = ['var x' + assignment + result];

      for (var i = 0; i < restore.length; i += 2) {
        results.push(
          'x' + toPath(restore[i]) + assignment + 'x' + toPath(restore[i + 1])
        );
      }

      results.push('return x');

      return before + sep + results.join(eol) + eol + after
    }

    return result
  }
});
});

var inspector = function (msg, depth, opts) {
  if ( depth === void 0 ) depth = 30;
  if ( opts === void 0 ) opts = {};

  // allow taking in different depths
  if (!Number.isInteger(depth)) { depth = 10; }
  var defaults = {
    depth: depth,
    maxArrayLength: depth,
    showHidden: true,
    showProxy: true,
    colors: true,
  };
  opts = Object.assign(defaults, opts);

  try {
    var inspected = index$33.inspect(msg, opts);
    return inspected
  } catch (e) {
    console.log(e);
    try {
      var stringify = index$35;
      var stringified = stringify(msg, null, '  ');
      return stringified
    } catch (error) {
      return msg
    }
  }
};

var inspector_1 = inspector;

// https://www.bennadel.com/blog/2829-string-interpolation-using-util-format-and-util-inspect-in-node-js.htm
var filter$4 = [
  'helpers',
  'addDebug',
  'inspect',
  'emit',
  'on',
  'debugFor',
  'translator',
  'appsByName',

  // these ones we might want to toggle on and off
  'instance',
  'api',
  'evts',
  'hubs' ];
var inspectorGadget = function (thisArg, moreFilters) {
  return function(depth, options) {
    var toInspect = Object.keys(thisArg)
    .filter(function (key) { return !filter$4.includes(key); });

    if (Array.isArray(moreFilters))
      { toInspect = toInspect.filter(function (key) { return !moreFilters.includes(key); }); }
    // else if (typeof moreFilters === 'function')
    //   toInspect = toInspect.map(key => moreFilters(key, this[key]))
    else if (typeof moreFilters === 'object') {
      // if (moreFilters.blacklist)
      if (moreFilters.whitelist) {
        toInspect = toInspect.filter(function (key) { return moreFilters.whitelist.includes(key); });
      }
      // if (moreFilters.val) {
      //   return moreFilters.val
      // }
      // if (moreFilters.filter)
      // if (moreFilters.map)
    }

    var inspected = {};
    toInspect.forEach(function (key) {
      // @TODO: filter out .length on function...
      // let val = thisArg[key]
      // if (typeof val === 'function')
      inspected[key] = thisArg[key];
    });
    return inspected
  }
};

var inspectorGadget_1 = inspectorGadget;

var iterator = Symbol.iterator;

var instance = Symbol.hasInstance;

var primative = Symbol.toPrimitive;

// @TODO use build script with .replace for each
// const isNode =
//   typeof process === 'object' &&
//   typeof false === 'object' &&
//   false.name === 'node'
//
// if (isNode) {
//   module.exports = require('./Chainable.node')
// }
// else {
//   module.exports = require('./Chainable.all')
// }





var F = Function.prototype;

/**
 * @type {Chainable}
 * @prop {Chainable | any} parent
 * @prop {string} className
 * @prop {Array<Class|Object> | null} mixed
 */
var Chainable = function Chainable(parent) {
  if (parent) { this.parent = parent; }
  this.className = this.constructor.name;
};

/**
 * @NOTE assigned to a variable so buble ignores it
 * @since 0.5.0
 * @example for (var [key, val] of chainable) {}
 * @example
 ** [Symbol.iterator](): void { for (const item of this.store) yield item }
 * @see https://github.com/sindresorhus/quick-lru/blob/master/index.js
 * @see https://stackoverflow.com/questions/36976832/what-is-the-meaning-of-symbol-iterator-in-this-context
 * @see this.store
 * @type {generator}
 * @return {Object} {value: undefined | any, done: true | false}
 */
Chainable.prototype[iterator] = function () {
  var entries = this.entries ? this.entries() : false;
  var values = this.values();
  var size = this.store.size;
  var keys = entries === false ? new Array(size) : Object.keys(entries);

  return {
    i: 0,
    next: function next() {
      var i = this.i;
      var key = i;
      var val = values[i];
      if (entries) { key = keys[i]; }

      // done - no more values, or iteration reached size
      if ((key === undefined && val === undefined) || size <= i) {
        return {value: undefined, done: true}
      }

      this.i++;

      // return
      return {value: [key, val], done: false}
    },
  }
};

/**
 * @NOTE could just do chain.values().forEach...
 * @desc loop over values
 * @since 1.0.2
 * @param {Function} cb
 * @return {Chainable} @chainable
 */
// forEach(cb) {
// this.values().forEach(cb, this)
// return this
// }

/**
 * @since 1.0.2
 * @desc
 *    checks mixins,
 *    checks prototype,
 *    checks if it has a store
 *    or parent or className
 *
 * @example new Chainable() instanceof Chainable
 * @type {Symbol.wellknown}
 * @param {Chainable | Object | any} instance
 * @return {boolean} instanceof
 */
Chainable.prototype[instance] = function (instance$$1) {
  return Chainable[instance](instance$$1, this)
};

/**
 * @since 0.4.0
 * @see Chainable.parent
 * @return {Chainable | any}
 */
Chainable.prototype.end = function end () {
  return this.parent
};

/**
 * @description
 *when the condition is true,
 *trueBrancher is called,
 *else, falseBrancher is called
 *
 * @example
 *const prod = process.env.NODE_ENV === 'production'
 *chains.when(prod, c => c.set('prod', true), c => c.set('prod', false))
 *
 * @param{boolean} condition
 * @param{Function} [trueBrancher=Function.prototype] called when true
 * @param{Function} [falseBrancher=Function.prototype] called when false
 * @return {ChainedMap}
 */
Chainable.prototype.when = function when (condition, trueBrancher, falseBrancher) {
    if ( trueBrancher === void 0 ) trueBrancher = F;
    if ( falseBrancher === void 0 ) falseBrancher = F;

  if (condition) {
    trueBrancher(this);
  }
  else {
    falseBrancher(this);
  }

  return this
};

/**
 * @since 0.3.0
 * @return {Chainable}
 */
Chainable.prototype.clear = function clear () {
  this.store.clear();
  return this
};

/**
 * @since 0.3.0
 * @description calls .delete on this.store.map
 * @param {string | any} key
 * @return {Chainable}
 */
Chainable.prototype.delete = function delete$1 (key) {
  this.store.delete(key);
  return this
};

/**
 * @since 0.3.0
 * @example if (chain.has('eh') === false) chain.set('eh', true)
 * @param {any} value
 * @return {boolean}
 */
Chainable.prototype.has = function has (value) {
  return this.store.has(value)
};

/**
 * @since 0.4.0
 * @NOTE: moved from ChainedMap and ChainedSet to Chainable @2.0.2
 * @NOTE: this was [...] & Array.from(this.store.values())
 * @see https://kangax.github.io/compat-table/es6/#test-Array_static_methods
 * @see https://stackoverflow.com/questions/20069828/how-to-convert-set-to-array
 * @desc spreads the entries from ChainedMap.store.values
 * @return {Array<any>}
 */
Chainable.prototype.values = function values () {
  var vals = [];
  this.store.forEach(function (v) { return vals.push(v); });
  return vals
};

/**
 * @see http://2ality.com/2015/09/well-known-symbols-es6.html#default-tostring-tags
 * @since 1.0.2
 * @example chain + 1 (calls this)
 * @param {string} hint
 * @return {Primative}
 */
Chainable.prototype[primative] = function (hint) {
    var this$1 = this;

  if (hint === 'number' && this.toNumber) {
    return this.toNumber()
  }
  else if (hint === 'string' && this.toString) {
    return this.toString()
  }
  else if (this.getContents !== undefined) {
    var content = this.getContents();
    if (typeof content === 'string') { return content }
  }

  // default:
  // if (this.valueOf) return this.valueOf(hint)
  var methods = [
    'toPrimative',
    'toNumber',
    'toArray',
    'toJSON',
    'toBoolean',
    'toObject' ];
  for (var m = 0; m < methods.length; m++) {
    if (this$1[methods[m]] !== undefined) {
      return this$1[methods[m]](hint)
    }
  }

  return this.toString()
};

function define(Chain) {
  /**
   * @since 0.5.0
   * @example for (var i = 0; i < chain.length; i++)
   * @see ChainedMap.store
   * @return {number}
   */
  Object.defineProperty(Chain, 'length', {
    configurable: true,
    enumerable: false,
    get: function get() {
      return this.store.size
    },
  });
  Object.defineProperty(Chain, instance, {
    configurable: true,
    enumerable: false,
    // writable: false,
    value: function (instance$$1, thisArg) {
      // @NOTE depreciated mixins because of speed, but will use this elsewhere
      // if (thisArg && thisArg.mixed !== undefined) {
      //   for (let m = 0; m < thisArg.mixed.length; m++) {
      //     const mixin = thisArg.mixed[m]
      //     if (mixin && typeof mixin === 'object' && instance instanceof mixin) {
      //       return true
      //     }
      //   }
      // }

      return (
        instance$$1 &&
        (Object.prototype.isPrototypeOf.call(instance$$1, Chain) ||
          !!instance$$1.className ||
          !!instance$$1.parent ||
          !!instance$$1.store)
      )
    },
  });
}

define(Chainable);
define(Chainable.prototype);

var Chainable_1 = Chainable;

// https://github.com/sindresorhus/is-obj/blob/master/index.js
var pureObj = function (x) { return x !== null && typeof x === 'object'; };

var array$4 = Array.isArray;

var toS = function (obj) { return Object.prototype.toString.call(obj); };

var ezType = function (x) { return (array$4(x) ? 'array' : typeof x); };

// @TODO convert forEach for faster loops
function isMergeableObj(val) {
  return (
    // not null object
    pureObj(val) &&
    // object toString is not a date or regex
    !['[object RegExp]', '[object Date]'].includes(toS(val))
  )
}

function emptyTarget(val) {
  return array$4(val) ? [] : {}
}
function cloneIfNeeded(value, optsArg) {
  return optsArg.clone === true && isMergeableObj(value)
    ? deepmerge(emptyTarget(value), value, optsArg)
    : value
}

function defaultArrayMerge(target, source, optsArg) {
  var destination = target.slice();
  source.forEach(function (v, i) {
    if (typeof destination[i] === 'undefined') {
      destination[i] = cloneIfNeeded(v, optsArg);
    }
    else if (isMergeableObj(v)) {
      destination[i] = deepmerge(target[i], v, optsArg);
    }
    else if (target.indexOf(v) === -1) {
      destination.push(cloneIfNeeded(v, optsArg));
    }
  });
  return destination
}

function mergeObj(target, source, optsArg) {
  var destination = {};
  if (isMergeableObj(target)) {
    Object.keys(target).forEach(function (key) {
      destination[key] = cloneIfNeeded(target[key], optsArg);
    });
  }
  Object.keys(source).forEach(function (key) {
    if (!isMergeableObj(source[key]) || !target[key]) {
      destination[key] = cloneIfNeeded(source[key], optsArg);
    }
    else {
      destination[key] = deepmerge(target[key], source[key], optsArg);
    }
  });
  return destination
}

function deepmerge(target, source, optsArg) {
  if (array$4(source)) {
    var arrayMerge = optsArg.arrayMerge;
    return array$4(target)
      ? arrayMerge(target, source, optsArg)
      : cloneIfNeeded(source, optsArg)
  }

  // else
  return mergeObj(target, source, optsArg)
}

// unused
// @TODO options for merging arr, and on any type combo
// const todoOpts = {
//   // when: { left(cb), right(cb) }
//   // whenLeft(cb): {}
//   objToArr: false, // not implemented
//   stringConcat: false, // not implemented
//   numberOperation: "+ * ^ toarr cb",
//   promises... wait until finished then call merge???
//   boolPrefer: 0, 1, true, false
// }

function eqq(arr1, arr2) {
  return arr1[0] === arr2[0] && arr1[1] === arr2[1]
}

function eqCurry(types) {
  return eqq.bind(null, types)
}

function getDefaults() {
  return {
    arrayMerge: defaultArrayMerge,
    stringToArray: true,
    boolToArray: false,
    boolAsRight: true,
    ignoreTypes: ['null', 'undefined', 'NaN'],
    debug: true,
  }
}

// eslint-disable-next-line complexity
function dopemerge(obj1, obj2, opts) {
  if ( opts === void 0 ) opts = {};

  // if they are identical, fastest === check
  if (obj1 === obj2) { return obj1 }

  // setup options
  var options = Object.assign(getDefaults(), opts);
  var ignoreTypes = options.ignoreTypes;
  var stringToArray = options.stringToArray;
  var boolToArray = options.boolToArray;
  var clone = options.clone;

  var types = [ezType(obj1), ezType(obj2)];

  // check one then check the other
  // @TODO might want to push undefined null nan into array but...
  if (ignoreTypes.includes(types[0]) === true) { return obj2 }
  if (ignoreTypes.includes(types[1]) === true) { return obj1 }

  var eq = eqCurry(types);

  // check types to prefer
  switch (true) {
    case eq(['boolean', 'boolean']): {
      return boolToArray ? [obj1, obj2] : obj2
    }
    case eq(['string', 'string']): {
      return stringToArray ? [obj1, obj2] : obj1 + obj2
    }
    case eq(['array', 'string']): {
      return (clone ? obj1.slice(0) : obj1).concat([obj2])
    }
    case eq(['string', 'array']): {
      return (clone ? obj2.slice(0) : obj2).concat([obj1])
    }
    default: {
      return deepmerge(obj1, obj2, options)
    }
  }
}

var dopemerge_1 = dopemerge;

var _function = function (x) { return typeof x === 'function'; };

/**
 * @since 1.0.0
 * @type {Map}
 */
var MergeChain = (function (Chainable) {
  function MergeChain(parent) {
    var this$1 = this;

    Chainable.call(this, parent);
    this.store = new Map();
    this.set = function (name, val) {
      this$1.store.set(name, val);
      return this$1
    };

    this.set('onValue', function () { return true; }).set('merger', dopemerge_1);
    this.get = function (name) { return this$1.store.get(name); };
  }

  if ( Chainable ) MergeChain.__proto__ = Chainable;
  MergeChain.prototype = Object.create( Chainable && Chainable.prototype );
  MergeChain.prototype.constructor = MergeChain;

  /**
   * @since 1.0.0
   * @desc can pass in a function same as .merge,
   *       but say, .set instead of merge
   *
   * @param  {Function} cb
   * @return {MergeChain} @chainable
   */
  MergeChain.init = function init (parent) {
    return new MergeChain(parent)
  };

  MergeChain.prototype.onExisting = function onExisting (cb) {
    return this.set('onExisting', cb)
  };

  /**
   * @since 1.0.1
   * @desc can pass in a function to check values, such as ignoring notReal
   * @example .onValue(val => val !== null && val !== undefined)
   * @param  {Function} cb
   * @return {MergeChain} @chainable
   */
  MergeChain.prototype.onValue = function onValue (cb) {
    return this.set('onValue', cb)
  };

  /**
   * @since 1.0.2
   * @desc for using custom callback
   * @param  {Object} obj
   * @return {MergeChain} @chainable
   */
  MergeChain.prototype.obj = function obj (obj$1) {
    return this.set('obj', obj$1)
  };

  /**
   * @since 1.0.2
   * @desc options for merging with dopemerge
   *       @modifies this.merger | this.opts
   * @param  {Object | Function} opts
   * @return {MergeChain} @chainable
   *
   * @example
   * {
   *   stringToArray: true,
   *   boolToArray: false,
   *   boolAsRight: true,
   *   ignoreTypes: ['null', 'undefined', 'NaN'],
   *   debug: false,
   * }
   *
   * @example
   *  .merger(require('lodash.mergewith')())
   */
  MergeChain.prototype.merger = function merger (opts) {
    if (_function(opts)) { return this.set('merger', opts) }
    return this.set('opts', opts)
  };

  /**
   * @since 1.0.0
   *
   * @TODO issue here if we extend without shorthands &
   *       we want to merge existing values... :s
   *
   * @desc merges object in, goes through all keys, checks cbs, dopemerges
   * @param  {Object} obj2 object to merge in
   * @return {MergeChain} @chainable
   */
  MergeChain.prototype.merge = function merge (obj2) {
    var this$1 = this;

    var onExisting = this.get('onExisting');
    var onValue = this.get('onValue');
    var opts = this.get('opts') || {};
    var obj = this.has('obj') === true && !obj2 ? this.get('obj') : obj2 || {};
    var merger = this.get('merger');
    var sh = this.parent.shorthands || [];
    var keys = Object.keys(obj);

    // @TODO do this
    // if (obj2 instanceof Chainable) {
    //   // is map
    //   if (obj2.entries) obj2 = obj2.entries()
    //   // set, much easier to merge
    //   // else if (obj2.values)
    // }
    // @TODO isEqual here?
    //
    // @NOTE
    // since this would be slower
    // if I want to not have a speedy default when using .onExisting
    // need to note to use .extend
    // when using chains without a class & doing .merge (edge-case)
    var handleExisting = function (key, value) {
      // when fn is a full method, not an extended shorthand
      var hasFn = _function(this$1.parent[key]);
      var hasKey = this$1.parent.has(key);
      var set = function (k, v) { return (hasFn ? this$1.parent[k](v) : this$1.parent.set(k, v)); };

      // check if it is shorthanded
      // has a value already
      if (hasKey === true) {
        // get that value
        var existing = this$1.parent.get(key);

        // if we have a cb, call it
        // default to dopemerge
        if (onExisting === undefined) {
          // console.log('no onExisting', {existing, value, key})
          set(key, merger(existing, value, opts));
        }
        else {
          // maybe we should not even have `.onExisting`
          // since we can just override merge method...
          // and then client can just use a custom merger...
          //
          // could add and remove subscriber but that's overhead and ug
          // tricky here, because if we set a value that was just set...
          // console.log('has onExisting', {existing, value, key, onExisting})
          set(key, onExisting(existing, value, opts));
        }
      }
      else {
        set(key, value);
      }
    };

    for (var k = 0, len = keys.length; k < len; k++) {
      var key = keys[k];
      var value = obj[key];
      var method = this$1.parent[key];

      // use onValue when set
      if (!onValue(value, key, this$1)) {
        // console.log('used onValue returning false')
        continue
      }
      else if (method instanceof Chainable) {
        // when property itself is a Chainable
        this$1.parent[key].merge(value);
      }
      else if (method || sh.includes(key)) {
        // console.log('has method or shorthand')
        handleExisting(key, value);
      }
      else {
        // console.log('went to default')
        // default to .set on the store
        this$1.parent.set(key, value);
      }
    }

    return this.parent
  };

  return MergeChain;
}(Chainable_1));

var MergeChain_1 = MergeChain;

var reduce = function (map) {
  var entries = Array.from(map.entries());

  var reduced = {};
  if (entries.length !== 0) {
    reduced = entries.reduce(function (acc, ref) {
      var key = ref[0];
      var value = ref[1];

      acc[key] = value;
      return acc
    }, {});
  }
  return reduced
};

// Object.prototype.toString.call(val) === '[object Object]' &&
var objWithKeys = function (val) { return toS(val) && Object.keys(val).length === 0; };

var map$1 = function (obj) { return obj instanceof Map || toS(obj) === '[object Map]'; };

var real = function (x) { return x !== null && x !== undefined && !isNaN(x); };

var ignored = function (k) { return k === 'inspect' ||
  k === 'parent' ||
  k === 'store' ||
  k === 'shorthands' ||
  k === 'decorated' ||
  // k === 'transformers' ||
  k === 'className'; };

var isMapish = function (x) { return x && (x instanceof Chainable_1 || map$1(x)); };

// const keys = (obj, fn) => Object.keys(obj).forEach(fn)

/**
 * @tutorial https://ponyfoo.com/articles/es6-maps-in-depth
 * @tutorial https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map
 * @inheritdoc
 * @type {Chainable}
 * @prop {Array} shorthands
 * @prop {Map} store
 */
var ChainedMap = (function (Chainable) {
  function ChainedMap(parent) {
    Chainable.call(this, parent);
    this.shorthands = [];
    this.store = new Map();

    // @TODO for wrapping methods to force return `this`
    // this.chainableMethods = []
  }

  if ( Chainable ) ChainedMap.__proto__ = Chainable;
  ChainedMap.prototype = Object.create( Chainable && Chainable.prototype );
  ChainedMap.prototype.constructor = ChainedMap;

  /**
   * @since 0.7.0
   * @see this.set, this.get
   * @desc   tap a value with a function
   *         @modifies this.store.get(name)
   *
   * @example
   *  chain
   *    .set('moose', {eh: true})
   *    .tap('moose', moose => {moose.eh = false; return moose})
   *    .get('moose') === {eh: false}
   *
   * @param  {string | any} name key to `.get`
   * @param  {Function} fn function to tap with
   * @return {Chain} @chainable
   */
  ChainedMap.prototype.tap = function tap (name, fn) {
    var old = this.get(name);
    var updated = fn(old, dopemerge_1);
    return this.set(name, updated)
  };

  /**
   * @since 0.5.0
   * @TODO needs improvements like parsing stringify
   *       since it is just .merge atm
   *
   * @desc checks each property of the object
   *       calls the chains accordingly
   *
   * @example chain.from({eh: true}) === chain.eh(true)
   *
   * @param {Object} obj
   * @return {Chainable} @chainable
   */
  ChainedMap.prototype.from = function from (obj) {
    var this$1 = this;

    Object.keys(obj).forEach(function (key) {
      var val = obj[key];

      if (this$1[key] && this$1[key].merge) {
        return this$1[key].merge(val)
      }
      if (_function(this$1[key])) {
        // const fnStr = typeof fn === 'function' ? fn.toString() : ''
        // if (fnStr.includes('return this') || fnStr.includes('=> this')) {
        return this$1[key](val)
      }

      return this$1.set(key, val)
    });
    return this
  };

  /**
   * @since 0.4.0
   * @desc shorthand methods, from strings to functions that call .set
   * @example this.extend(['eh']) === this.eh = val => this.set('eh', val)
   * @param  {Array<string>} methods
   * @return {ChainedMap}
   */
  ChainedMap.prototype.extend = function extend (methods) {
    var this$1 = this;

    methods.forEach(function (method) {
      this$1.shorthands.push(method);
      this$1[method] = function (value) { return this$1.set(method, value); };
    });
    return this
  };

  /**
   * @since 0.4.0
   * @desc clears the map,
   *       goes through this properties,
   *       calls .clear if they are instanceof Chainable or Map
   *
   * @see https://github.com/fliphub/flipchain/issues/2
   * @return {ChainedMap} @chainable
   */
  ChainedMap.prototype.clear = function clear () {
    var this$1 = this;

    this.store.clear();
    Object.keys(this).forEach(function (key) {
      /* prettier-ignore */
      ignored(key)
      ? 0
      : isMapish(this$1[key])
        ? this$1[key].clear()
        : 0;
    });

    return this
  };

  /**
   * @since 0.4.0
   * @desc spreads the entries from ChainedMap.store (Map)
   *       return store.entries, plus all chain properties if they exist
   * @param  {boolean} [chains=false] if true, returns all properties that are chains
   * @return {Object}
   */
  ChainedMap.prototype.entries = function entries (chains) {
    if ( chains === void 0 ) chains = false;

    var reduced = reduce(this.store);

    if (chains === false) { return reduced }

    var add = function (self) {
      Object.keys(self).forEach(function (k) {
        if (ignored(k)) { return }
        var val = self[k];
        if (val && _function(val.entries)) {
          Object.assign(reduced, ( obj = {}, obj[k] = val.entries(true) || {}, obj ));
          var obj;
        }
      });

      return {add: add, reduced: reduced}
    };

    return add(this).add(reduced).reduced
  };

  /**
   * @since 0.4.0
   * @example chain.set('eh', true).get('eh') === true
   * @param  {any} key
   * @return {any}
   */
  ChainedMap.prototype.get = function get (key) {
    return this.store.get(key)
  };

  /**
   * @see ChainedMap.store
   * @since 0.4.0
   * @desc sets the value using the key on store
   * @example chain.set('eh', true).get('eh') === true
   * @param {any} key
   * @param {any} value
   * @return {ChainedMap}
   */
  ChainedMap.prototype.set = function set (key, value) {
    this.store.set(key, value);
    return this
  };

  /**
   * @TODO needs to pass in additional opts somehow...
   * @see dopemerge, MergeChain
   * @since 0.4.0
   *       ...as second arg? on instance property?
   * @example chain.set('eh', [1]).merge({eh: [2]}).get('eh') === [1, 2]
   * @desc merges an object with the current store
   * @param {Object} obj object to merge
   * @param {Function | null} cb return the merger to the callback
   * @return {ChainedMap} @chainable
   */
  ChainedMap.prototype.merge = function merge (obj, cb) {
    if ( cb === void 0 ) cb = null;

    var merger = MergeChain_1.init(this);
    if (cb === null) {
      merger.merge(obj);
    }
    else {
      cb(merger.obj(obj));
    }
    return this
  };

  /**
   * @since 0.4.0
   * @desc goes through the maps,
   *       and the map values,
   *       reduces them to array
   *       then to an object using the reduced values
   *
   * @param {Object} obj object to clean, usually .entries()
   * @return {Object}
   */
  ChainedMap.prototype.clean = function clean (obj) {
    return Object.keys(obj).reduce(function (acc, key) {
      var val = obj[key];
      if (!real(val)) { return acc }
      if (array$4(val) && !val.length) { return acc }
      if (objWithKeys(val)) { return acc }

      acc[key] = val;

      return acc
    }, {})
  };

  return ChainedMap;
}(Chainable_1));

var ChainedMap_1 = ChainedMap;

var regexp = function (obj) { return obj instanceof RegExp || toS(obj) === '[object RegExp]'; };

var error$1 = function (obj) { return obj instanceof Error || toS(obj) === '[object Error]'; };

var boolean_1 = function (obj) { return obj === true || obj === false || toS(obj) === '[object Boolean]'; };

var number = function (obj) { return toS(obj) === '[object Number]' ||
  (/^0x[0-9a-f]+$/i).test(obj) ||
  (/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/).test(obj); };

var string = function (obj) { return typeof obj === 'string' || toS(obj) === '[object String]'; };

var date = function (obj) { return obj instanceof Date || toS(obj) === '[object Date]'; };

var isArray$3 = Array.isArray;
var objectKeys = Object.keys;
var hasOwnProperty$1 = function (x, y) { return Object.hasOwnProperty.call(x, y); };

// https://github.com/substack/js-traverse
// @TODO: symbol
var traverse = function(obj) {
  return new Traverse(obj)
};
var traverse_1 = traverse;

function Traverse(obj) {
  this.value = obj;
}

Traverse.prototype.get = function(ps) {
  var node = this.value;
  for (var i = 0; i < ps.length; i++) {
    var key = ps[i];
    if (!node || !hasOwnProperty$1(node, key)) {
      node = undefined;
      break
    }
    node = node[key];
  }
  return node
};

Traverse.prototype.has = function(ps) {
  var node = this.value;
  for (var i = 0; i < ps.length; i++) {
    var key = ps[i];
    if (!node || !hasOwnProperty$1(node, key)) {
      return false
    }
    node = node[key];
  }
  return true
};

Traverse.prototype.set = function(ps, value) {
  var node = this.value;
  for (var i = 0; i < ps.length - 1; i++) {
    var key = ps[i];
    if (!hasOwnProperty$1(node, key)) { node[key] = {}; }
    node = node[key];
  }
  node[ps[i]] = value;
  return value
};

Traverse.prototype.map = function(cb) {
  return walk(this.value, cb, true)
};

Traverse.prototype.forEach = function(cb) {
  this.value = walk(this.value, cb, false);
  return this.value
};

Traverse.prototype.reduce = function(cb, init) {
  var skip = arguments.length === 1;
  var acc = skip ? this.value : init;
  this.forEach(function(x) {
    if (!this.isRoot || !skip) {
      acc = cb.call(this, acc, x);
    }
  });
  return acc
};

Traverse.prototype.paths = function() {
  var acc = [];
  this.forEach(function(x) {
    acc.push(this.path);
  });
  return acc
};

Traverse.prototype.nodes = function() {
  var acc = [];
  this.forEach(function(x) {
    acc.push(this.node);
  });
  return acc
};

Traverse.prototype.clone = function() {
  var parents = [], nodes = [];

  return (function clone(src) {
    for (var i = 0; i < parents.length; i++) {
      if (parents[i] === src) {
        return nodes[i]
      }
    }

    if (pureObj(src)) {
      var dst = copy(src);

      parents.push(src);
      nodes.push(dst);

      forEach(objectKeys(src), function (key) {
        dst[key] = clone(src[key]);
      });

      parents.pop();
      nodes.pop();
      return dst
    }
    else {
      return src
    }
  })(this.value)
};

function walk(root, cb, immutable) {
  var path = [];
  var parents = [];
  var alive = true;

  return (function walker(node_) {
    var node = immutable ? copy(node_) : node_;
    var modifiers = {};

    var keepGoing = true;

    var state = {
      node: node,
      node_: node_,
      path: [].concat(path),
      parent: parents[parents.length - 1],
      parents: parents,
      key: path.slice(-1)[0],
      isRoot: path.length === 0,
      level: path.length,
      circular: null,
      update: function update(x, stopHere) {
        if (!state.isRoot) {
          state.parent.node[state.key] = x;
        }
        state.node = x;
        if (stopHere) { keepGoing = false; }
      },
      delete: function delete$1(stopHere) {
        delete state.parent.node[state.key];
        if (stopHere) { keepGoing = false; }
      },
      remove: function remove(stopHere) {
        // @NOTE safety
        if (state.parent === undefined) {
          return
        }
        else if (isArray$3(state.parent.node)) {
          state.parent.node.splice(state.key, 1);
        }
        else {
          delete state.parent.node[state.key];
        }
        if (stopHere) { keepGoing = false; }
      },
      keys: null,
      before: function before(f) {
        modifiers.before = f;
      },
      after: function after(f) {
        modifiers.after = f;
      },
      pre: function pre(f) {
        modifiers.pre = f;
      },
      post: function post(f) {
        modifiers.post = f;
      },
      stop: function stop() {
        alive = false;
      },
      block: function block() {
        keepGoing = false;
      },
    };

    if (!alive) { return state }

    function updateState() {
      if (pureObj(state.node)) {
        if (!state.keys || state.node_ !== state.node) {
          state.keys = objectKeys(state.node);
        }

        state.isLeaf = state.keys.length == 0;

        for (var i = 0; i < parents.length; i++) {
          if (parents[i].node_ === node_) {
            state.circular = parents[i];
            break
          }
        }
      }
      else {
        state.isLeaf = true;
        state.keys = null;
      }

      state.notLeaf = !state.isLeaf;
      state.notRoot = !state.isRoot;
    }

    updateState();

    // use return values to update if defined
    var ret = cb.call(state, state.node);
    if (ret !== undefined && state.update) { state.update(ret); }

    if (modifiers.before) { modifiers.before.call(state, state.node); }

    if (!keepGoing) { return state }

    if (pureObj(state.node) && !state.circular) {
      parents.push(state);

      updateState();

      forEach(state.keys, function (key, i) {
        path.push(key);

        if (modifiers.pre) { modifiers.pre.call(state, state.node[key], key); }

        var child = walker(state.node[key]);
        if (immutable && hasOwnProperty$1(state.node, key)) {
          state.node[key] = child.node;
        }

        child.isLast = i == state.keys.length - 1;
        child.isFirst = i == 0;

        if (modifiers.post) { modifiers.post.call(state, child); }

        path.pop();
      });
      parents.pop();
    }

    if (modifiers.after) { modifiers.after.call(state, state.node); }

    return state
  })(root).node
}

function copy(src) {
  // require('fliplog').data(src).bold('copying').echo()
  if (pureObj(src)) {
    var dst;

    // const reduce = require('./reduce')
    // const toarr = require('./to-arr')
    // require('fliplog').underline('is obj').echo()
    // @TODO:
    // if (isMap(src)) {
    //   require('fliplog').underline('is map').echo()
    //   dst = reduce(src.entries())
    // }
    // else if (isSet(src)) {
    //   dst = toarr(src)
    // }
    if (isArray$3(src)) {
      dst = [];
    }
    else if (date(src)) {
      dst = new Date(src.getTime ? src.getTime() : src);
    }
    else if (regexp(src)) {
      dst = new RegExp(src);
    }
    else if (error$1(src)) {
      dst = {message: src.message};
    }
    else if (boolean_1(src)) {
      dst = new Boolean(src);
    }
    else if (number(src)) {
      dst = new Number(src);
    }
    else if (string(src)) {
      dst = new String(src);
    }
    else if (Object.create && Object.getPrototypeOf) {
      dst = Object.create(Object.getPrototypeOf(src));
    }
    else if (src.constructor === Object) {
      dst = {};
    }
    else {
      // @NOTE: only happens if above getPrototypeOf does not exist
      var proto = (src.constructor && src.constructor.prototype) ||
      src.__proto__ || {};
      var T = function() {};
      T.prototype = proto;
      dst = new T();
    }

    forEach(objectKeys(src), function (key) {
      dst[key] = src[key];
    });
    return dst
  }
  else {
    // require('fliplog').red('is NOT OBJ').echo()
    return src
  }
}

/**
 * @TODO: unexpectedly breaks things iterating
 * if you are relying on internal functionality
 * (such as .path, .get, .value...) with map & set
 *
 * @desc if there is .forEach on the obj already, use it
 * otherwise, call function for each
 */
var forEach = function(xs, fn) {
  if (xs.forEach) { return xs.forEach(fn) }
  else { for (var i = 0; i < xs.length; i++) { fn(xs[i], i, xs); } }
};

forEach(objectKeys(Traverse.prototype), function (key) {
  traverse[key] = function(obj) {
    var args = [].slice.call(arguments, 1);
    var t = new Traverse(obj);
    return t[key].apply(t, args)
  };
});

var escapeStringRegex = function (str) { return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'); };

var toTest = function (key, arg1, arg2) {
  var type = typeof key;
  // log
  //   .dim('testing keys')
  //   .data({test, arg1, matched: test.test(arg1)})
  //   .echo(debug)
  if (type === 'string') {
    var test = new RegExp(escapeStringRegex(key));
    return !!test.test(arg1)
  }
  if (type === 'function' && !key.test) { return !!key(arg1) }
  return !!key.test(arg1, arg2)
};

/**
 * @since 1.0.0
 * @type {Set}
 */
var TraverseChain = (function (ChainedMap) {
  function Traverser(parent) {
    ChainedMap.call(this, parent);
    this.set('keys', []).set('vals', []);
    this.call = this.traverse.bind(this);
  }

  if ( ChainedMap ) Traverser.__proto__ = ChainedMap;
  Traverser.prototype = Object.create( ChainedMap && ChainedMap.prototype );
  Traverser.prototype.constructor = Traverser;

  /**
   * @since 1.0.0
   * @alias data
   * @param  {Object | null} [obj=null]
   * @param  {boolean} [isBuilder=null] whether it is a function returning sub traversers
   * @return {Cleaner} @chainable
   */
  Traverser.prototype.obj = function obj (obj, isBuilder) {
    if ( obj === void 0 ) obj = null;
    if ( isBuilder === void 0 ) isBuilder = false;

    if (!obj) { return this }
    return this.set('obj', obj) // .set('isBuilder', isBuilder)
  };

  /**
   * @since 1.0.0
   * @desc matches for value
   *       @modifies this.vals
   * @param  {Array<Regexp | Function>} tests
   * @return {Traverser} @chainable
   */
  Traverser.prototype.keys = function keys (tests) {
    return this.set('keys', tests)
  };

  /**
   * @since 1.0.0
   * @desc matches for value
   *       @modifies this.vals
   * @param  {Array<Regexp | Function>} tests
   * @return {Traverser} @chainable
   */
  Traverser.prototype.vals = function vals (tests) {
    return this.set('vals', tests)
  };

  /**
   * @since 1.0.0
   * @desc callback for each match
   *       @modifies this.onMatch
   * @param  {Function} [cb=null] defaults to .remove
   * @return {Matcher} @chainable
   */
  Traverser.prototype.onMatch = function onMatch (cb) {
    if ( cb === void 0 ) cb = null;

    if (cb === null) {
      return this.set('onMatch', function (arg, traverser) {
        traverser.remove();
      })
    }

    return this.set('onMatch', cb)
  };

  /**
   * @since 1.0.0
   * @desc callback for each match
   *       @modifies this.onMatch
   * @param  {Function} [cb=null] defaults to .remove
   * @return {Matcher} @chainable
   */
  Traverser.prototype.onNonMatch = function onNonMatch (cb) {
    if ( cb === void 0 ) cb = null;

    return this.set('onNonMatch', cb)
  };

  /**
   * @since 1.0.0
   * @alias call
   * @desc runs traverser, checks the tests, calls the onMatch
   *       @modifies this.cleaned
   * @param  {boolean} [shouldReturn=false] returns object
   * @return {any} this.obj/data cleaned
   */
  Traverser.prototype.traverse = function traverse$1$$1 (shouldReturn) {
    if (this.has('onMatch') === false) { this.onMatch(); }

    var ref = this.entries();
    var obj = ref.obj;
    var keys = ref.keys;
    var vals = ref.vals;
    var onMatch = ref.onMatch;
    var onNonMatch = ref.onNonMatch;
    var result = obj;

    // console.log('starting match...')
    // log.bold('key val matchers').fmtobj({keys, vals}).echo(debug)

    // diff between keys and val is order of arg in ^ tester
    var matcher = function (prop, val) {
      for (var i = 0; i < keys.length; i++) {
        if (toTest(keys[i], prop, val)) { return true }
      }
      for (var i$1 = 0; i$1 < vals.length; i$1++) {
        if (toTest(vals[i$1], val, prop)) { return true }
      }

      // log.red('did not match').fmtobj({prop, val}).echo(debug)
      return false
    };

    // bound to the traverser
    traverse_1(obj).forEach(function(x) {
      // log.data({ x, match }).bold(this.key).echo()
      // const match = matcher(this.key, x)
      if (matcher(this.key, x)) {
        // log.data({ x }).bold(this.key).echo()
        onMatch(x, this);
      }
      else if (onNonMatch) {
        onNonMatch(x, this);
        // log.data({ x }).red(this.key).echo()
      }
      // else {
      //   log.yellow('no match for me').data({key: this.key, path: this.path}).echo()
      // }
    });

    this.set('traversed', result);
    return shouldReturn === true ? result : this
  };

  /**
   * @see this.traverse
   * @return {Object | Array | any}
   */
  Traverser.prototype.traversed = function traversed () {
    return this.get('traversed')
  };

  return Traverser;
}(ChainedMap_1));

// const traverse = require('./traverse')
// const log = require('fliplog')

var clone;

var Cleaner = (function (ChainedMap) {
  function Cleaner(parent) {
    if ( parent === void 0 ) parent = null;

    ChainedMap.call(this, parent);
    this.data = this.obj.bind(this);
    this.clean = this.clean.bind(this);
  }

  if ( ChainedMap ) Cleaner.__proto__ = ChainedMap;
  Cleaner.prototype = Object.create( ChainedMap && ChainedMap.prototype );
  Cleaner.prototype.constructor = Cleaner;

  /**
   * @param  {Object | null} [obj=null]
   * @return {Cleaner} @chainable
   */
  Cleaner.init = function init (obj) {
    if ( obj === void 0 ) obj = null;

    if (obj === null) {
      return new Cleaner()
    }
    return new Cleaner().obj(obj).onMatch()
  };

  /**
   * @alias data
   * @param  {Object | null} [obj=null]
   * @return {Cleaner} @chainable
   */
  Cleaner.prototype.obj = function obj (obj) {
    if ( obj === void 0 ) obj = null;

    if (!obj) { return this }
    return this.set('obj', obj)
  };

  /**
   * @desc clone the object - lodash.cloneDeep can infinitely loop so need a better one
   * @since fliplog:v0.3.0-beta6
   * @param  {Object | any} [obj=null]
   * @return {Cleaner} @chainable
   */
  Cleaner.prototype.clone = function clone$1 (obj) {
    if ( obj === void 0 ) obj = null;

    clone = clone || index$4('lodash.clonedeep');
    return this.set('obj', clone(obj))
  };

  /**
   * @desc runs traverser, checks the tests, calls the onMatch
   *       @modifies this.cleaned
   * @return {any} this.obj/data cleaned
   */
  Cleaner.prototype.clean = function clean () {
    return this.set('cleaned',  this.traverse(true))
  };

  Cleaner.prototype.cleaned = function cleaned () {
    return this.get('cleaned')
  };

  return Cleaner;
}(TraverseChain));

var index$37 = Cleaner;

// for compatibility with nodejs + web
var custom = function noop() {};
if (isNode && index$33 && index$33.inspect && index$33.inspect.defaultOptions) {
  custom = index$33.inspect.defaultOptions.customInspect;
}

var index$31 = {
  cleaner: index$37,
  util: index$33,
  inspectorGadget: inspectorGadget_1,
  inspector: inspector_1,
  inspect: inspector_1,
  custom: function (arg) {
    if ( arg === void 0 ) arg = false;

    if (!isNode) {
      return inspector_1
    }
    if (arg !== true && arg !== false && arg !== null && arg !== undefined) {
      index$33.inspect.defaultOptions.customInspect = arg;
    } else if (arg) {
      index$33.inspect.defaultOptions.customInspect = custom;
    } else {
      index$33.inspect.defaultOptions.customInspect = false;
    }
    return inspector_1
  },
};

var inspect = {
  // pass in options for cleaner and use .from?
  // clean(data) {}
  inspectorGadget: function inspectorGadget() {
    return index$31
  },

  /**
   * @desc create a new cleaner, or return the lib
   * @see inspector-gadget/cleaner
   * @param {Object | boolean} [from=null] used to call methods on cleaner if needed, true returns as a lib
   * @return {Cleaner | FlipChain} has .echo bound to FlipChain
   */
  cleaner: function cleaner(from) {
    var this$1 = this;
    if ( from === void 0 ) from = null;

    if (from === true) {
      var cleaner$1 = new index$31.cleaner(this);
      cleaner$1.end = function () { return this$1.data(cleaner$1.get('cleaned')); };
      cleaner$1.echo = function () { return this$1.data(cleaner$1.get('cleaned')).echo(); };
      return cleaner$1
    }

    var cleaner = new index$31.cleaner(this).data(this.get('data'));

    if (from !== null && typeof from === 'object') {
      if (from.keys) { cleaner.keys(from.keys); }
      if (from.vals) { cleaner.vals(from.vals); }
      if (from.onMatch) { cleaner.onMatch(from.onMatch); }
      if (from.data) { cleaner.data(from.data); }
    }

    cleaner.log = this;
    cleaner.end = function () { return this$1.data(cleaner.get('cleaned')); };
    cleaner.echo = function () { return this$1.data(cleaner.get('cleaned')).echo(); };

    return cleaner
  },
  inspector: function inspector() {
    return index$31.inspect
  },
  customInspect: function customInspect() {
    return index$31.customInspect
  },
};

// presets
function presetError(chain) {
  return chain.text(chain.chalk().bgRed.black('🚨  error: ') + '\n\n').verbose(10)
}
function presetWarning(chain) {
  return chain.text('⚠  warning: ').color('bgYellow.black').verbose(10)
}
function presetInfo(chain) {
  return chain.text('ℹ️️  info:').color('blue')
}
function presetNote(chain) {
  return chain.text('📋️  note:').color('dim')
}
function presetImportant(chain) {
  return chain.text('❗  important:').color('red.bold')
}

var ignored$1 = [
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'propertyIsEnumerable',
  'toString',
  'toLocaleString',
  'valueOf',
  'isPrototypeOf' ];

function presetHidden(chain) {
  /* prettier-ignore */
  var allKeys = function (obj) { return Object
      .getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj)); };
  // .concat(Object.keys(obj))

  /* prettier-ignore */
  var formatter = function (data) { return allKeys(Object.getPrototypeOf(data))
    .concat(allKeys(data))
    .filter(function (key) { return !ignored$1.includes(key); })
    .map(function (key) { return (( obj = {}, obj[key] = Object.getOwnPropertyDescriptor(data, key), obj ))
      var obj; }); };

  return chain.verbose(100).formatter(formatter)
}

var presets = {
  reset: function reset() {
    this.addPreset('error', presetError);
    this.addPreset('warning', presetWarning);
    this.addPreset('info', presetInfo);
    this.addPreset('note', presetNote);
    this.addPreset('important', presetImportant);
    this.addPreset('desc', presetHidden);
  },

  /**
   * @param {string} name
   * @param {Object} preset
   * @return {FlipLog}
   */
  addPreset: function addPreset(name, preset) {
    var this$1 = this;

    this.presets[name] = preset;
    if (this[name] === undefined) {
      this[name] = function () { return this$1.preset(name); };
    }
    return this
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog#-presets
   * @param {Array<Object> | Object} names
   * @return {FlipLog}
   */
  preset: function preset(names) {
    var this$1 = this;

    if (!Array.isArray(names)) { names = [names]; }

    Object.keys(names).forEach(function (index) {
      var name = names[index];
      this$1.presets[name](this$1);
    });

    return this
  },
};

function define$1(t){Object.defineProperty(t,"length",{configurable:!0,enumerable:!1,get:function(){return this.store.size}}),Object.defineProperty(t,instance$2,{configurable:!0,enumerable:!1,value:function(e,r){return e&&(Object.prototype.isPrototypeOf.call(e,t)||!!e.className||!!e.parent||!!e.store)}});}function isMergeableObj$1(t){return pureObj$2(t)&&!["[object RegExp]","[object Date]"].includes(toS$3(t))}function emptyTarget$1(t){return array$6(t)?[]:{}}function cloneIfNeeded$1(t,e){return!0===e.clone&&isMergeableObj$1(t)?deepmerge$1(emptyTarget$1(t),t,e):t}function defaultArrayMerge$1(t,e,r){var n=t.slice();return e.forEach(function(e,o){void 0===n[o]?n[o]=cloneIfNeeded$1(e,r):isMergeableObj$1(e)?n[o]=deepmerge$1(t[o],e,r):-1===t.indexOf(e)&&n.push(cloneIfNeeded$1(e,r));}),n}function mergeObj$1(t,e,r){var n={};return isMergeableObj$1(t)&&Object.keys(t).forEach(function(e){n[e]=cloneIfNeeded$1(t[e],r);}),Object.keys(e).forEach(function(o){isMergeableObj$1(e[o])&&t[o]?n[o]=deepmerge$1(t[o],e[o],r):n[o]=cloneIfNeeded$1(e[o],r);}),n}function deepmerge$1(t,e,r){if(array$6(e)){var n=r.arrayMerge;return array$6(t)?n(t,e,r):cloneIfNeeded$1(e,r)}return mergeObj$1(t,e,r)}function eqq$1(t,e){return t[0]===e[0]&&t[1]===e[1]}function eqCurry$1(t){return eqq$1.bind(null,t)}function getDefaults$1(){return{arrayMerge:defaultArrayMerge$1,stringToArray:!0,boolToArray:!1,boolAsRight:!0,ignoreTypes:["null","undefined","NaN"],debug:!0}}function dopemerge$2(t,e,r){if(void 0===r&&(r={}),t===e){ return t; }var n=Object.assign(getDefaults$1(),r),o=n.ignoreTypes,i=n.stringToArray,s=n.boolToArray,a=n.clone,u=[ezType$1(t),ezType$1(e)];if(!0===o.includes(u[0])){ return e; }if(!0===o.includes(u[1])){ return t; }var c=eqCurry$1(u);switch(!0){case c(["boolean","boolean"]):return s?[t,e]:e;case c(["string","string"]):return i?[t,e]:t+e;case c(["array","string"]):return(a?t.slice(0):t).concat([e]);case c(["string","array"]):return(a?e.slice(0):e).concat([t]);default:return deepmerge$1(t,e,n)}}function Traverse$1(t){this.value=t;}function walk$1(t,e,r){var n=[],o=[],i=!0;return function t(s){function a(){if(pureObj$2(p.node)){p.keys&&p.node_===p.node||(p.keys=objectKeys$1(p.node)),p.isLeaf=0==p.keys.length;for(var t=0;t<o.length;t++){ if(o[t].node_===s){p.circular=o[t];break} }}else { p.isLeaf=!0,p.keys=null; }p.notLeaf=!p.isLeaf,p.notRoot=!p.isRoot;}var u={},c=!0,p={node:r?copy$1(s):s,node_:s,path:[].concat(n),parent:o[o.length-1],parents:o,key:n.slice(-1)[0],isRoot:0===n.length,level:n.length,circular:null,update:function(t,e){p.isRoot||(p.parent.node[p.key]=t),p.node=t,e&&(c=!1);},delete:function(t){delete p.parent.node[p.key],t&&(c=!1);},remove:function(t){void 0!==p.parent&&(isArray$1$1(p.parent.node)?p.parent.node.splice(p.key,1):delete p.parent.node[p.key],t&&(c=!1));},keys:null,before:function(t){u.before=t;},after:function(t){u.after=t;},pre:function(t){u.pre=t;},post:function(t){u.post=t;},stop:function(){i=!1;},block:function(){c=!1;}};if(!i){ return p; }a();var f=e.call(p,p.node);return void 0!==f&&p.update&&p.update(f),u.before&&u.before.call(p,p.node),c?(pureObj$2(p.node)&&!p.circular&&(o.push(p),a(),forEach$1(p.keys,function(e,o){n.push(e),u.pre&&u.pre.call(p,p.node[e],e);var i=t(p.node[e]);r&&hasOwnProperty$2(p.node,e)&&(p.node[e]=i.node),i.isLast=o==p.keys.length-1,i.isFirst=0==o,u.post&&u.post.call(p,i),n.pop();}),o.pop()),u.after&&u.after.call(p,p.node),p):p}(t).node}function copy$1(t){if(pureObj$2(t)){var e;if(isArray$1$1(t)){ e=[]; }else if(date$2(t)){ e=new Date(t.getTime?t.getTime():t); }else if(regexp$2(t)){ e=new RegExp(t); }else if(error$1$1(t)){ e={message:t.message}; }else if(boolean_1$2(t)){ e=new Boolean(t); }else if(number$2(t)){ e=new Number(t); }else if(string$2(t)){ e=new String(t); }else if(Object.create&&Object.getPrototypeOf){ e=Object.create(Object.getPrototypeOf(t)); }else if(t.constructor===Object){ e={}; }else{var r=t.constructor&&t.constructor.prototype||t.__proto__||{},n=function(){};n.prototype=r,e=new n;}return forEach$1(objectKeys$1(t),function(r){e[r]=t[r];}),e}return t}function getDecoration(t){var e=pureObj$2(t)?Object.keys(t).pop():t.method||t;return{method:e,returnee:t.return,key:t.key||e,cb:pureObj$2(t)?t[e]:null}}function compose(t,e){void 0===t&&(t=ChainedMap_1$2),void 0===e&&(e=!0);var r=t,n=e;return!0===n?"object"==typeof r&&!1===_class(r)?(n=r,r=ChainedMap_1$2):n={symbols:!0,define:!0,observe:!0,shorthands:!0,transform:!0,types:!0,dot:!0,extend:!0}:n={},!0===n.extend&&(r=Extend(r)),!0===n.define&&(r=Define(r)),!0===n.observe&&(r=Observe_1(r)),!0===n.shorthands&&(r=Shorthands_1(r)),!0===n.transform&&(r=Transform_1(r)),!0===n.types&&(r=Types(r)),!0===n.dot&&(r=DotProp_1(r)),r}var iterator$2=Symbol.iterator; var instance$2=Symbol.hasInstance; var primative$2=Symbol.toPrimitive; var F$1=Function.prototype; var Chainable$2=function(t){t&&(this.parent=t),this.className=this.constructor.name;};Chainable$2.prototype[iterator$2]=function(){var t=!!this.entries&&this.entries(),e=this.values(),r=this.store.size,n=!1===t?new Array(r):Object.keys(t);return{i:0,next:function(){var o=this.i,i=o,s=e[o];return t&&(i=n[o]),void 0===i&&void 0===s||r<=o?{value:void 0,done:!0}:(this.i++,{value:[i,s],done:!1})}}},Chainable$2.prototype[instance$2]=function(t){return Chainable$2[instance$2](t,this)},Chainable$2.prototype.end=function(){return this.parent},Chainable$2.prototype.when=function(t,e,r){return void 0===e&&(e=F$1),void 0===r&&(r=F$1),t?e(this):r(this),this},Chainable$2.prototype.clear=function(){return this.store.clear(),this},Chainable$2.prototype.delete=function(t){return this.store.delete(t),this},Chainable$2.prototype.has=function(t){return this.store.has(t)},Chainable$2.prototype.values=function(){var t=[];return this.store.forEach(function(e){return t.push(e)}),t},Chainable$2.prototype[primative$2]=function(t){var e=this;if("number"===t&&this.toNumber){ return this.toNumber(); }if("string"===t&&this.toString){ return this.toString(); }if(void 0!==this.getContents){var r=this.getContents();if("string"==typeof r){ return r }}for(var n=["toPrimative","toNumber","toArray","toJSON","toBoolean","toObject"],o=0;o<n.length;o++){ if(void 0!==e[n[o]]){ return e[n[o]](t); } }return this.toString()},define$1(Chainable$2),define$1(Chainable$2.prototype);var Chainable_1$2=Chainable$2; var pureObj$2=function(t){return null!==t&&"object"==typeof t}; var array$6=Array.isArray; var toS$3=function(t){return Object.prototype.toString.call(t)}; var ezType$1=function(t){return array$6(t)?"array":typeof t}; var dopemerge_1$2=dopemerge$2; var _function$2=function(t){return"function"==typeof t}; var MergeChain$2=function(t){function e(e){var r=this;t.call(this,e),this.store=new Map,this.set=function(t,e){return r.store.set(t,e),r},this.set("onValue",function(){return!0}).set("merger",dopemerge_1$2),this.get=function(t){return r.store.get(t)};}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.init=function(t){return new e(t)},e.prototype.onExisting=function(t){return this.set("onExisting",t)},e.prototype.onValue=function(t){return this.set("onValue",t)},e.prototype.obj=function(t){return this.set("obj",t)},e.prototype.merger=function(t){return _function$2(t)?this.set("merger",t):this.set("opts",t)},e.prototype.merge=function(e){for(var r=this,n=this.get("onExisting"),o=this.get("onValue"),i=this.get("opts")||{},s=!0!==this.has("obj")||e?e||{}:this.get("obj"),a=this.get("merger"),u=this.parent.shorthands||[],c=Object.keys(s),p=0,f=c.length;p<f;p++){var h=c[p],l=s[h],d=r.parent[h];o(l,h,r)&&(d instanceof t?r.parent[h].merge(l):d||u.includes(h)?function(t,e){var o=_function$2(r.parent[t]),s=function(t,e){return o?r.parent[t](e):r.parent.set(t,e)};if(!0===r.parent.has(t)){var u=r.parent.get(t);void 0===n?s(t,a(u,e,i)):s(t,n(u,e,i));}else { s(t,e); }}(h,l):r.parent.set(h,l));}return this.parent},e}(Chainable_1$2); var MergeChain_1$2=MergeChain$2; var reduce$3=function(t){var e=Array.from(t.entries()),r={};return 0!==e.length&&(r=e.reduce(function(t,e){var r=e[0],n=e[1];return t[r]=n,t},{})),r}; var objWithKeys$2=function(t){return toS$3(t)&&0===Object.keys(t).length}; var map$3=function(t){return t instanceof Map||"[object Map]"===toS$3(t)}; var real$2=function(t){return null!==t&&void 0!==t&&!isNaN(t)}; var ignored$2=function(t){return"inspect"===t||"parent"===t||"store"===t||"shorthands"===t||"decorated"===t||"className"===t}; var isMapish$1=function(t){return t&&(t instanceof Chainable_1$2||map$3(t))}; var ChainedMap$3=function(t){function e(e){t.call(this,e),this.shorthands=[],this.store=new Map;}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.tap=function(t,e){var r=e(this.get(t),dopemerge_1$2);return this.set(t,r)},e.prototype.from=function(t){var e=this;return Object.keys(t).forEach(function(r){var n=t[r];return e[r]&&e[r].merge?e[r].merge(n):_function$2(e[r])?e[r](n):e.set(r,n)}),this},e.prototype.extend=function(t){var e=this;return t.forEach(function(t){e.shorthands.push(t),e[t]=function(r){return e.set(t,r)};}),this},e.prototype.clear=function(){var t=this;return this.store.clear(),Object.keys(this).forEach(function(e){ignored$2(e)||isMapish$1(t[e])&&t[e].clear();}),this},e.prototype.entries=function(t){void 0===t&&(t=!1);var e=reduce$3(this.store);if(!1===t){ return e; }var r=function(t){return Object.keys(t).forEach(function(r){if(!ignored$2(r)){var n=t[r];if(n&&_function$2(n.entries)){Object.assign(e,(o={},o[r]=n.entries(!0)||{},o));var o;}}}),{add:r,reduced:e}};return r(this).add(e).reduced},e.prototype.get=function(t){return this.store.get(t)},e.prototype.set=function(t,e){return this.store.set(t,e),this},e.prototype.merge=function(t,e){void 0===e&&(e=null);var r=MergeChain_1$2.init(this);return null===e?r.merge(t):e(r.obj(t)),this},e.prototype.clean=function(t){return Object.keys(t).reduce(function(e,r){var n=t[r];return real$2(n)?array$6(n)&&!n.length?e:objWithKeys$2(n)?e:(e[r]=n,e):e},{})},e}(Chainable_1$2); var ChainedMap_1$2=ChainedMap$3; var toArr$3=function(t){if(!t){ return[]; }if(Array.isArray(t)){ return t; }if("string"==typeof t){ return t.includes(",")?t.split(","):[t]; }if(t instanceof Set||t instanceof Map||t.values){var e=[];return t.values().forEach(function(t){return e.push(t)}),e}return[t]}; var species=Symbol.species; var spreadable=Symbol.isConcatSpreadable; var ChainedSet=function(t){function e(e){t.call(this,e),this.store=new Set;}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.add=function(t){return this.store.add(t),this},e.prototype.prepend=function(e){return this.store=new Set([e].concat(t.prototype.values.call(this))),this},e.prototype.merge=function(t){var e=this;return toArr$3(t).forEach(function(t){return e.store.add(t)}),this},e}(Chainable_1$2); var d=function(t){return function(e){return function(r){return t.map(function(t){return Object.defineProperty(t,e,{configurable:!0,enumerable:!1,get:function(){return r}})})}}}; var set=d([ChainedSet.prototype,ChainedSet]);set(species)(Set),set(spreadable)(!0);var ChainedSet_1=ChainedSet; var regexp$2=function(t){return t instanceof RegExp||"[object RegExp]"===toS$3(t)}; var error$1$1=function(t){return t instanceof Error||"[object Error]"===toS$3(t)}; var boolean_1$2=function(t){return!0===t||!1===t||"[object Boolean]"===toS$3(t)}; var number$2=function(t){return"[object Number]"===toS$3(t)||/^0x[0-9a-f]+$/i.test(t)||/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(t)}; var string$2=function(t){return"string"==typeof t||"[object String]"===toS$3(t)}; var date$2=function(t){return t instanceof Date||"[object Date]"===toS$3(t)}; var isArray$1$1=Array.isArray; var objectKeys$1=Object.keys; var hasOwnProperty$2=function(t,e){return Object.hasOwnProperty.call(t,e)}; var traverse$2=function(t){return new Traverse$1(t)}; var traverse_1$2=traverse$2;Traverse$1.prototype.get=function(t){for(var e=this.value,r=0;r<t.length;r++){var n=t[r];if(!e||!hasOwnProperty$2(e,n)){e=void 0;break}e=e[n];}return e},Traverse$1.prototype.has=function(t){for(var e=this.value,r=0;r<t.length;r++){var n=t[r];if(!e||!hasOwnProperty$2(e,n)){ return!1; }e=e[n];}return!0},Traverse$1.prototype.set=function(t,e){for(var r=this.value,n=0;n<t.length-1;n++){var o=t[n];hasOwnProperty$2(r,o)||(r[o]={}),r=r[o];}return r[t[n]]=e,e},Traverse$1.prototype.map=function(t){return walk$1(this.value,t,!0)},Traverse$1.prototype.forEach=function(t){return this.value=walk$1(this.value,t,!1),this.value},Traverse$1.prototype.reduce=function(t,e){var r=1===arguments.length,n=r?this.value:e;return this.forEach(function(e){this.isRoot&&r||(n=t.call(this,n,e));}),n},Traverse$1.prototype.paths=function(){var t=[];return this.forEach(function(e){t.push(this.path);}),t},Traverse$1.prototype.nodes=function(){var t=[];return this.forEach(function(e){t.push(this.node);}),t},Traverse$1.prototype.clone=function(){var t=[],e=[];return function r(n){for(var o=0;o<t.length;o++){ if(t[o]===n){ return e[o]; } }if(pureObj$2(n)){var i=copy$1(n);return t.push(n),e.push(i),forEach$1(objectKeys$1(n),function(t){i[t]=r(n[t]);}),t.pop(),e.pop(),i}return n}(this.value)};var forEach$1=function(t,e){if(t.forEach){ return t.forEach(e); }for(var r=0;r<t.length;r++){ e(t[r],r,t); }};forEach$1(objectKeys$1(Traverse$1.prototype),function(t){traverse$2[t]=function(e){var r=[].slice.call(arguments,1),n=new Traverse$1(e);return n[t].apply(n,r)};});var _class=function(t){return/^\s*class\s/.test(t.toString())}; var camelCase$2=function(t){return t.replace(/\s+/g,"_").replace(/[_.-](\w|$)/g,function(t,e){return e.toUpperCase()})}; var index$4$1={Iterator:Symbol.iterator,Primative:Symbol.toPrimitive,Instance:Symbol.hasInstance,Spreadable:Symbol.isConcatSpreadable,Species:Symbol.species}; var Primative$1=index$4$1.Primative; var OFF$3="536870872@@"; var Define=function(t,e){return void 0===t&&(t=ChainedMap_1$2),function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.defineGetSet=function(t){var e=this;return t.forEach(function(t){var r=e[t]&&e[t].bind?e[t].bind(e):e[t],n=function(){return r()},o=function(t){return void 0===t&&(t=OFF$3),t===OFF$3?n():r(t)};Object.defineProperty(e,t,{configurable:!0,enumerable:!0,get:n,set:o});}),this},e.prototype.extendGetSet=function(t,e){var r=this;return t.forEach(function(t){var e,n,o="string"==typeof t?t:t.name;e=t.get?function(e){return t.get(e)}:function(t){return r.get(o)};var i=t.set?function(e,r,n){return t.set(e,r,n)}:function(t){return r.set(o,t)};n=function(t,r,n){return void 0===t&&(t=OFF$3),t===OFF$3?e():i(t,r,n)},r[camelCase$2("get-"+o)]=e,r[camelCase$2("set-"+o)]=n,r.shorthands.push(o),Object.defineProperty(r,o,{configurable:!0,enumerable:!0,get:function(t){var r=function(t){return void 0===t&&(t=OFF$3),n(t)};return r[Primative$1]=function(t){return e(OFF$3)},r.valueOf=function(){return e(OFF$3)},r},set:function(t,e,r){return void 0===t&&(t=OFF$3),void 0===e&&(e=OFF$3),void 0===r&&(r=OFF$3),n(t,e,r)}});}),this},e}(t)}; var eq=function(t,e,r){void 0===r&&(r=!1);var n=!0,o=e;return traverse_1$2(t).forEach(function(t){var i=function(){n=!1;};if(!this.isRoot){if("object"!=typeof o){ return i(); }o=o[this.key];}var s=o;this.post(function(){o=s;});var a=function(t){return Object.prototype.toString.call(t)};if(this.circular){ traverse_1$2(e).get(this.circular.path)!==s&&i(); }else if(typeof s!=typeof t){ !0===r&&s==t||i(); }else if(null===s||null===t||void 0===s||void 0===t){ s!==t&&i(); }else if(s.__proto__!==t.__proto__){ i(); }else if(s===t){  }else if("function"==typeof s){ s instanceof RegExp?s.toString()!=t.toString()&&i():s!==t&&i(); }else if("object"==typeof s){ if("[object Arguments]"===a(t)||"[object Arguments]"===a(s)){ a(s)!==a(t)&&i(); }else if("[object RegExp]"===a(t)||"[object RegExp]"===a(s)){ s&&t&&s.toString()===t.toString()||i(); }else if(s instanceof Date||t instanceof Date){ s instanceof Date&&t instanceof Date&&s.getTime()===t.getTime()||i(); }else{var u=Object.keys(s),c=Object.keys(t);if(u.length!==c.length){ return i(); }for(var p=0;p<u.length;p++){var f=u[p];Object.hasOwnProperty.call(t,f)||i();}} }}),n}; var objs={}; var Observe_1=function(t,e){return void 0===t&&(t=ChainedMap_1$2),function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.observe=function(t,e){var r=this;return void 0===this.observers&&(this.observers=new ChainedSet_1(this)),this.observers.add(function(n){var o={},i=toArr$3(t);if(i.includes("*")){ o=r.entries(); }else { for(var s=0;s<i.length;s++){ o[i[s]]=r.get(i[s]); } }var a=i.join("_");if(eq(objs[a],o)){ return r; }objs[a]=traverse_1$2(o).clone(),e(o,r);}),this},e}(t)}; var encase=function(t){return function(e,r,n,o,i){var s,a=t.onValid,u=t.onInvalid,c=t.ref,p=t.rethrow;try{return s=c(e,r,n,o,i),0===a?s:a(s)}catch(t){if(0!==u){ return u(t); }if(!0===p){ throw t; }return i}}}; var Shorthands_1=function(t,e){return function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.encase=function(t,e){var r=this;void 0===e&&(e=!1);var n={onInvalid:0,onValid:0,rethrow:e,ref:this[t].bind(this)};return this.then=function(t){return n.onValid=t,r},this.catch=function(t){return n.onInvalid=t,r},this[t]=encase(n),this},e.prototype.bindMethods=function(t){var e=this;return t.forEach(function(t){return e[t]=e[t].bind(e)}),this},e.prototype.chainWrap=function(t,e){var r=this;void 0===e&&(e=null);var n=e||this[t];return this[t]=function(t,e,o){return n.call(r,t,e,o),r},this},e.prototype.setIfEmpty=function(t,e){return!1===this.has("name")&&this.set(t,e),this},e.prototype.return=function(t){return t},e.prototype.wrap=function(t){return"function"==typeof t&&t.call(this,this),this},e}(t)}; var escapeStringRegex$2=function(t){return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&")}; var toTest$2=function(t,e,r){var n=typeof t;return"string"===n?!!new RegExp(escapeStringRegex$2(t)).test(e):"function"!==n||t.test?!!t.test(e,r):!!t(e)}; var TraverseChain$2=function(t){function e(e){t.call(this,e),this.set("keys",[]).set("vals",[]),this.call=this.traverse.bind(this);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.obj=function(t,e){return void 0===t&&(t=null),void 0===e&&(e=!1),t?this.set("obj",t):this},e.prototype.keys=function(t){return this.set("keys",t)},e.prototype.vals=function(t){return this.set("vals",t)},e.prototype.onMatch=function(t){return void 0===t&&(t=null),null===t?this.set("onMatch",function(t,e){e.remove();}):this.set("onMatch",t)},e.prototype.onNonMatch=function(t){return void 0===t&&(t=null),this.set("onNonMatch",t)},e.prototype.traverse=function(t){!1===this.has("onMatch")&&this.onMatch();var e=this.entries(),r=e.obj,n=e.keys,o=e.vals,i=e.onMatch,s=e.onNonMatch,a=r,u=function(t,e){for(var r=0;r<n.length;r++){ if(toTest$2(n[r],t,e)){ return!0; } }for(var i=0;i<o.length;i++){ if(toTest$2(o[i],e,t)){ return!0; } }return!1};return traverse_1$2(r).forEach(function(t){u(this.key,t)?i(t,this):s&&s(t,this);}),this.set("traversed",a),!0===t?a:this},e.prototype.traversed=function(){return this.get("traversed")},e}(ChainedMap_1$2); var obj=function(t){return pureObj$2(t)||"function"==typeof t}; var Transform_1=function(t,e){return function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.traverse=function(t){return void 0===t&&(t=!1),new TraverseChain$2(this).obj(!1===t?this.entries(!0):!0===t?this:t)},e.prototype.transform=function(t,e){return void 0===this.transformers&&(this.transformers={}),this.transformers[t]?this.transformers[t].push(e):this.transformers[t]=[e],this},e.prototype.compute=function(t,e){var r=this;return this.transform(t,function(t){return e(t,r),t})},e.prototype.set=function(e,r){var n=this,o=r,i=e;if(void 0!==this.transformers&&void 0!==this.transformers[i]){ for(var s=0;s<this.transformers[i].length;s++){ o=n.transformers[i][s].call(n,o,n); } }return t.prototype.set.call(this,i,o),void 0!==this.observers&&this.observers.values().forEach(function(t){return t({key:i,value:o})}),this},e.prototype.remap=function(t,e){var r=this,n=t;return obj(t)||(n={},n[t]=e),Object.keys(n).forEach(function(t){return r.transform(t,function(e){return r.set(n[t],e),e})}),this},e}(t)}; var Types=function(t,e){return function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.validators=function(t){return this.set("validators",!0===this.has("validators")?dopemerge_1$2(this.get("validators"),t):t)},e.prototype.typed=function(t){var e=this;void 0===t&&(t=null);var r=new FactoryChain_1(this),n=r.prop("type").prop("name").prop("onInvalid").prop("onValid").chainUpDown(this.typed).chainUpDowns(["typed"]).onDone(function(t){e.extendTyped(t.name,t.type,t.onInvalid,t.onValid);});return string$2(t)?(n.name(t),n):pureObj$2(t)?n.merge(t).end():n},e.prototype.extendTyped=function(t,e,r,n){var o=this;return void 0===r&&(r=null),void 0===n&&(n=null),this[t]=function(i){var s=function(){var r="[typof: "+typeof t+", name: "+t+"] was not of type "+e;return new TypeError(r)};null===r&&(r=function(t){throw s()});var a="string"==typeof e?o.get("validators")[e]:e;if("function"!=typeof a){ throw new TypeError(a+" for "+e+" was not a function"); }var u=!0;return u=a(i),null===u||!0===u?(o.set(t,i),null!==n&&n(i,o,s())):r(i,o),o},this},e}(t)}; var dotSegments=function(t){for(var e=t.split("."),r=[],n=0;n<e.length;n++){for(var o=e[n];"\\"===o[o.length-1]&&void 0!==e[n+1];){ o=o.slice(0,-1)+".",o+=e[++n]; }r.push(o);}return r}; var dotProp={get:function(t,e,r){if(!obj(t)||"string"!=typeof e){ return void 0===r?t:r; }for(var n=dotSegments(e),o=0;o<n.length;o++){if(!Object.prototype.propertyIsEnumerable.call(t,n[o])){ return r; }if(void 0===(t=t[n[o]])||null===t){if(o!==n.length-1){ return r; }break}}return t},set:function(t,e,r){if(!obj(t)||"string"!=typeof e){ return t; }for(var n=dotSegments(e),o=0;o<n.length;o++){var i=n[o];obj(t[i])||(t[i]={}),o===n.length-1&&(t[i]=r),t=t[i];}},delete:function(t,e){if(!obj(t)||"string"!=typeof e){ return t; }for(var r=dotSegments(e),n=0;n<r.length;n++){var o=r[n];if(n===r.length-1){ return void delete t[o]; }if(t=t[o],!obj(t)){ return }}},has:function(t,e){if(!obj(t)||"string"!=typeof e){ return!1; }for(var r=dotSegments(e),n=0;n<r.length;n++){if(!obj(t)){ return!1; }if(!(r[n]in t)){ return!1; }t=t[r[n]];}return!0}}; var dot=function(t){return"string"==typeof t&&t.includes(".")}; var shouldDot=function(t,e){return!1!==e._dot&&dot(t)}; var DotProp_1=function(t,e){return function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.dot=function(t){return void 0===t&&(t=!0),this._dot=t,this},e.prototype.set=function(e,r){if(shouldDot(e,this)){var n=e.split(".").shift();t.prototype.has.call(this,n)||t.prototype.set.call(this,n,{});var o=t.prototype.entries.call(this);return dotProp.set(o,e,r),t.prototype.set.call(this,n,o[n])}return t.prototype.set.call(this,e,r)},e.prototype.get=function(e){return shouldDot(e,this)?dotProp.get(t.prototype.entries.call(this),e):t.prototype.get.call(this,e)},e.prototype.has=function(e){return shouldDot(e,this)?dotProp.has(t.prototype.entries.call(this),e):t.prototype.has.call(this,e)},e.prototype.delete=function(e){return shouldDot(e,this)?dotProp.delete(t.prototype.entries.call(this),e):t.prototype.delete.call(this,e)},e.prototype.dotter=function(t){var e=this;return void 0===t&&(t=null),null!==t?this._dotter(t):{name:function(t){return e._dotter(t)}}},e.prototype._dotter=function(t){var e,r={},n=dot(t),o=!!n&&dotSegments(t),i=!!o&&o.shift();return r.dotted=function(s){return!1===n?r:(e=s(i,o,t),r)},r.otherwise=function(o){return!0===n?r:(e=o(t),r)},r.dotted.otherwise=r.otherwise,r.value=function(){return e},r},e}(t)}; var Extend=function(t,e){return void 0===t&&(t=ChainedMap_1$2),function(t){function e(e){t.call(this,e),e&&e.has&&e.has("debug")?this._debug=e.get("debug"):this.debug(!1);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.get=function(e){return"debug"===e?this._debug:t.prototype.get.call(this,e)},e.prototype.debug=function(t){return void 0===t&&(t=!0),this._debug=t,this},e.prototype.decorateParent=function(t){var e=this;return this.parent&&!this.parent.decorated&&(this.parent.decorated=this.parent.decorated||[]),t.forEach(function(t){var r=getDecoration(t),n=r.method,o=r.cb,i=r.returnee,s=r.key;(i||e.parent)&&(e.parent.decorated.push(n),e.parent[n]=function(t,r,a){var u;return(o=o||e[n])?u=o.call(e,t,r,a):e.set(s,t),i||u||e.parent||e});}),this},e.prototype.extendAlias=function(t,e,r){var n=this;return void 0===r&&(r=null),toArr$3(t).forEach(function(t){return n[t]=n[e].bind(r||n)}),this},e.prototype.extendWith=function(t,e){var r=this;void 0===e&&(e=void 0);var n=Array.isArray(t);return(n?t:Object.keys(t)).forEach(function(o){r.shorthands.push(o);var i=!1===n?t[o]:e;r[o]=function(t){return void 0===t&&(t=i),r.set(o,t)};}),this},e.prototype.extendIncrement=function(t){var e=this;return t.forEach(function(t){e.shorthands.push(t),e[t]=function(){var r=(e.get(t)||0)+1;return e.set(t,r),e};}),this},e}(t)};compose.Extend=Extend,compose.Define=Define,compose.Observe=Observe_1,compose.Shorthands=Shorthands_1,compose.Transform=Transform_1,compose.Types=Types,compose.DotProp=Types;var index$2$1=compose; var Composed=index$2$1({extend:!0}); var FactoryChain=function(t){function e(e){t.call(this,e),this.data={},this.factory(),t.prototype.extend.call(this,["optional","required","chainUpDown"]).set("chainLength",0),this._calls=new ChainedSet_1(this);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.chainUpDowns=function(t){var e=this;return t.forEach(function(t){e[t]=function(r,n,o,i,s){return e.end(),e.parent[t](r,n,o,i,s)};}),this},e.prototype.props=function(t){var e=this;return t.forEach(function(t){return e.prop(t)}),this},e.prototype.onDone=function(t){return this.set("onDone",t)},e.prototype.prop=function(t,e){var r=this;return void 0===e&&(e=null),this.tap("chainLength",function(t){return t+1}),void 0!==this[t]&&!0===this.has("chainUpDown")?(this.end(),this.get("chainUpDown")()[t](e)):(this[t]=function(n){return null===e?r.data[t]=n:e(n),r._calls.add(t),r._calls.length===r.get("chainLength")?r.end():r},this)},e.prototype.getData=function(t){return void 0===t&&(t=null),null===t?this.data:this.data[t]},e.prototype.factory=function(t){var e=this;return void 0===t&&(t={}),this.end=function(r){if(void 0!==t.end){var n=t.end(e.data,e.parent,e,r);if(n&&n!==e){ return n }}else if(e.has("onDone")){var o=e.get("onDone")(e.data,e.parent,e,r);if(o&&o!==e){ return o }}return e.parent},this},e}(Composed); var FactoryChain_1=FactoryChain; var exp=index$2$1();exp.init=function(t){return new exp(t)},exp.Chain=exp,exp.compose=index$2$1,exp.traverse=traverse_1$2,exp.toArr=toArr$3,exp.camelCase=toArr$3,exp.dot=dotProp,exp.Chainable=Chainable_1$2,exp.ChainedSet=ChainedSet_1,exp.ChainedMap=ChainedMap_1$2,exp.FactoryChain=FactoryChain_1,exp.MergeChain=MergeChain_1$2,exp.dopemerge=dopemerge_1$2;var index$41=exp;


var index_es = Object.freeze({
	default: index$41
});

var ChainedMapExtendable = ( index_es && index$41 ) || index_es;

var Indenter = (function (Chain) {
  function Indent () {
    Chain.apply(this, arguments);
  }

  if ( Chain ) Indent.__proto__ = Chain;
  Indent.prototype = Object.create( Chain && Chain.prototype );
  Indent.prototype.constructor = Indent;

  Indent.prototype.indent = function indent (level) {
    if (level === 0) { return this.set('indent', 0) }
    return this.tap('indent', function (indent) {
      if (!number(indent)) { indent = 0; }
      if (!number(level)) { level = 0; }
      return indent + level
    })
  };
  Indent.prototype.reset = function reset () {
    return this.indent(0)
  };
  // string repeat indent
  Indent.prototype.toString = function toString () {
    return ' '.repeat(this.get('indent'))
  };
  Indent.prototype.toNumber = function toNumber () {
    return this.get('indent')
  };

  return Indent;
}(ChainedMapExtendable));

/**
 * @tutorial https://github.com/lukeed/obj-str
 * @param  {Object} obj
 * @return {string}
 */
function objToStr(obj) {
  var cls = '';
  for (var k in obj) {
    if (obj[k]) {
      cls && (cls += ' ');
      cls += k;
    }
  }
  return cls
}

// https://github.com/npm/npmlog
// http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
// http://www.100percentjs.com/best-way-debug-node-js/
// https://www.loggly.com/ultimate-guide/node-logging-basics/
// https://www.npmjs.com/package/cli-color
var clrs = [
  'black',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'red',
  'dim' ];
var bgColors = [
  'bgBlack',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  'bgWhite' ];
var em = ['italic', 'bold', 'underline'];
var xtermByName = {
  colors: {
    orange: 202,
  },
  bg: {
    orange: 236,
  },
};
// const psr3 = [
//   'emergency',
//   'alert',
//   'critical',
//   'error',
//   'warning',
//   'notice',
//   'warning',
//   'debug',
// ]

var combinations = clrs.concat(bgColors).concat(em);

// https://www.youtube.com/watch?v=SwSle66O5sU
var OFF$2 = `${~315 >>> 3}@@`;

var isFunctionWithNoKeys = function (obj) { return typeof obj === 'function' && Object.keys(obj).length === 0; };




var index$39 = {
  Indenter: Indenter,
  Indent: Indenter,
  matcher: matcher_1,
  isFunctionWithNoKeys: isFunctionWithNoKeys,
  combinations: combinations,
  OFF: OFF$2,
  bgColors: bgColors,
  // psr3,
  xtermByName: xtermByName,
  objToStr: objToStr,
};

var OFF$1 = index$39.OFF;
var Indent = index$39.Indent;
// const isNumber = require('chain-able/deps/is/number')
// const replaceLength = /\[length\]\: (\d+|(.*?)(?=,|\'|\]|\s+)?)\s+?/i

var pretty = {
  prettyformat: function prettyformat(obj) {
    var this$1 = this;

    return this.formatter(function (arg) { return this$1.requirePkg('pretty-format')(arg); }).data(
      obj
    )
  },
  fmtobj: function fmtobj(obj) {
    var this$1 = this;

    return this.formatter(function (arg) { return this$1.requirePkg('fmt-obj')(arg); }).data(obj)
  },
  indenter: function indenter() {
    return new Indent().indent(0)
  },
  indentStr: function indentStr(str, type) {
    if ( type === void 0 ) type = 'data';

    if (!this.has('indent')) { this.indent(0); }
    var indent = this.get('indent');
    console.log({indent: indent});
    return indent.toString() + str
  },
  // @TODO: add obj | text | all to type
  indent: function indent(level, type) {
    if ( type === void 0 ) type = null;

    // if (!isNumber(level)) {}
    if (!this.has('indent')) { this.set('indent', new Indent()); }
    this.get('indent').indent(level);
    return this
  },
  indentObj: function indentObj(level) {
    if (!this.has('indentObj')) { this.set('indentObj', new Indent()); }
    this.get('indentObj').indent(level);
    return this
  },
  indentText: function indentText(level) {
    if (!this.has('indentText')) { this.set('indentText', new Indent()); }
    this.get('indentText').indent(level);
    return this
  },
  prettyobj: function prettyobj(obj) {
    var this$1 = this;

    return (
      this.formatter(function (arg) {
        var inspector = this$1.inspector();
        var strip = this$1.requirePkg('strip-ansi') || (function (x) { return x; });
        return (
          this$1.inspectorGadget()
            .inspect(arg, 5, {showHidden: false})
            .split('\n')
            .map(function (data) { return this$1.indentStr(data, 'data'); })
            .filter(function (data) { return data; })
            // .map(data => data.replace(replaceLength, ''))
            .map(function (data) { return (data.endsWith(',') ? data.slice(0, -1) : data); })
            .map(function (data) { return data.replace(/[{}]/gim, ''); })
            // .map(data => {
            //   console.log({data})
            //   return data
            // })
            .join('\n')
        )
      })
        // .set('textFormatter', text => {
        //   if (!text.endsWith('\n')) text += '\n'
        //   return text
        // })
        .data(obj)
    )
  },
  prettysize: function prettysize(bytes) {
    var pretty = this.module('prettysize')(bytes);
    return this.text(pretty)
  },
  module: function module(name) {
    return this.requirePkg(name)
  },

  /**
   * @since 0.4.0
   * @param  {Object} [obj=null] data
   * @param  {Object | null} [opts=null] options to pass into treeify
   * @return {FlipLog} @chainable
   */
  tree: function tree(obj, opts) {
    var this$1 = this;
    if ( obj === void 0 ) obj = null;
    if ( opts === void 0 ) opts = null;

    if (obj) { this.data(obj); }

    return this.formatter(function (data) {
      var arg = typeof opts === 'function' ?
        {lineCallback: opts, asLines: true} :
        opts;
      var options = Object.assign(
        {
          asTree: true,
          asLines: false,
          showValues: true,
          hideFunctions: false,
          lineCallback: false,
          color: true,
        },
        arg
      );

      var asLines = options.asLines;
      var showValues = options.showValues;
      var hideFunctions = options.hideFunctions;
      var lineCallback = options.lineCallback;
      var color = options.color;
      var treeify = this$1.requirePkg('treeify');
      var result = asLines ?
        treeify.asLines(data, showValues, hideFunctions, lineCallback) :
        treeify.asTree(data, showValues, hideFunctions);

      // if (!this.get('text')) this.text('\n')
      // else this.text(this.get('text') + '\n\n')

      if (color && result && this$1.has('color')) {
        result = result
          .replace(/[├─│─┐└─]/gim, function (string) {
            var colored = this$1.getLogWrapFn()(string); // .replace(/undefined/, string)
            return colored
            // this.getColored(string)
          })
          .trim();
      }
      return result ? '\n' + result : OFF$1
    })
  },
};

var register = {
  registerConsole: function registerConsole() {
    var this$1 = this;

    console.verbose = function (text) {
      var data = [], len = arguments.length - 1;
      while ( len-- > 0 ) data[ len ] = arguments[ len + 1 ];

      return (ref = this$1.verbose()).data.apply(ref, data).echo()
      var ref;
    };
    console.info = function (text) {
        var data = [], len = arguments.length - 1;
        while ( len-- > 0 ) data[ len ] = arguments[ len + 1 ];

        return (ref = this$1.emoji('info').verbose()).data.apply(ref, data).echo()
        var ref;
    };
    console.error = function (text, e) { return this$1.preset('error').error(e).echo(); };
    console.track = function () { return this$1.trackConsole().echo(); };
    console.trace = function () { return this$1.trace().echo(); };
    console.note = function (text) {
        var data = [], len = arguments.length - 1;
        while ( len-- > 0 ) data[ len ] = arguments[ len + 1 ];

        return (ref = this$1.preset('note').text(text)).data.apply(ref, data).echo()
        var ref;
    };
    console.warning = function (text) {
        var data = [], len = arguments.length - 1;
        while ( len-- > 0 ) data[ len ] = arguments[ len + 1 ];

        return (ref = this$1.preset('warning').text(text)).data.apply(ref, data).echo()
        var ref;
    };
    console.spinner = function (text) {
      var options = [], len = arguments.length - 1;
      while ( len-- > 0 ) options[ len ] = arguments[ len + 1 ];

      return (ref = this$1).spinner.apply(ref, [ text ].concat( options ))
      var ref;
    };

    console.time = function (name) { return this$1.timer.start(name).echo(); };
    console.timeLap = function (name) { return this$1.timer.lap(name); };
    console.timeLapEcho = function (name) { return this$1.timer.lap(name).echo(); };
    console.timeEnd = function (name) { return this$1.fliptime().end(name).log(name); };

    console.bold = function (text, data) {
      if ( data === void 0 ) data = OFF;

      return this$1.bold(text).data(data).echo();
    };
    console.red = function (text, data) {
      if ( data === void 0 ) data = OFF;

      return this$1.red(text).data(data).echo();
    };
    console.yellow = function (text, data) {
      if ( data === void 0 ) data = OFF;

      return this$1.yellow(text).data(data).echo();
    };
    console.cyan = function (text, data) {
      if ( data === void 0 ) data = OFF;

      return this$1.cyan(text).data(data).echo();
    };
    console.underline = function (text, data) {
        if ( data === void 0 ) data = OFF;

        return this$1.underline(text).data(data).echo();
    };
    console.magenta = function (text, data) {
      if ( data === void 0 ) data = OFF;

      return this$1.magenta(text).data(data).echo();
    };

    console.box = function () {
      var options = [], len = arguments.length;
      while ( len-- ) options[ len ] = arguments[ len ];

      return (ref = this$1).box.apply(ref, options).echo()
      var ref;
    };
    console.beep = function () {
      var options = [], len = arguments.length;
      while ( len-- ) options[ len ] = arguments[ len ];

      return (ref = this$1).beep.apply(ref, options).echo()
      var ref;
    };
    console.timer = function () {
      var options = [], len = arguments.length;
      while ( len-- ) options[ len ] = arguments[ len ];

      return this$1.timer();
    };
    console.table = function () {
      var options = [], len = arguments.length;
      while ( len-- ) options[ len ] = arguments[ len ];

      return (ref = this$1).table.apply(ref, options).echo()
      var ref;
    };
    console.diff = function () {
      var options = [], len = arguments.length;
      while ( len-- ) options[ len ] = arguments[ len ];

      return (ref = this$1).diff.apply(ref, options)
      var ref;
    };
    console.diffs = function () { return this$1.diffs().echo(); };
    console.stringify = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).stringify.apply(ref, data).echo()
      var ref;
    };
    console.stack = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).stack.apply(ref, data).echo()
      var ref;
    };
    console.json = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).json.apply(ref, data).echo()
      var ref;
    };
    console.filter = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).filter.apply(ref, data).echo()
      var ref;
    };
    console.tags = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).tags.apply(ref, data).echo()
      var ref;
    };
    console.quick = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).quick.apply(ref, data).echo()
      var ref;
    };
    console.exit = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).exit.apply(ref, data).echo()
      var ref;
    };
    console.reset = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).reset.apply(ref, data).echo()
      var ref;
    };
    console.sleep = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).sleep.apply(ref, data).echo()
      var ref;
    };
    console.slow = function () {
      var data = [], len = arguments.length;
      while ( len-- ) data[ len ] = arguments[ len ];

      return (ref = this$1).slow.apply(ref, data).echo()
      var ref;
    };

    return this
  },

  // https://gist.github.com/benjamingr/0237932cee84712951a2
  registerCatch: function registerCatch() {
    var this$1 = this;

    process.on('unhandledRejection', function (reason, p) {
      console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
      // this.red(p).echo()
      // this.error(reason).echo()
      process.exit(1);
      // this.catchAndThrow(reason, p)
    });
    process.on('unhandledException', function (exception) {
      console.log('fliplog catching unhandledException');
      this$1.error(exception).echo();
      process.exit(1);
      // this.catchAndThrow(exception)
    });
  },
};

// https://www.youtube.com/watch?v=SwSle66O5sU
var OFF$4 = `${~315 >>> 3}@@`;

var returnVals = {
  // ----------------------------- getting data ------------------

  /**
   * @alias logText
   * @since 0.4.0
   * @return {string} text log
   */
  getText: function getText() {
    var text = this.logText();
    return text === OFF$4 ? '' : text
  },
  /**
   * @alias logData
   * @since 0.4.0
   * @return {any}
   */
  getData: function getData() {
    var data = this.logData();
    return data === OFF$4 ? undefined : data
  },

  /**
   * @since 0.2.0
   * @tutorial https://github.com/fliphub/fliplog#return
   * @return {ReturnVals}
   */
  returnVals: function returnVals() {
    var text = this.logText();
    var datas = this.logData();

    if (datas !== OFF$4 && text !== OFF$4) { return {text: text, datas: datas} }
    else if (datas !== OFF$4) { return {datas: datas} }
    else if (text !== OFF$4) { return {text: text} }
    else { return {text: text, datas: datas} }
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog#return
   * @since 0.2.0 (added param 0.3.0)
   * @param {boolean} [textAndDataOnly=false]
   * @return {ReturnVal}
   */
  return: function return$1(textAndDataOnly) {
    if ( textAndDataOnly === void 0 ) textAndDataOnly = false;

    if (textAndDataOnly === true) {
      return this.returnVals()
    }

    if (this.has('tags') === true) {
      this._filter();
    }
    var returnVals = this.returnVals();
    var entries = this.entries();
    this.reset();
    return Object.assign(entries, returnVals)
  },
};

/**
 * @tutorial https://github.com/fliphub/fliplog#-slow
 */
var sleep = {
  // ----------------------------- sleeping ------------------
  // deps: {
  //   'sleepfor': '*',
  // },

  reset: function reset() {
    // @NOTE: this should not be deleted o.o
    // this.delete('sleepBetween')
  },

  /**
   * @param {Number} [args=false]
   * @return {Function} sleepfor
   */
  sleepfor: function sleepfor(args) {
    if ( args === void 0 ) args = false;

    var sleepfor = this.requirePkg('sleepfor');

    if (args !== false) { sleepfor(args); }

    return sleepfor
  },

  /**
   * @param  {Number} [time=1000]
   * @return {FlipLog}
   */
  sleep: function sleep(time) {
    if ( time === void 0 ) time = 1000;

    this.sleepfor(time);
    return this
  },

  /**
   * @param  {Number} [time=100]
   * @return {FlipLog}
   */
  slow: function slow(time) {
    if ( time === void 0 ) time = 100;

    return this.set('sleepBetween', time)
  },

  /**
   * @TODO: middleware...
   * @see FlipLog.slow
   * @return {FlipLog}
   */
  sleepIfNeeded: function sleepIfNeeded() {
    if (this.has('sleepBetween') === true) {
      this.sleepfor(this.get('sleepBetween'));
    }

    return this
  },
};

var stringify = {
  // deps: {
  //   'javascript-stringify': '1.6.0',
  // },

  jsStringify: function jsStringify(data) {
    if ( data === void 0 ) data = null;

    // const stringify = this.requirePkg('javascript-stringify')
    var stringify = index$35;
    if (data === null) { return stringify }

    var str = stringify(data);
    return str
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog#-stringifying
   * @param  {any} data
   * @param  {any} [replacer=null]
   * @param  {String} [spacer='  ']
   * @param  {any} [options=null] javascript-stringify options
   * @return {FlipLog}
   */
  stringify: function stringify(data, replacer, spacer, options) {
    if ( replacer === void 0 ) replacer = null;
    if ( spacer === void 0 ) spacer = '  ';
    if ( options === void 0 ) options = null;

    var stringify = this.jsStringify();
    var prettified = stringify(data, replacer, spacer, options);
    return this.data(prettified)
  },
};

var OFF$5 = index$39.OFF;
// https://coderwall.com/p/blti_w/dumb-javascript-string-interpolation
// https://nodejs.org/api/util.html#util_util_format_format
// https://github.com/knowledgecode/fast-format
// http://stringjs.com/
// https://github.com/alexei/sprintf.js

var isOFF = function (x) { return x === OFF$5 || (/undefined/).test(x); };

var text = {
  reset: function reset() {
    this.delete('colorer');
  },
  /**
   * @see this.textFormatter
   * @desc strips asci chars from text, or as a text-formatter
   * @param {string} [text=null]
   * @return {FlipLog} @chainable
   */
  strip: function strip(text) {
    var this$1 = this;
    if ( text === void 0 ) text = null;

    if (text !== null) { this.text(text); }

    return this
      .set('textFormatter', function (txt) { return isOFF(txt) ? OFF$5 : this$1.requirePkg('strip-ansi')(txt); })
      .set('colorer', function (color) { return function (txt) { return isOFF(txt) ? OFF$5 : this$1.requirePkg('strip-ansi')(txt); }; })
  },

  /**
   * @desc @modifies this.templates
   * @param {string} id=null (when only 1 arg, this is the template and id is random)
   * @param {string} [template=null]
   * @return {FlipLog} @chainable
   */
  addTemplate: function addTemplate(id, template) {
    if ( id === void 0 ) id = null;
    if ( template === void 0 ) template = null;

    var args = {id: id, template: template};

    // single arg
    if (typeof id === 'string' && template === null) {
      args.template = id;
      args.id = Math.random(0, 1000);
    }
    if (!this.has('templates')) { this.set('templates', {}); }
    return this.set('templates.' + args.id, template).set(
      'templates.current',
      template
    )
  },

  /**
   * @see this.sprintf
   * @param {string} id dot.prop key of id on this.templates
   * @return {string} template for rendering
   */
  getTemplate: function getTemplate(id) {
    return this.get('template.' + id)
  },

  /**
   * @see this.template
   * @see this.sprintf
   * @param {string} id dot.prop key of id on this.templates
   * @return {string} template for rendering
   */
  useTemplate: function useTemplate(id) {
    return this.set('template.current', this.get('template.' + id))
  },

  /**
   * @desc pass in array to use the current template,
   *       or (id, array<string>) to render a specific template
   * @param {string} id dot.prop key of id on this.templates
   * @param {Array<string>} [args]
   * @return {FlipLog} @chainable
   */
  sprintf: function sprintf(id) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var templateArgs = args;
    var templateId = 'current';

    // single or multi arg
    if (!Array.isArray(id)) { templateId = id; }
    else { templateArgs = id; }

    //  flatten
    if (Array.isArray(templateArgs[0])) {
      templateArgs = [].concat.apply([], templateArgs);
    }

    var template = this.get('template.' + templateId);

    if (Array.isArray(id)) {
      if (template) {
        var ref = this.requirePkg('sprintf');
        var vsprintf = ref.vsprintf;
        var rendered = vsprintf;
        return this.set('text', template)
      }
      else {
        var msg = 'when using sprintf, ';
        msg += 'you must `useTemplate(id)`';
        msg += 'or at least `addTemplate(id, templateString)`';
        this.reset().color('red.bold.underline').text(msg).echo();
        return this
      }
    }
    if (this.has('template.' + id)) { return this.set('text') }
    return this
  },
};

var time = {
  reset: function reset() {
    // console.log(this.entries())
    // console.log(this.get('time'))
    // persist the time logging
    if (this.get('time')) {
      this.time(true);
    }
    this.time(false);
  },
};

var fliptime;

var timer = {
  // deps: {
  //   'fliptime': '*',
  // },

  // ----------------------------- timer ------------------
  fliptime: function fliptime$1() {
    fliptime = fliptime || this.requirePkg('fliptime');
    return fliptime
  },
  startTimer: function startTimer(name) {
    this.fliptime().start(name);
    return this
  },
  stopTimer: function stopTimer(name) {
    this.fliptime().stop(name);
    return this
  },
  lapTimer: function lapTimer(name) {
    this.fliptime().lap(name);
    return this
  },
  echoTimer: function echoTimer(name) {
    this.fliptime().log(name);
    return this
  },
  stopAndEchoTimer: function stopAndEchoTimer(name) {
    this.fliptime().stop(name).log(name);
    return this
  },
};

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
function resolve() {
  var arguments$1 = arguments;

  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments$1[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter$5(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
}

// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter$5(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}

// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter$5(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}


// path.relative(from, to)
// posix version
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') { break; }
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') { break; }
    }

    if (start > end) { return []; }
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

var sep = '/';
var delimiter = ':';

function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

function basename$1(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


function extname(path) {
  return splitPath(path)[3];
}
var path = {
  extname: extname,
  basename: basename$1,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join,
  isAbsolute: isAbsolute,
  normalize: normalize,
  resolve: resolve
};
function filter$5 (xs, f) {
    if (xs.filter) { return xs.filter(f); }
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) { res.push(xs[i]); }
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) { start = str.length + start; }
        return str.substr(start, len);
    };


var path$1 = Object.freeze({
	resolve: resolve,
	normalize: normalize,
	isAbsolute: isAbsolute,
	join: join,
	relative: relative,
	sep: sep,
	delimiter: delimiter,
	dirname: dirname,
	basename: basename$1,
	extname: extname,
	default: path
});

var require$$0$7 = ( path$1 && path ) || path$1;

var basename = require$$0$7.basename;
var inspector$2 = index$31.inspector;

// Stack trace format :
// https://github.com/v8/v8/wiki/Stack%20Trace%20API
var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
var stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

// ----------------------------- traces & stacks ------------------
// https://www.npmjs.com/package/parsetrace
// https://www.npmjs.com/package/debug-trace
// https://blog.risingstack.com/node-js-logging-tutorial/
// https://github.com/baryon/tracer
// https://www.npmjs.com/package/callsite
// http://www.devthought.com/2011/12/22/a-string-is-not-an-error/#beyond
// https://github.com/baryon/tracer#log-file-transport

// https://remysharp.com/2014/05/23/where-is-that-console-log
var track = {
  track: function track() {
    return this.set('track', true)
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#-find-logs
   * @return {FlipLog} @chainable
   */
  trackConsole: function trackConsole() {
    var ops = ['log', 'warn'];
    ops.forEach(function (method) {
      var old = console[method];
      console[method] = function() {
        var stack = new Error().stack.split(/\n/);
        // Chrome includes a single "Error" line, FF doesn't.
        if (stack[0].indexOf('Error') === 0) {
          stack = stack.slice(1);
        }
        var args = [].slice.apply(arguments).concat([stack[1].trim()]);
        return old.apply(console, args)
      };
    });
    return this
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#-find-logs
   * @see FlipLog.data, FlipLog.verbose
   * @return {FlipLog} @chainable
   */
  trace: function trace() {
    var e = new Error('log.trace');
    var stacklist = e.stack.split('\n').slice(2);
    var s = stacklist[0];
    var data = {};
    var sp = stackReg.exec(s) || stackReg2.exec(s);
    if (sp && sp.length === 5) {
      data.method = sp[1];
      data.path = sp[2];
      data.line = sp[3];
      data.pos = sp[4];
      data.file = basename(data.path);
      data.stackTrace = stacklist.map(function (stack) { return stack.replace(/\s+/, ''); }); // .join('\n')
      e.stack = data.stackTrace;
    }

    // we use inspector here so we do not reformat the error in verbose
    return this.set('data', inspector$2(data))
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#-find-logs
   * @see FlipLog.data, FlipLog.verbose
   * @return {FlipLog} @chainable
   */
  stack: function stack() {
    if (this.has('track') === false || this.get('track') === false) {
      return this
    }

    this.trace();

    // get call stack, and analyze it
    // get all file,method and line number
    var stacklist = new Error().stack.split('\n').slice(4);
    var s = stacklist[0];
    var data = {};
    var sp = stackReg.exec(s) || stackReg2.exec(s);
    if (sp && sp.length === 5) {
      data.method = sp[1];
      data.path = sp[2];
      data.line = sp[3];
      data.pos = sp[4];
      data.file = basename(data.path);
      // data.stack = stacklist.join('\n')
    }

    console.log(inspector$2(data));
    return this
  },
};

var verbose = {};

var getDefaults$2 = function () {
  return {
    keysColor: 'blue',
    dashColor: 'yellow',
    stringColor: 'italic',
    numberColor: 'green',
  }
};
var json$2 = {
  // deps: {
  //   'prettyjson': '1.2.1',
  // },

  prettyjson: function prettyjson(data, opts) {
    if ( data === void 0 ) data = null;
    if ( opts === void 0 ) opts = {};

    var options = Object.assign(getDefaults$2(), opts);
    var prettyjson = this.requirePkg('prettyjson'); // eslint-disable-line
    if (data !== null) {
      return prettyjson.render(data, options)
    }
    return prettyjson
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#json
   * @param  {Object | any} data
   * @param  {Object} [opts={}]
   * @return {FlipLog} @chainable
   */
  json: function json(data, opts) {
    var this$1 = this;
    if ( opts === void 0 ) opts = {};

    if (typeof data !== 'object') {
      return this.data(data).verbose(5)
    }

    opts = Object.assign(getDefaults$2(), opts);

    // return this.data(this.prettyjson().render(data, opts))
    return this.formatter(function () { return this$1.prettyjson().render(data, opts); }).data(data)
  },
};

/**
 * @TODO
 *  - [ ] table (compat with node one)
 *  - [ ] group
 *  - [ ] warn, dir, error, log, debug
 * @type {Object}
 */
var web$3 = {
  fontWeight: function fontWeight(weight) {
    if ( weight === void 0 ) weight = 'bold';

    return this.set('fontweight', weight)
  },
  fontSize: function fontSize(size) {
    if ( size === void 0 ) size = 'x-large';

    return this.set('fontsize', size)
  },
  color: function color(color$1, bgColor) {
    if ( bgColor === void 0 ) bgColor = null;

    return this.set('color', color$1).set('bgColor', bgColor)
  },
  dir: function dir() {
    return this.set('log', console.dir)
  },
  table: function table() {
    return this.set('log', console.table)
  },

  /**
   * @TODO improve the returning function
   * @example console.log('%cLogChain', 'color: blue; font-size: x-large')
   * @see http://stackoverflow.com/questions/7505623/colors-in-javascript-console
   * @see https://developers.google.com/web/tools/chrome-devtools/console/console-write#styling_console_output_with_css
   * @return {Function} a function prototype bound to console to output in the correct location, needs work
   */
  echo: function echo() {
    if (!this.parent || (this.parent && this.parent.get('debug') === true)) {
      var ref = this.entries();
      var data = ref.data;
      var text = ref.text;
      var color = ref.color;
      var fontsize = ref.fontsize;
      var fontweight = ref.fontweight;
      var log = this.get('log') || console.log;

      var fmt = '';
      if (color) { fmt += 'color: ' + color + ';'; }
      if (fontweight) { fmt += 'font-weight: ' + fontweight + ';'; }
      if (fontsize) { fmt += 'font-size: ' + fontsize + ';'; }

      var args = [text, fmt, data];

      return Function.prototype.apply.bind(log, console, args)
    }

    // or noop if disabled
    return function noop() {} // eslint-disable-line
  },

  data: function data(data$1) {
    return this.set('data', data$1)
  },

  text: function text(string) {
    return this.set('text', '%c' + string)
  },
};

var fmtr = formatter;








var index_web$2 = {
  capture: capture,
  chalk: chalk$2,
  diff: diff$1,
  filter: filter,
  formatter: formatter,
  inspect: inspect,
  json: json$2,
  presets: presets,
  pretty: pretty,
  register: register,
  returnVals: returnVals,
  sleep: sleep,
  stringify: stringify,
  fmtr: fmtr,
  templates: text,
  time: time,
  timer: timer,
  track: track,
  verbose: verbose,
  web: web$3,
};

var prettifyError = function prettifyError(msg) {
  var parser = prettyError(this.requirePkg('error-stack-parser'));
  var chalk = this.requirePkg('chalk');
  var strip = this.requirePkg('strip-ansi');

  var stack = msg.stack;
  var message = msg.message;

  var text = this.get('text');

  if (text && text.includes('🚨')) { text = ''; }
  if (!text) { text = ''; }
  if (text.includes('error:')) { text = ''; }
  if (text == '') {
    this.text(chalk.bgRed.black(' ' + message + ' ') + '\n');
  }

  var obj = Object.create(null);

  // eslint-disable-next-line
  for (var prop in msg) {
    obj[prop] = msg[prop];
  }

  // use ansi?
  try {
    var stacked = parser(msg);
    var requireMain = commonjsRequire.main.filename;
    var hitRequireMain = false;
    var hitNativeNode = false;
    var lastFile = false;
    var lastSource = false;
    stack =
      stacked
        .map(function (stackTrace) {
          var fileName = stackTrace.fileName;
          var functionName = stackTrace.functionName;
          var source = stackTrace.source;
          var lineNumber = stackTrace.lineNumber;
          var columnNumber = stackTrace.columnNumber;
          var c = {
            fn: chalk.yellow(functionName),
            col: columnNumber, // chalk.white(columnNumber),
            // line: chalk.bold(lineNumber),
            line: lineNumber,
            file: chalk.underline(fileName),
            src: source,
          };

          // ------- same file
          if (lastFile === fileName) {
            c.file = '';
          } else {
            lastFile = fileName;
          }

          // ----- same src
          if (lastSource + '' == source + '') {
            // c.src = ''
          } else {
            if (lastFile === fileName) {
              var str = source
                // .split(fileName)
                // .shift() // .split(' (,:')
                // // .shift()
                .trim();

              var lastParen = str.lastIndexOf(' (');
              if (lastParen > -1) {
                str = str.slice(0, -1);
              }
              c.src = chalk.dim(str);
            } else {
              c.src =
                '\n' +
                chalk.dim(source.replace(fileName, chalk.underline(fileName)));
            }

            // const strippedSrc = strip(c.src + '').replace(/ /, '')
            // const strippedFile = strip(c.file + '').replace(/ /, '')
            // if (strippedSrc == strippedFile) {
            //   c.src = ''
            // }
            lastSource = '\n' + source + '';
          }

          // ----- don't want it not ours
          var moduleErrors = [
            'at Module._compile (module.js',
            'at Module.load (module.js',
            'at Object.Module._extensions..js (module.js' ];
          var isModuleError = moduleErrors
            .map(function (moduleError) { return source.includes(moduleError); })
            // .concat(moduleErrors.map(moduleError =>
            //   functionName && functionName.includes(moduleError)
            // ))
            .includes(true);

          // console.log({isModuleError, source, hitNativeNode})
          if (isModuleError) {
            hitNativeNode = true;
          }
          if (!hitRequireMain && fileName == requireMain) {
            hitRequireMain = true;
            c.fn = chalk.bold(functionName);
            c.file = chalk.cyan(fileName);

            // puts on new line
            // const len = (this.get('text') || '').length || 1
            // c.col =
            //   c.col +
            //   ' ' +
            //   chalk.italic(
            //     '\n' + ' '.repeat(len) + ' require.main.filename ^ \n'
            //   )
            // c.col = c.col + ' ' + chalk.magenta('(entry)')
            c.src =
              chalk.magenta('(entry)') + ` line ${c.line} col ${c.col} ` + c.src;

            // c.src = c.src

            // // c.src = c.src
          } else if (hitRequireMain && hitNativeNode) {
            return false
          } else if (/undefined/.test(c.fn) && strip(c.src.trim()) == 'at') {
            // entry node file we don't want it
            return false
          } else if (/startup/.test(c.fn) && /(at startup)/.test(c.src)) {
            // entry node file we don't want it
            return false
          }
          if (source.includes('fliplog') || source.includes('LogChain')) {
            return false
          }
          // in ${c.file}
          return `${c.fn} ${c.src}`
        })
        .filter(function (line) { return line; })
        .join('\n') + '\n';

    delete obj.stack;

    if (!Object.keys(obj).length) { return stack }

    var objStr = '';
    try {
      objStr =
        '\n' +
          this.prettyjson(
            {extraErrorProperties: obj},
            {
              keysColor: 'red',
              dashColor: 'yellow',
              stringColor: 'italic',
              numberColor: 'green',
            }
          ) || '';
    } catch (e) {
      // ignore
    }

    stack += objStr || '';

    return stack
    // const logger = this.factory()
    // logger.from(this.entries())
    // obj.inspect = () => stack
    // const inspected = inspector(obj, this.get('verbose'))

    // return inspected
  } catch (errorOnError) {
    console.log({errorOnError: errorOnError, error: msg});
    return OFF
  }
};

var inspector$3 = index$31.inspector;
var OFF$6 = index$39.OFF;


var data = {
  /**
   * @protected
   * @TODO should be formatters
   * @see FlipLog.tosource, FlipLog.highlight
   * @param  {any} msg
   * @return {string}
   */
  getToSource: function getToSource(msg) {
    var highlighter = this.get('highlighter');

    // typeof msg === 'object' &&
    if (this.has('tosource') === true) {
      var tosource = this.requirePkg('tosource');
      if (highlighter) { return highlighter(tosource(msg)) }
      return tosource(msg)
    }

    if (highlighter) { return highlighter(msg) }

    return msg
  },

  // errorExtras(msg) {
  // console.log(this.requirePkg('error-stack-parser').parse())
  // const PrettyError = this.requirePkg('pretty-error')
  // if (!PrettyError) {
  //   return inspector(data, this.get('verbose'))
  // }
  //
  // const escapeReg = this.requirePkg('escape-string-regexp')
  // const pe = new PrettyError()
  // error = console.log(pe.render(msg))
  // const obj = Object.assign(new Error(msg.message), msg)
  // const obj = Object.create(Object.getPrototypeOf(msg))
  //   // custom props
  //   // const keys = Object.keys(msg)
  //   // if (keys.length) {
  //   //   const {datas} = this.factory()
  //   //     .data(
  //   //       keys.reduce((acc, key) => {
  //   //         acc[key] = msg[key]
  //   //         return acc
  //   //       }, {})
  //   //     )
  //   //     .returnVals()
  //   //
  //   //   try {
  //   //     const dataStr = datas + ''
  //   //     obj.data = dataStr
  //   //   }
  //   //   catch (e) {
  //   //     //
  //   //   }
  //   // }
  // const escaped = escapeReg(fileName)
  // const reg = new RegExp(
  //   '(\s*\()?' + escaped + '(\s*\:\d+\:\d+\))'
  // )
  // console.log(reg)
  // console.log(str)
  // console.log(str, source.match(reg))
  // .shift().trim()
  //
  //   // obj.stack = stack
  //
  //
  //   // const dataLogger = this.factory()
  //   // obj = dataLogger.data(obj).returnVals().datas
  //
  //   // console.log(Object.keys(msg))
  //   // console.log(stack)
  //   // delete obj.stack
  //   // try {
  //   //   const message = obj.message.split('\n')
  //   //   obj.message = message
  //   //   return obj
  //   // }
  //   // catch (e) {
  //   //   // do nothing, likely logging a trace
  //   // }
  // }

  /**
   * @TODO: special error cleaning prop to remove `node_modules` & `module`
   *
   * @protected
   * @see FlipLog.verbose, FlipLog.highlight
   * @param  {string | any} msg
   * @return {string | any}
   */
  getVerbose: function getVerbose(msg) {
    if (msg === OFF$6) { return msg }
    var data = msg;

    if (this.has('verbose') === true && typeof data !== 'string') {
      if (data && data.stack && data.message && data instanceof Error) {
        if (isNode) {
          data = prettifyError.call(this, data);
        }
        if (data !== OFF$6) { return data }
      }

      msg = inspector$3(msg, this.get('verbose'), this.get('argv.inspector'));
    }

    return msg
  },
};

var combinations$1 = index$39.combinations;

var text$2 = {
  /**
   * @desc decorate fliplog with color shorthands
   * @return {void}
   */
  init: function init() {
    var this$1 = this;

    combinations$1.forEach(function (color) {
      this$1[color] = function (text) {
        if ( text === void 0 ) text = null;

        if (text !== null) { this$1.text(text); }
        return this$1.color(color)
      };
    });
  },

  /**
   * @protected
   * @param {string} [msg='']
   * @return {string}
   */
  logSpaces: function logSpaces(msg) {
    if ( msg === void 0 ) msg = '';

    if (this.has('space') === false) { return msg }

    var space = this.get('space');
    if (Number.isInteger(space)) { return '\n'.repeat(space) }
    if (space === true) { return '\n\n\n' }
    // else if (space !== undefined) console.log('\n')

    return msg || ''
  },

  /**
   * @protected
   * @param {string} [msg]
   * @return {string}
   */
  getColored: function getColored(msg) {
    var logWrapFn = this.getLogWrapFn();

    if (this.get('text')) { return '' + logWrapFn(msg) }
    var text = logWrapFn(this.get('text'));
    if (text) { text += ':'; }

    return text
  },

  /**
   * with null parameter,
   * this allows using this fn
   * without setting color for the whole text
   *
   * @see FlipLog.addText
   *
   * @protected
   * @param {string | function} [color=null]
   * @return {Function}
   */
  getLogWrapFn: function getLogWrapFn(color) {
    if ( color === void 0 ) color = null;

    // deps
    var chalk = this.requirePkg('chalk');
    var logWrapFn = chalk;

    // variable
    if (color === null) {
      color = this.get('color');
    }

    if (this.has('colorer')) {
      return this.get('colorer').call(this, color, this)
    }

    // maybe we colored with something not in chalk, like xterm
    if (typeof color === 'function') {
      logWrapFn = color;
    }
    else if (color === false || this.has('color') === false) {
      // if there is no color, empty fn call
      logWrapFn = function (msg) { return msg; };
    }
    else if (color.includes('.')) {
      // dot-prop access to chalk or xterm
      color.split('.').forEach(function (clr) { return (logWrapFn = logWrapFn[clr]); });
    }
    else if (combinations$1.includes(color)) {
      // when in all combinations, then call the corresponding fn
      logWrapFn = logWrapFn[color];
    }
    else if (logWrapFn[color]) {
      // fallback style
      // otherwise if the fn has a method with the name of the color
      logWrapFn = logWrapFn[color];
    }

    // otherwise just use whatever was passed in
    return logWrapFn
  },

  /**
   * @desc when time is used, prepends timestamp to msg
   * @param  {string} msg
   * @return {string} returns msg with timestamp if needed
   */
  getTime: function getTime(msg) {
    if (this.has('time') === false) {
      return msg
    }

    var time = this.get('time');
    var hasTime = time !== false;

    if (hasTime) {
      var color = typeof time === 'string' ? time : 'yellow';
      var chalk = this.requirePkg('chalk');

      var data = new Date();

      var hour = data.getHours();
      var min = data.getMinutes();
      var sec = data.getSeconds();
      var ms$$1 = data.getMilliseconds();

      hour = hour < 10 ? `0${hour}` : hour;
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      // ms = ms < 10 ? `0${sec}` : ms

      // ${ms}:
      return chalk[color](`${hour}:${min}:${sec}: `) + msg
    }

    return msg
  },
};

var index$43 = {
  data: data,
  text: text$2,
};

var byName = {
  preset: '🍰',
  step: '👣',
  fusebox: '💣🛅',
  webpack: '🕸🛅',
  rollup: '🗞️🛅',
  babel: '🗼',
  neutrino: '🇳🕸',
  plugin: '🔌',
  alias: '🏹',
  factory: '🏭',
  chain: '⛓',
  fancy: '🎩',
  safety: '🛡',
  deps: '📦',
  util: '🖇',
  logUp: '🔈',
  logDown: '🔇',
  logNo: '🙊',
  save: '💾',
  validate: '🛂',
  script: '📜',
  filter: '☕',
  whitelist: '🏳️',
  blacklist: '🏴',
  flag: '🚩',
  vanilla: '🍦',
  trick: '🎃',
  lint: '👕',
  phone: '📞',
  gear: '⚙',
  config: '⚙',
  color: '🎨',
  done: '☑️',
  scale: '⚖️️',
  loader: '🏋',
  pub: '📢',
  sub: '👂',
  file: '📒',
  map: '🗺',
  api: '🌐',
  trash: '🗑',
  perf: '⚡',
  find: '🔎',
  tool: '🔧',
  sugar: '🍬',
  timeStart: '⌛',
  timeEnd: '⏳',
  timer: '⏲',
  run: '🏃',
  serve: '🤾',
  split: '🤸',
  car: '🏎️',
  cache: '💸',
  info: 'ℹ️️',
  fix: '⚒️',
  cut: '✂️',
  dials: '🎛',
  slider: '🎚',
  up: '⬆',
  down: '⬇',
  flip: '🏗',
  test: '🔬',
  target: '🎯',
  fire: '👨‍🔧',
  add: '➕',
  remove: '❌',
  data: '🐘',
  x: '✖️',
  no: '🚫',
  model: '🗽',
  undo: '↩️',
  redo: '↪️',
  tree: '🌲',
  crown: '👑',
  cli: '🖥',
  hole: '🕳',
  num: '🔢',
  letter: '🔤',
  caps: '🔠',
  symbol: '🔣',
  key: '🗝️',
  wave: '👋',
  battery: '🔋',
  view: '👀',
  link: '🔗',
  simplify: '👾',
  todo: '📝',
  docs: '📚',
  snail: '🐌',
  lock: '🔒',
  unlock: '🔓',
  window: '🖼️',
  graph: '📊',
  rocket: '🚀',
  freeze: '❄️',
  promise: '💍',
  wip: '🚧',
  story: '📓',
  measure: '📐',
  baby: '🚼',
  ship: '⛴',
  meta: '📇',
  loop: '🔁',
  magic: '🔮',
  pin: '📌',
  hub: '💠',
  anim: '🌀',
  merge: '▶️◀️',
  bug: '🐛',
  leak: '🚱',
  experiment: '⚗',
  abstract: '♻️',
  nest: '🐣',
  architecture: '🏛️',
  structure: '🏰',
};
var emojiByName = function emoji(name) {
  return byName[name]
};

var OFF$7 = index$39.OFF;
var objToStr$1 = index$39.objToStr;
var isFunctionWithNoKeys$1 = index$39.isFunctionWithNoKeys;

var index_node = function (pluginObjs) {
  var shh = {
    shushed: false,
  };
  var shushed = {};
  var required = {};
  var scoped = {};

  /**
 *
 * @TODO:
 * - [x] change pkg config
 * - [x] be able to pass in .config at runtime to install more dependencies
 * - [x] check pkg json config at runtime
 * - [x] call depflip on postinstall
 * - [x] ensure all tests work
 * - test by installing in another package, release as alpha,
 *  - OR read its own pkg config hahah
 *
 * - ensure all files are in pkg.files
 * - update docs
 *
 * ------
 *
 * lower priority since it's a fair bit of work to mock this
 * unless it can be done with Reflection/Proxy??
 *
 * - [x] add safety to each function so check if dep is installed,
 *    if not, log that it was installed
 *    add to pkgjson config if it has one
 *    continue
 */

  // const {compose} = require('chain-able')
  // const ChainedMapExtendable = compose({extend: true})

  var LogChain = (function (ChainedMapExtendable$$1) {
    function LogChain(parent) {
      ChainedMapExtendable$$1.call(this, parent);
      delete this.inspect;
      this.version = '1.0.10';

      // this extending is 0microseconds
      this.extend(['title', 'color']);
      this.extendWith(['space', 'tosource', 'time', 'silent'], true);

      this.set('logger', console.log);
      this.resets = [];
      this.presets = {};
      this.log = this.echo;
      this.shh = shh;
      this.handleParent(parent);
      // this.clr = require('chalk')

      return this
    }

    if ( ChainedMapExtendable$$1 ) LogChain.__proto__ = ChainedMapExtendable$$1;
    LogChain.prototype = Object.create( ChainedMapExtendable$$1 && ChainedMapExtendable$$1.prototype );
    LogChain.prototype.constructor = LogChain;

    /**
   * @inheritdoc
   * @see this.factory
   */
    LogChain.factory = function factory (instance) {
      if ( instance === void 0 ) instance = null;

      return new LogChain(instance).factory(instance)
    };

    /**
   * @since 0.3.0
   * @TODO could be .scoped and then pass in debug here...
   * @desc creates a new instance
   * @param {FlipLog | null} [instance=null] specific instance, or new one
   * @return {FlipLog} @chainable
   */
    LogChain.prototype.factory = function factory (instance) {
      if ( instance === void 0 ) instance = null;

      var plugins = Object.keys(pluginObjs);
      var log = instance || new LogChain();

      for (var u = 0; u < plugins.length; u++) {
        var key = plugins[u];
        log.use(pluginObjs[key]);
      }

      if (instance !== null && typeof instance === 'string') {
        scoped[instance] = log;
      }

      return log.reset()
    };

    /**
   * @since 0.3.0
   * @desc adds to the scope, or gets from the scope :-}
   * @param  {string} name
   * @return {FlipLog} @chainable
   */
    LogChain.prototype.scope = function scope (name) {
      scoped[name] = scoped[name] || this;
      return scoped[name]
    };

    /**
   * @param  {string} name
   * @return {FlipLog}
   */
    LogChain.prototype.used = function used (name) {
      return this.set('used', (this.get('used') || []).concat([name]))
    };

    /**
   * @desc safely require a dependency if it exists
   *       if not, use the one in modules
   * @param  {string} name dependency package npm name
   * @return {false | Object | any} dependency required
   */
    LogChain.prototype.requirePkg = function requirePkg (name) {
      // if we've already included it - may need to set as require.resolve
      if (required[name]) {
        // return require(name) // eslint-disable-line
        return required[name] // eslint-disable-line
      }

      // wrap require
      var dep = index$4(name);

      // warn and safely handle missing pkgs
      if (!dep) {
        var colored = this.colored(name);
        // @NOTE: IGNORING THIS
        this.text('did not have package ' + colored)
          .data(`npm i ${colored} --save-dev \n yarn add ${colored} --dev`)
          .echo();
        return false
      }

      // store result for later
      required[name] = dep;

      // return dep
      return dep
    };

    /**
   * @TODO: should wait until done using, store the deps, do all at once, uniq them
   *
   * @param  {Object} obj
   * @return {FlipLog}
   */
    LogChain.prototype.use = function use (obj) {
      var this$1 = this;

      if (isFunctionWithNoKeys$1(obj)) {
        obj = obj.call(this, this);
      }

      if (this.deps === undefined) {
        this.deps = [];
      }

      // @TODO:
      // this way we only use things once
      // and can debug what plugins/middleware/ was used
      if (this.has('used') === true) {
        if (obj.name && this.get('used').includes(obj.name)) {
          return this
        }
      } else if (obj.name !== undefined) {
        this.used(obj.name);
        delete obj.name;
      }

      /**
     * so we can have a vanilla state with each plugin
     *
     * if it has a reset function,
     * add to an array of reset functions
     */
      if (obj.reset) {
        if (this.resets.includes(obj.reset) === false) {
          this.resets.push(obj.reset.bind(this));
        }
        delete obj.reset;
      }

      /**
     * call any initialization decorators
     */
      if (obj.init) {
        obj.init.bind(this)();
      }

      var keys = Object.keys(obj);
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        if (key === 'deps' || typeof obj[key].bind !== 'function') {
          // console.log({key}, 'not bindable')
          continue
        }

        this$1[key] = obj[key].bind(this$1);
      }

      return this
    };

    /**
   * @private
   * @param {any} parent
   * @return {FlipLog}
   */
    LogChain.prototype.handleParent = function handleParent (parent) {
      this.from = ChainedMapExtendable$$1.prototype.from.bind(this);
      if (!parent || !(parent instanceof ChainedMapExtendable$$1)) { return this }

      var entries = parent.entries();
      if (!entries) { return this }

      var filter = entries.filter;
      var presets = parent.presets;

      if (presets) { this.presets = presets; }
      if (filter) { this.filter(filter); }

      return this
    };

    /**
   * @TODO needs work to make it a function again
   * @param  {Boolean} [hardReset=false]
   * @return {FlipLog}
   */
    LogChain.prototype.new = function new$1 (hardReset) {
      if ( hardReset === void 0 ) hardReset = false;

      return this

      // if using hard reset, do not inherit
      // const logChain = new LogChain(hardReset ? null : this)

      // return logChain

      // const expose = require('expose-hidden')

      // so we can extend without reassigning function name
      // delete logChain.name
      //
      // const logfn = (arg, text, color) => {
      //   return logChain.data(arg).text(text).color(color).verbose(10).echo()
      // }
      //
      // expose(logChain)
      // Object.assign(logfn, logChain)
      // return logfn
    };

    /**
   * @perf takes ~500 microseconds
   * reset the state so we do not instantiate every time
   * @return {FlipLog}
   */
    LogChain.prototype.reset = function reset () {
      var this$1 = this;

      // if (this.resetted === true) return this
      // this.resetted = true
      if (!this.savedLog) { this.savedLog = []; }
      // const timer = require('fliptime')
      // timer.start('reset')
      this.delete('silent')
        .delete('title')
        .delete('tosource')
        .delete('text')
        .delete('color')
        .delete('space')
        // .delete('data')
        .set('data', OFF$7)
        .verbose(10);

      // timer.start('fns')
      for (var r = 0; r < this.resets.length; r++) {
        this$1.resets[r]();
      }

      // timer.stop('reset').stop('fns').log('reset').log('fns')

      return this
    };

    // ----------------------------- adding data ------------------

    /**
   * @param  {number | boolean | string | any} data
   * @return {FlipLog}
   */
    LogChain.prototype.verbose = function verbose (data) {
      if (Number.isInteger(data)) {
        return this.set('verbose', data)
      }
      if (typeof data === 'boolean') {
        return this.set('verbose', data)
      }
      if (!data && data !== false) {
        return this.set('verbose', true)
      }
      if (data === false) {
        return this.set('verbose', false)
      }

      return this.set('data', data).set('verbose', true)
    };

    /**
   * @param {any} arg
   * @return {FlipLog}
   */
    LogChain.prototype.data = function data (arg) {
      if (arguments.length === 1) {
        return this.set('data', arg)
      }

      return this.set('data', Array.from(arguments))
    };

    /**
   * @param  {string | serializable} text
   * @return {FlipLog}
   */
    LogChain.prototype.text = function text (text$1) {
      if (this.has('title') === true) {
        var title$$1 = this.get('title') ? `${this.get('title')}` : '';
        return this.set('text', title$$1 + text$1)
      }

      return this.set('text', text$1)
    };

    /**
   * @tutorial https://github.com/fliphub/fliplog#-emoji
   * @see FlipLog.title
   * @param {string} name
   * @return {FlipLog}
   */
    LogChain.prototype.emoji = function emoji (name) {
      var emojiByName$$1 = emojiByName;
      return this.title(`${emojiByName$$1(name)}  `)
    };

    /**
   * @param {string} msg
   * @param {string} [color=false]
   * @return {FlipLog}
   */
    LogChain.prototype.addText = function addText (msg, color) {
      if ( color === void 0 ) color = false;

      if (color !== false) {
        msg = this.getColored(color)(msg);
      }

      if (this.has('text') === true) {
        this.set('text', `${this.get('text')} ${msg}`);
      } else {
        this.text(msg);
      }

      return this
    };

    // ----------------------------- actual output ------------------

    /**
   * @since 0.3.0
   * @desc to reduce complexity in echo function
   * @return {FlipLog} @chainable
   */
    LogChain.prototype.echoShushed = function echoShushed () {
      // everything is silent everywhere,
      // store log with formatter,
      // reset
      this.finalize();
      var text = this.logText();
      var datas = this.logData();
      shushed[Date.now] = {text: text, datas: datas};
      this.shushed = shushed;
      this.reset();
      return this
    };

    /**
   * @see https://stackoverflow.com/questions/4976466/difference-between-process-stdout-write-and-console-log-in-node-js
   * @since 0.3.1
   * @desc set the logger to be process.stdout instead of console.log
   * @param  {boolean} [data=OFF] `false` will make it not output
   * @return {FlipLog} @chainable
   */
    LogChain.prototype.stdout = function stdout (data) {
      if ( data === void 0 ) data = OFF$7;

      this.set('logger', process.stdout.write.bind(process.stdout));
      // this._stdout.write(require('util').format.apply(this, arguments) + '\n')
      return this.echo(data)
    };

    /**
   * @rename @since 0.4.0 echoConsole -> forceEcho
   * @since 0.3.0
   * @see this.echo, this.finalize, this.logText, this.logData, this.reset
   * @desc the actual internal `console.log`ing
   * @return {FlipLog} @chainable
   */
    LogChain.prototype.forceEcho = function forceEcho () {
      // so we can have them on 1 line
      this.finalize();
      var datas = this.logData();
      var text = this.logText();
      var logger = this.get('logger') || console.log;

      // check whether the values are default constant OFF
      // so that when we log, they can be on the same console.log call
      // in order to be on the same line
      if (datas === OFF$7 && text === OFF$7) {
        return this
      }
      // text and no data
      if (datas !== OFF$7 && text === OFF$7) {
        logger(datas);
      } else if (datas === OFF$7 && text !== OFF$7) {
        // no data, just text
        logger(text + '');
      } else if (datas !== OFF$7 && text !== OFF$7) {
        if (/\n|\r/gim.test(text)) {
          if (logger === console.log) {
            logger(text + '');
            logger(datas);
          } else {
            logger(text + '', datas);
          }
        } else {
          logger(text + '', datas);
        }
      }

      if (this.has('spaces') === true) {
        var spaces = this.logSpaces();
        if (spaces !== '') { logger(spaces); }
      }

      // timer.stop('echo-new').log('echo-new')
      this.reset();
      return this
    };

    /**
   * @TODO: needs thought whether to return or to echo...
   *        since `+` is shorter to echo
   *
   * @alias log
   * @alias echo
   * @since 0.4.0
   * @return {string} log output
   */
    // toString() {
    //   return this.echo()
    // }

    /**
   * @desc echos, then returns
   * @example log.bold('eh').data({})+
   * @alias echo
   * @alias log
   * @return {number} 0 if silent, 1 if success
   */
    LogChain.prototype.toNumber = function toNumber () {
      this.echo();
      return shh.shushed === true || this.has('silent') === true ? 0 : 1
    };

    /**
   * @alias toString
   * @alias log
   * @since 0.0.1
   * @param  {boolean} [data=OFF] `false` will make it not output
   * @return {FlipLog} @chainable
   */
    LogChain.prototype.echo = function echo (data) {
      if ( data === void 0 ) data = OFF$7;

      // const timer = require('fliptime')
      // timer.start('echo-new')

      if (this.stack !== null && this.stack !== undefined) {
        this.stack();
      }

      // data !== 'force' &&
      /* prettier-ignore */
      if (this.has('tags') === true || this.has('filter') === true) {
      this._filter();
    }

      // don't call any formatter middleware, reset state, perf
      //  || data === 0
      if (data === false) {
        this.reset();
        return this
      }

      // data is default, use the stored data
      // if (data === OFF) {
      //   data = this.get('data')
      // }

      if (shh.shushed === true) {
        return this.echoShushed()
      }

      // don't call any formatter middleware, silent
      if (this.has('silent') === true) {
        this.reset();
        return this
      }

      // if we are using sleep plugin
      if (this.sleepIfNeeded !== undefined) {
        this.sleepIfNeeded();
      }

      return this.forceEcho()
    };

    /**
   * @private
   * @since 0.3.0
   * @desc call the formatters and transformers on the data if we are echoing
   *       so that they are only formatted when echoing
   * @return {FlipLog} @chainable
   */
    LogChain.prototype.finalize = function finalize () {
      var arg = this.get('data');
      if (this.has('formatter') === true) {
        arg = this.get('formatter')(arg);
      }

      // @TODO: don't forget about ansi...
      if (this.has('textFormatter') === true) {
        var txt = this.get('text');
        var text = txt;
        var title$$1 = '';
        if (this.has('title')) {
          title$$1 = this.get('title');
          text = title$$1 + txt;
          this.delete('title');
        }

        text = this.get('textFormatter').call(this, text, this);
        this.set('text', text);
        this.delete('textFormatter');
      }

      return this.set('data', arg)
    };

    /**
   * @private
   * @since 0.1.0
   * @TODO: should call middleware instead of hardcoded methods
   * @desc does the actuall echoing of the text
   * @return {string}
   */
    LogChain.prototype.logText = function logText () {
      if (this.has('text') === false) {
        return OFF$7
      }

      var text = this.get('text');

      // if (text === null || text === undefined || text === null || text === OFF) {
      // if (!text) return OFF

      // convert obj to string
      if (typeof text === 'object') {
        text = objToStr$1(text);
      }

      if (this.has('color') === true) {
        text = this.getColored(text);
      }
      if (this.has('text') === true) {
        text = this.getTime(text);
      }

      if (this.has('spaces') === true) {
        text += this.logSpaces();
      }

      return text
    };

    /**
   * @private
   * @TODO: should be array of middleware
   * @desc returns the data to log
   * @return {any}
   */
    LogChain.prototype.logData = function logData () {
      var data = this.get('data');
      if (data === OFF$7) { return OFF$7 }
      data = this.getToSource(data);
      data = this.getVerbose(data);

      return data
    };

    return LogChain;
  }(ChainedMapExtendable));

  // ----------------------------- instantiate ------------------

  // instantiating + adding + reset = ~10 microseconds
  var log = new LogChain().factory();
  return log
};

var pluginObjs = Object.assign(
  index_web$2,
  index$43
);
//https://github.com/chalk/chalk/issues/1
// https://github.com/hansifer/ConsoleFlair
// https://github.com/Tjatse/ansi-html
var web = index_node(pluginObjs);
var boss = function (text, name) { return index$28(index$26(index$16[name](text))); };

// https://github.com/adamschwartz/log
window.fliplog = web;
window.fliplog.webs = {
  boss: boss,
  flair: index$28,
  chalk: index$16,
  color: index$26,
  debug: index,
  prettyformat: index$2,
  kindof: index$8,
  fmtobj: index$10,
  diffs: index$14,
  clone: index$12,
};

var index_web = web;

return index_web;

})));
