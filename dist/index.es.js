import React from 'react';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    invariant_1(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var index$1 = createCommonjsModule(function (module) {
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

function cn(a) {
  return a.map(function (b) {
    if (b === false) return null;
    return b;
  }).join(' ').replace(/\s+/g, ' ').trim();
}





function slideSize(totalSlides, visibleSlides) {
  return 100 / totalSlides * visibleSlides / visibleSlides;
}

function slideTraySize(totalSlides, visibleSlides) {
  return 100 * totalSlides / visibleSlides;
}

function pct(num) {
  return num + '%';
}

var LOADING = 'loading';
var SUCCESS = 'success';
var ERROR = 'error';

var CarouselPropTypes = {
  children: index$1.oneOfType([index$1.arrayOf(index$1.node), index$1.node]),
  height: function height(props, propName) {
    var prop = props[propName];
    if (props.orientation === 'vertical' && (prop === null || typeof prop !== 'number')) {
      return new Error('Missing required property \'' + propName + '\' when orientation is vertical.  You must supply a number representing the height in pixels');
    }
    return null;
  },
  orientation: index$1.oneOf(['horizontal', 'vertical']),
  isBgImage: function isBgImage(props, propName) {
    var value = props[propName];
    if (value === true && props.tag === 'img') {
      return new Error('HTML img elements should not have a backgroundImage.  Please use ' + propName + ' for other block-level HTML tags, like div, a, section, etc...');
    }
    return null;
  }
};

var s = { "buttonBack": "_buttonBack_113ph_1" };

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var ButtonBack = function (_React$Component) {
  inherits(ButtonBack, _React$Component);
  createClass(ButtonBack, null, [{
    key: 'setDisabled',
    value: function setDisabled(disabled, currentSlide) {
      if (disabled !== null) return disabled;
      if (currentSlide === 0) return true;
      return false;
    }
  }]);

  function ButtonBack(props) {
    classCallCheck(this, ButtonBack);

    var _this = possibleConstructorReturn(this, (ButtonBack.__proto__ || Object.getPrototypeOf(ButtonBack)).call(this, props));

    _this.handleOnClick = _this.handleOnClick.bind(_this);
    _this.state = {
      disabled: ButtonBack.setDisabled(props.disabled, props.currentSlide)
    };
    return _this;
  }

  // TODO: get tests for this to work again
  /* istanbul ignore next */


  createClass(ButtonBack, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        disabled: ButtonBack.setDisabled(nextProps.disabled, nextProps.currentSlide)
      });
    }
  }, {
    key: 'handleOnClick',
    value: function handleOnClick(ev) {
      var _props = this.props,
          carouselStore = _props.carouselStore,
          currentSlide = _props.currentSlide,
          onClick = _props.onClick,
          step = _props.step;

      var newCurrentSlide = Math.max(currentSlide - step, 0);
      carouselStore.setStoreState({
        currentSlide: newCurrentSlide
      }, onClick !== null && onClick.call(this, ev));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          carouselStore = _props2.carouselStore,
          className = _props2.className,
          currentSlide = _props2.currentSlide,
          disabled = _props2.disabled,
          onClick = _props2.onClick,
          step = _props2.step,
          props = objectWithoutProperties(_props2, ['carouselStore', 'className', 'currentSlide', 'disabled', 'onClick', 'step']);


      var newClassName = cn([s.buttonBack, 'carousel__back-button', className]);

      return React.createElement(
        'button',
        _extends({
          'aria-label': 'previous',
          className: newClassName,
          onClick: this.handleOnClick,
          disabled: this.state.disabled
        }, props),
        this.props.children
      );
    }
  }]);
  return ButtonBack;
}(React.Component);

ButtonBack.propTypes = {
  carouselStore: index$1.object.isRequired,
  children: CarouselPropTypes.children.isRequired,
  className: index$1.string,
  currentSlide: index$1.number.isRequired,
  disabled: index$1.bool,
  onClick: index$1.func,
  step: index$1.number.isRequired
};
ButtonBack.defaultProps = {
  className: null,
  disabled: null,
  onClick: null
};

var index$3 = createCommonjsModule(function (module, exports) {
var toString = {}.toString;
var DomNode = typeof window != 'undefined'
  ? window.Node
  : Function; // could be any function

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = exports = function type(x){
  var type = typeof x;
  if (type != 'object') return type
  type = types[toString.call(x)];
  if (type == 'object') {
    // in case they have been polyfilled
    if (x instanceof Map) return 'map'
    if (x instanceof Set) return 'set'
    return 'object'
  }
  if (type) return type
  if (x instanceof DomNode) switch (x.nodeType) {
    case 1:  return 'element'
    case 3:  return 'text-node'
    case 9:  return 'document'
    case 11: return 'document-fragment'
    default: return 'dom-node'
  }
};

var types = exports.types = {
  '[object Function]': 'function',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object Set]': 'set',
  '[object String]': 'string',
  '[object Null]': 'null',
  '[object Undefined]': 'undefined',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
  '[object Object]': 'object',
  '[object Map]': 'map',
  '[object Text]': 'text-node',
  '[object Uint8Array]': 'bit-array',
  '[object Uint16Array]': 'bit-array',
  '[object Uint32Array]': 'bit-array',
  '[object Uint8ClampedArray]': 'bit-array',
  '[object Error]': 'error',
  '[object FormData]': 'form-data',
  '[object File]': 'file',
  '[object Blob]': 'blob'
};
});

// (any, any, [array]) -> boolean
function equal(a, b, memos){
  // All identical values are equivalent
  if (a === b) return true
  var fnA = types[index$3(a)];
  var fnB = types[index$3(b)];
  return fnA && fnA === fnB
    ? fnA(a, b, memos)
    : false
}

var types = {};

// (Number) -> boolean
types.number = function(a, b){
  return a !== a && b !== b/*Nan check*/
};

// (function, function, array) -> boolean
types['function'] = function(a, b, memos){
  return a.toString() === b.toString()
    // Functions can act as objects
    && types.object(a, b, memos)
    && equal(a.prototype, b.prototype)
};

// (date, date) -> boolean
types.date = function(a, b){
  return +a === +b
};

// (regexp, regexp) -> boolean
types.regexp = function(a, b){
  return a.toString() === b.toString()
};

// (DOMElement, DOMElement) -> boolean
types.element = function(a, b){
  return a.outerHTML === b.outerHTML
};

// (textnode, textnode) -> boolean
types.textnode = function(a, b){
  return a.textContent === b.textContent
};

// decorate `fn` to prevent it re-checking objects
// (function) -> function
function memoGaurd(fn){
  return function(a, b, memos){
    if (!memos) return fn(a, b, [])
    var i = memos.length, memo;
    while (memo = memos[--i]) {
      if (memo[0] === a && memo[1] === b) return true
    }
    return fn(a, b, memos)
  }
}

types['arguments'] =
types['bit-array'] =
types.array = memoGaurd(arrayEqual);

// (array, array, array) -> boolean
function arrayEqual(a, b, memos){
  var i = a.length;
  if (i !== b.length) return false
  memos.push([a, b]);
  while (i--) {
    if (!equal(a[i], b[i], memos)) return false
  }
  return true
}

types.object = memoGaurd(objectEqual);

// (object, object, array) -> boolean
function objectEqual(a, b, memos) {
  if (typeof a.equal == 'function') {
    memos.push([a, b]);
    return a.equal(b, memos)
  }
  var ka = getEnumerableProperties(a);
  var kb = getEnumerableProperties(b);
  var i = ka.length;

  // same number of properties
  if (i !== kb.length) return false

  // although not necessarily the same order
  ka.sort();
  kb.sort();

  // cheap key test
  while (i--) if (ka[i] !== kb[i]) return false

  // remember
  memos.push([a, b]);

  // iterate again this time doing a thorough check
  i = ka.length;
  while (i--) {
    var key = ka[i];
    if (!equal(a[key], b[key], memos)) return false
  }

  return true
}

// (object) -> array
function getEnumerableProperties (object) {
  var result = [];
  for (var k in object) if (k !== 'constructor') {
    result.push(k);
  }
  return result
}

var index$2 = equal;

var index$2$1 = function isMergeableObject(value) {
	return isNonNullObject(value) && isNotSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isNotSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue !== '[object RegExp]'
		&& stringValue !== '[object Date]'
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {}
}

function cloneIfNecessary(value, optionsArgument) {
    var clone = optionsArgument && optionsArgument.clone === true;
    return (clone && index$2$1(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}

function defaultArrayMerge(target, source, optionsArgument) {
    var destination = target.slice();
    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            destination[i] = cloneIfNecessary(e, optionsArgument);
        } else if (index$2$1(e)) {
            destination[i] = deepmerge(target[i], e, optionsArgument);
        } else if (target.indexOf(e) === -1) {
            destination.push(cloneIfNecessary(e, optionsArgument));
        }
    });
    return destination
}

function mergeObject(target, source, optionsArgument) {
    var destination = {};
    if (index$2$1(target)) {
        Object.keys(target).forEach(function(key) {
            destination[key] = cloneIfNecessary(target[key], optionsArgument);
        });
    }
    Object.keys(source).forEach(function(key) {
        if (!index$2$1(source[key]) || !target[key]) {
            destination[key] = cloneIfNecessary(source[key], optionsArgument);
        } else {
            destination[key] = deepmerge(target[key], source[key], optionsArgument);
        }
    });
    return destination
}

function deepmerge(target, source, optionsArgument) {
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var options = optionsArgument || { arrayMerge: defaultArrayMerge };
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    if (!sourceAndTargetTypesMatch) {
        return cloneIfNecessary(source, optionsArgument)
    } else if (sourceIsArray) {
        var arrayMerge = options.arrayMerge || defaultArrayMerge;
        return arrayMerge(target, source, optionsArgument)
    } else {
        return mergeObject(target, source, optionsArgument)
    }
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
    if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements')
    }

    // we are sure there are at least 2 values, so it is safe to have no initial value
    return array.reduce(function(prev, next) {
        return deepmerge(prev, next, optionsArgument)
    })
};

var index$5 = deepmerge;

var cjs = index$5;

function WithStore(WrappedComponent) {
  var mapStateToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return {};
  };

  var Wrapper = function (_React$Component) {
    inherits(Wrapper, _React$Component);

    function Wrapper(props, context) {
      classCallCheck(this, Wrapper);

      var _this = possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, props, context));

      _this.state = mapStateToProps(context.carouselStore.state);
      _this.updateStateProps = _this.updateStateProps.bind(_this);
      return _this;
    }

    createClass(Wrapper, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.context.carouselStore.subscribe(this.updateStateProps);
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        var test = !index$2(nextState, this.state) || !index$2(nextProps, this.props);
        return test;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context.carouselStore.unsubscribe(this.updateStateProps);
      }
    }, {
      key: 'updateStateProps',
      value: function updateStateProps() {
        this.setState(mapStateToProps(this.context.carouselStore.state));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var props = cjs(this.state, this.props);

        return React.createElement(
          WrappedComponent,
          _extends({
            ref: function ref(el) {
              _this2.instance = el;
            } // allows access to refs in wrapped components.
          }, props, {
            carouselStore: {
              masterSpinnerError: this.context.carouselStore.masterSpinnerError,
              masterSpinnerSuccess: this.context.carouselStore.masterSpinnerSuccess,
              setStoreState: this.context.carouselStore.setStoreState,
              subscribeMasterSpinner: this.context.carouselStore.subscribeMasterSpinner,
              unsubscribeMasterSpinner: this.context.carouselStore.unsubscribeMasterSpinner,
              unsubscribeAllMasterSpinner: this.context.carouselStore.unsubscribeAllMasterSpinner
            }
          }),
          this.props.children
        );
      }
    }]);
    return Wrapper;
  }(React.Component);

  Wrapper.propTypes = {
    children: CarouselPropTypes.children
  };
  Wrapper.defaultProps = {
    children: null
  };
  Wrapper.contextTypes = {
    carouselStore: index$1.object
  };


  return Wrapper;
}

var index = WithStore(ButtonBack, function (state) {
  return {
    currentSlide: state.currentSlide,
    step: state.step
  };
});

var s$1 = { "buttonFirst": "_buttonFirst_y31jn_1" };

var _class;
var _temp;

var ButtonFirst = (_temp = _class = function (_React$Component) {
  inherits(ButtonFirst, _React$Component);

  function ButtonFirst() {
    classCallCheck(this, ButtonFirst);

    var _this = possibleConstructorReturn(this, (ButtonFirst.__proto__ || Object.getPrototypeOf(ButtonFirst)).call(this));

    _this.handleOnClick = _this.handleOnClick.bind(_this);
    return _this;
  }

  createClass(ButtonFirst, [{
    key: 'handleOnClick',
    value: function handleOnClick(ev) {
      var _props = this.props,
          carouselStore = _props.carouselStore,
          onClick = _props.onClick;

      carouselStore.setStoreState({
        currentSlide: 0
      }, onClick !== null && onClick.call(this, ev));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          carouselStore = _props2.carouselStore,
          className = _props2.className,
          currentSlide = _props2.currentSlide,
          disabled = _props2.disabled,
          onClick = _props2.onClick,
          totalSlides = _props2.totalSlides,
          props = objectWithoutProperties(_props2, ['carouselStore', 'className', 'currentSlide', 'disabled', 'onClick', 'totalSlides']);


      var newClassName = cn([s$1.buttonFirst, 'carousel__first-button', className]);

      var newDisabled = disabled !== null ? disabled : currentSlide === 0;

      return React.createElement(
        'button',
        _extends({
          'aria-label': 'first',
          className: newClassName,
          onClick: this.handleOnClick,
          disabled: newDisabled
        }, props),
        this.props.children
      );
    }
  }]);
  return ButtonFirst;
}(React.Component), _class.propTypes = {
  carouselStore: index$1.object.isRequired,
  children: CarouselPropTypes.children.isRequired,
  className: index$1.string,
  currentSlide: index$1.number.isRequired,
  disabled: index$1.bool,
  onClick: index$1.func,
  totalSlides: index$1.number.isRequired
}, _class.defaultProps = {
  className: null,
  disabled: null,
  onClick: null
}, _temp);

var index$6 = WithStore(ButtonFirst, function (state) {
  return {
    currentSlide: state.currentSlide,
    totalSlides: state.totalSlides
  };
});

var s$2 = { "buttonNext": "_buttonNext_p1bs6_1" };

var _class$1;
var _temp$1;

var ButtonNext = (_temp$1 = _class$1 = function (_React$PureComponent) {
  inherits(ButtonNext, _React$PureComponent);
  createClass(ButtonNext, null, [{
    key: 'setDisabled',
    value: function setDisabled(disabled, currentSlide, visibleSlides, totalSlides) {
      if (disabled !== null) return disabled;
      if (currentSlide >= totalSlides - visibleSlides) return true;
      return false;
    }
  }]);

  function ButtonNext(props) {
    classCallCheck(this, ButtonNext);

    var _this = possibleConstructorReturn(this, (ButtonNext.__proto__ || Object.getPrototypeOf(ButtonNext)).call(this, props));

    _this.handleOnClick = _this.handleOnClick.bind(_this);
    _this.state = {
      disabled: ButtonNext.setDisabled(props.disabled, props.currentSlide, props.visibleSlides, props.totalSlides)
    };
    return _this;
  }

  // TODO: get tests for this to work again
  /* istanbul ignore next */


  createClass(ButtonNext, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        disabled: ButtonNext.setDisabled(nextProps.disabled, nextProps.currentSlide, nextProps.visibleSlides, nextProps.totalSlides)
      });
    }
  }, {
    key: 'handleOnClick',
    value: function handleOnClick(ev) {
      var _props = this.props,
          currentSlide = _props.currentSlide,
          onClick = _props.onClick,
          step = _props.step,
          carouselStore = _props.carouselStore;

      var maxSlide = this.props.totalSlides - this.props.visibleSlides;
      var newCurrentSlide = Math.min(currentSlide + step, maxSlide);
      carouselStore.setStoreState({
        currentSlide: newCurrentSlide
      }, onClick !== null && onClick.call(this, ev));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          carouselStore = _props2.carouselStore,
          className = _props2.className,
          currentSlide = _props2.currentSlide,
          disabled = _props2.disabled,
          onClick = _props2.onClick,
          step = _props2.step,
          totalSlides = _props2.totalSlides,
          visibleSlides = _props2.visibleSlides,
          props = objectWithoutProperties(_props2, ['carouselStore', 'className', 'currentSlide', 'disabled', 'onClick', 'step', 'totalSlides', 'visibleSlides']);


      var newClassName = cn([s$2.buttonNext, 'carousel__next-button', className]);

      return React.createElement(
        'button',
        _extends({
          'aria-label': 'next',
          className: newClassName,
          onClick: this.handleOnClick,
          disabled: this.state.disabled
        }, props),
        this.props.children
      );
    }
  }]);
  return ButtonNext;
}(React.PureComponent), _class$1.propTypes = {
  carouselStore: index$1.object.isRequired,
  children: CarouselPropTypes.children.isRequired,
  className: index$1.string,
  currentSlide: index$1.number.isRequired,
  disabled: index$1.bool,
  onClick: index$1.func,
  step: index$1.number.isRequired,
  totalSlides: index$1.number.isRequired,
  visibleSlides: index$1.number.isRequired
}, _class$1.defaultProps = {
  className: null,
  disabled: null,
  onClick: null
}, _temp$1);

var index$7 = WithStore(ButtonNext, function (state) {
  return {
    currentSlide: state.currentSlide,
    step: state.step,
    totalSlides: state.totalSlides,
    visibleSlides: state.visibleSlides
  };
});

var s$3 = { "buttonLast": "_buttonLast_x8dvv_1" };

var _class$2;
var _temp$2;

var ButtonLast = (_temp$2 = _class$2 = function (_React$Component) {
  inherits(ButtonLast, _React$Component);

  function ButtonLast() {
    classCallCheck(this, ButtonLast);

    var _this = possibleConstructorReturn(this, (ButtonLast.__proto__ || Object.getPrototypeOf(ButtonLast)).call(this));

    _this.handleOnClick = _this.handleOnClick.bind(_this);
    return _this;
  }

  createClass(ButtonLast, [{
    key: 'handleOnClick',
    value: function handleOnClick(ev) {
      var _props = this.props,
          carouselStore = _props.carouselStore,
          onClick = _props.onClick,
          totalSlides = _props.totalSlides,
          visibleSlides = _props.visibleSlides;

      carouselStore.setStoreState({
        currentSlide: totalSlides - visibleSlides
      }, onClick !== null && onClick.call(this, ev));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          carouselStore = _props2.carouselStore,
          className = _props2.className,
          currentSlide = _props2.currentSlide,
          disabled = _props2.disabled,
          onClick = _props2.onClick,
          totalSlides = _props2.totalSlides,
          visibleSlides = _props2.visibleSlides,
          props = objectWithoutProperties(_props2, ['carouselStore', 'className', 'currentSlide', 'disabled', 'onClick', 'totalSlides', 'visibleSlides']);


      var newClassName = cn([s$3.buttonLast, 'carousel__last-button', className]);

      var newDisabled = disabled !== null ? disabled : currentSlide >= totalSlides - visibleSlides;

      return React.createElement(
        'button',
        _extends({
          'aria-label': 'last',
          className: newClassName,
          onClick: this.handleOnClick,
          disabled: newDisabled
        }, props),
        this.props.children
      );
    }
  }]);
  return ButtonLast;
}(React.Component), _class$2.propTypes = {
  carouselStore: index$1.object.isRequired,
  children: CarouselPropTypes.children.isRequired,
  className: index$1.string,
  currentSlide: index$1.number.isRequired,
  disabled: index$1.bool,
  onClick: index$1.func,
  totalSlides: index$1.number.isRequired,
  visibleSlides: index$1.number.isRequired
}, _class$2.defaultProps = {
  className: null,
  disabled: null,
  onClick: null
}, _temp$2);

var index$8 = WithStore(ButtonLast, function (state) {
  return {
    currentSlide: state.currentSlide,
    totalSlides: state.totalSlides,
    visibleSlides: state.visibleSlides
  };
});

/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var index$10 = function isExtendable(val) {
  return typeof val !== 'undefined' && val !== null
    && (typeof val === 'object' || typeof val === 'function');
};

/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var index$14 = function forIn(obj, fn, thisArg) {
  for (var key in obj) {
    if (fn.call(thisArg, obj[key], key, obj) === false) {
      break;
    }
  }
};

var hasOwn = Object.prototype.hasOwnProperty;

var index$12 = function forOwn(obj, fn, thisArg) {
  index$14(obj, function(val, key) {
    if (hasOwn.call(obj, key)) {
      return fn.call(thisArg, obj[key], key, obj);
    }
  });
};

var index$9 = function omit(obj, keys) {
  if (!index$10(obj)) return {};

  keys = [].concat.apply([], [].slice.call(arguments, 1));
  var last = keys[keys.length - 1];
  var res = {}, fn;

  if (typeof last === 'function') {
    fn = keys.pop();
  }

  var isFunction = typeof fn === 'function';
  if (!keys.length && !isFunction) {
    return obj;
  }

  index$12(obj, function(value, key) {
    if (keys.indexOf(key) === -1) {

      if (!isFunction) {
        res[key] = value;
      } else if (fn(value, key, obj)) {
        res[key] = value;
      }
    }
  });
  return res;
};

var _class$3;
var _temp$3;

var CarouselProvider$1 = (_temp$3 = _class$3 = function (_React$Component) {
  inherits(CarouselProvider$$1, _React$Component);

  function CarouselProvider$$1(props, context) {
    classCallCheck(this, CarouselProvider$$1);

    var _this = possibleConstructorReturn(this, (CarouselProvider$$1.__proto__ || Object.getPrototypeOf(CarouselProvider$$1)).call(this, props, context));

    var options = {
      currentSlide: props.currentSlide,
      disableAnimation: props.disableAnimation,
      hasMasterSpinner: props.hasMasterSpinner,
      imageErrorCount: 0,
      imageSuccessCount: 0,
      masterSpinnerThreshold: 0,
      naturalSlideHeight: props.naturalSlideHeight,
      naturalSlideWidth: props.naturalSlideWidth,
      orientation: props.orientation,
      slideSize: slideSize(props.totalSlides, props.visibleSlides),
      slideTraySize: slideTraySize(props.totalSlides, props.visibleSlides),
      step: props.step,
      totalSlides: props.totalSlides,
      touchEnabled: props.touchEnabled,
      visibleSlides: props.visibleSlides
    };
    _this.carouselStore = new Store(options);
    _this.disableAnimationTimer = null;
    return _this;
  }

  createClass(CarouselProvider$$1, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return { carouselStore: this.carouselStore };
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var newStoreState = {};

      ['disableAnimation', 'hasMasterSpinner', 'naturalSlideHeight', 'naturalSlideWidth', 'orientation', 'step', 'totalSlides', 'touchEnabled', 'visibleSlides'].forEach(function (propName) {
        if (nextProps[propName] !== _this2.props[propName]) {
          newStoreState[propName] = nextProps[propName];
        }
      });

      var _carouselStore$getSto = this.carouselStore.getStoreState(),
          currentSlide = _carouselStore$getSto.currentSlide,
          disableAnimation = _carouselStore$getSto.disableAnimation;

      var isNewCurrentSlide = currentSlide !== nextProps.currentSlide;
      var isAnimationDisabled = newStoreState.disableAnimation || disableAnimation;

      if (isNewCurrentSlide) {
        newStoreState.currentSlide = nextProps.currentSlide;
      }

      if (isNewCurrentSlide && !isAnimationDisabled) {
        newStoreState.disableAnimation = true;
        window.clearTimeout(this.disableAnimationTimer);
        this.disableAnimationTimer = window.setTimeout(function () {
          _this2.carouselStore.setStoreState({
            disableAnimation: false
          });
        }, 160);
      }

      if (this.props.totalSlides !== nextProps.totalSlides || this.props.visibleSlides !== nextProps.visibleSlides) {
        newStoreState.slideSize = slideSize(nextProps.totalSlides, nextProps.visibleSlides);
        newStoreState.slideTraySize = slideTraySize(nextProps.totalSlides, nextProps.visibleSlides);
      }

      if (Object.keys(newStoreState).length > 0) {
        this.carouselStore.setStoreState(newStoreState);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.carouselStore.unsubscribeAllMasterSpinner();
      window.clearTimeout(this.disableAnimationTimer);
    }

    // Utility function for tests.
    // in jest + enzyme tests you can do wrapper.instance().getStore()
    // you can also just do...
    // wrapper.instance().carouselStore
    // I created this method to make it obvious that you have access to carouselStore.

  }, {
    key: 'getStore',
    value: function getStore() {
      return this.carouselStore;
    }
  }, {
    key: 'render',
    value: function render() {
      var Tag = this.props.tag;

      var filteredProps = index$9(this.props, Object.keys(CarouselProvider$$1.propTypes));
      var newClassName = cn(['carousel', this.props.className]);

      return React.createElement(
        Tag,
        _extends({ className: newClassName }, filteredProps),
        this.props.children
      );
    }
  }]);
  return CarouselProvider$$1;
}(React.Component), _class$3.propTypes = {
  children: CarouselPropTypes.children.isRequired,
  className: index$1.string,
  currentSlide: index$1.number,
  disableAnimation: index$1.bool,
  hasMasterSpinner: index$1.bool,
  naturalSlideHeight: index$1.number.isRequired,
  naturalSlideWidth: index$1.number.isRequired,
  orientation: CarouselPropTypes.orientation,
  step: index$1.number,
  tag: index$1.string,
  totalSlides: index$1.number.isRequired,
  touchEnabled: index$1.bool,
  visibleSlides: index$1.number
}, _class$3.defaultProps = {
  className: null,
  currentSlide: 0,
  disableAnimation: false,
  hasMasterSpinner: false,
  orientation: 'horizontal',
  step: 1,
  tag: 'div',
  touchEnabled: true,
  visibleSlides: 1
}, _class$3.childContextTypes = {
  carouselStore: index$1.object
}, _temp$3);

var s$4 = { "dot": "_dot_27k82_1" };

var _class$4;
var _temp$4;

var Dot$1 = (_temp$4 = _class$4 = function (_React$Component) {
  inherits(Dot, _React$Component);

  function Dot(props) {
    classCallCheck(this, Dot);

    var _this = possibleConstructorReturn(this, (Dot.__proto__ || Object.getPrototypeOf(Dot)).call(this, props));

    _this.handleOnClick = _this.handleOnClick.bind(_this);
    return _this;
  }

  createClass(Dot, [{
    key: 'handleOnClick',
    value: function handleOnClick(ev) {
      var _props = this.props,
          carouselStore = _props.carouselStore,
          onClick = _props.onClick,
          slide = _props.slide,
          totalSlides = _props.totalSlides,
          visibleSlides = _props.visibleSlides;

      var newSlide = slide >= totalSlides - visibleSlides ? totalSlides - visibleSlides : slide;

      carouselStore.setStoreState({
        currentSlide: newSlide
      }, onClick !== null && onClick.call(this, ev));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          carouselStore = _props2.carouselStore,
          children = _props2.children,
          className = _props2.className,
          currentSlide = _props2.currentSlide,
          disabled = _props2.disabled,
          onClick = _props2.onClick,
          selected = _props2.selected,
          slide = _props2.slide,
          totalSlides = _props2.totalSlides,
          visibleSlides = _props2.visibleSlides,
          props = objectWithoutProperties(_props2, ['carouselStore', 'children', 'className', 'currentSlide', 'disabled', 'onClick', 'selected', 'slide', 'totalSlides', 'visibleSlides']);

      var defaultSelected = slide >= currentSlide && slide < currentSlide + visibleSlides;
      var newSelected = typeof selected === 'boolean' ? selected : defaultSelected;
      var defaultDisabled = defaultSelected === true;
      var newDisabled = typeof disabled === 'boolean' ? disabled : defaultDisabled;

      var newClassName = cn([s$4.dot, newSelected && s$4.dotSelected, 'carousel__dot', 'carousel__dot--' + slide, newSelected && 'carousel__dot--selected', className]);

      return React.createElement(
        'button',
        _extends({
          onClick: this.handleOnClick,
          className: newClassName,
          disabled: newDisabled
        }, props),
        this.props.children
      );
    }
  }]);
  return Dot;
}(React.Component), _class$4.propTypes = {
  carouselStore: index$1.object.isRequired,
  children: CarouselPropTypes.children.isRequired,
  className: index$1.string,
  currentSlide: index$1.number.isRequired,
  disabled: index$1.bool,
  onClick: index$1.func,
  selected: index$1.bool,
  slide: index$1.number.isRequired,
  totalSlides: index$1.number.isRequired,
  visibleSlides: index$1.number.isRequired
}, _class$4.defaultProps = {
  className: null,
  disabled: null,
  onClick: null,
  selected: null
}, _temp$4);

var Dot = WithStore(Dot$1, function (state) {
  return {
    currentSlide: state.currentSlide,
    totalSlides: state.totalSlides,
    visibleSlides: state.visibleSlides
  };
});

var s$5 = {};

var _class$5;
var _temp$5;

var DotGroup$$1 = (_temp$5 = _class$5 = function (_React$Component) {
  inherits(DotGroup$$1, _React$Component);

  function DotGroup$$1() {
    classCallCheck(this, DotGroup$$1);
    return possibleConstructorReturn(this, (DotGroup$$1.__proto__ || Object.getPrototypeOf(DotGroup$$1)).apply(this, arguments));
  }

  createClass(DotGroup$$1, [{
    key: 'renderDots',
    value: function renderDots() {
      var _props = this.props,
          currentSlide = _props.currentSlide,
          totalSlides = _props.totalSlides,
          visibleSlides = _props.visibleSlides;

      var dots = [];
      for (var i = 0; i < totalSlides; i += 1) {
        var selected = i >= currentSlide && i < currentSlide + visibleSlides;
        var slide = i >= totalSlides - visibleSlides ? totalSlides - visibleSlides : i;
        dots.push(React.createElement(
          Dot,
          { key: i, slide: slide, selected: selected, disabled: selected },
          React.createElement(
            'span',
            { className: cn['carousel__dot-group-dot'] },
            this.props.dotNumbers && i + 1
          )
        ));
      }
      return dots;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          carouselStore = _props2.carouselStore,
          children = _props2.children,
          className = _props2.className,
          currentSlide = _props2.currentSlide,
          dotNumbers = _props2.dotNumbers,
          totalSlides = _props2.totalSlides,
          visibleSlides = _props2.visibleSlides,
          props = objectWithoutProperties(_props2, ['carouselStore', 'children', 'className', 'currentSlide', 'dotNumbers', 'totalSlides', 'visibleSlides']);


      var newClassName = cn([s$5.DotGroup, 'carousel__dot-group', className]);

      return React.createElement(
        'div',
        _extends({ className: newClassName }, props),
        this.renderDots(),
        children
      );
    }
  }]);
  return DotGroup$$1;
}(React.Component), _class$5.propTypes = {
  children: CarouselPropTypes.children,
  className: index$1.string,
  currentSlide: index$1.number.isRequired,
  carouselStore: index$1.object.isRequired,
  totalSlides: index$1.number.isRequired,
  visibleSlides: index$1.number.isRequired,
  dotNumbers: index$1.bool
}, _class$5.defaultProps = {
  children: null,
  className: null,
  dotNumbers: false
}, _temp$5);

var index$16 = WithStore(DotGroup$$1, function (state) {
  return {
    currentSlide: state.currentSlide,
    totalSlides: state.totalSlides,
    visibleSlides: state.visibleSlides
  };
});

var s$6 = { "image": "_image_u458c_1" };

var Image$1 = function (_React$Component) {
  inherits(Image, _React$Component);
  createClass(Image, null, [{
    key: 'subscribeMasterSpinner',
    value: function subscribeMasterSpinner(props) {
      if (props.hasMasterSpinner) {
        props.carouselStore.subscribeMasterSpinner(props.src);
      }
    }
  }, {
    key: 'unsubscribeMasterSpinner',
    value: function unsubscribeMasterSpinner(props) {
      if (props.hasMasterSpinner) {
        props.carouselStore.unsubscribeMasterSpinner(props.src);
      }
    }
  }]);

  function Image(props) {
    classCallCheck(this, Image);

    var _this = possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, props));

    _this.state = { imageStatus: LOADING };
    _this.handleImageLoad = _this.handleImageLoad.bind(_this);
    _this.handleImageError = _this.handleImageError.bind(_this);
    _this.image = null;
    return _this;
  }

  createClass(Image, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      Image.subscribeMasterSpinner(this.props);
      this.initImage();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.src !== this.props.src) {
        Image.unsubscribeMasterSpinner(this.props);
        Image.subscribeMasterSpinner(nextProps);
        this.initImage();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      Image.unsubscribeMasterSpinner(this.props);
      this.image.removeEventListener('load', this.handleImageLoad);
      this.image.removeEventListener('error', this.handleImageError);
      this.image = null;
    }
  }, {
    key: 'initImage',
    value: function initImage() {
      this.setState({ imageStatus: LOADING });
      this.image = document.createElement('img');

      // set event listeners first
      this.image.addEventListener('load', this.handleImageLoad, false);
      this.image.addEventListener('error', this.handleImageError, false);

      // setting img.src initiates the image load.
      this.image.src = this.props.src;

      // Was the image cached? force the image through the load process again.
      // NOTE: figure out a way to test this.  It might involve breaking initImage
      // up into some other methods.
      /* istanbul ignore if  */
      if (this.image.readyState || this.image.complete) {
        var src = this.image.src;
        this.image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        this.image.src = src;
      }
    }
  }, {
    key: 'handleImageLoad',
    value: function handleImageLoad(ev) {
      this.setState({ imageStatus: SUCCESS });
      if (this.props.hasMasterSpinner) this.props.carouselStore.masterSpinnerSuccess(this.props.src);
      if (this.props.onLoad) this.props.onLoad(ev);
    }
  }, {
    key: 'handleImageError',
    value: function handleImageError(ev) {
      this.setState({ imageStatus: ERROR });
      if (this.props.hasMasterSpinner) this.props.carouselStore.masterSpinnerError(this.props.src);
      if (this.props.onError) this.props.onError(ev);
    }
  }, {
    key: 'tempTag',
    value: function tempTag() {
      return this.props.tag === 'img' ? 'div' : this.props.tag;
    }
  }, {
    key: 'customRender',
    value: function customRender(propName) {
      if (typeof this.props[propName] === 'function') return this.props[propName]();
      return this.props.children;
    }
  }, {
    key: 'renderLoading',
    value: function renderLoading(filteredProps) {
      var Tag = this.tempTag();

      var newClassName = cn([s$6.image, s$6.imageLoading, 'carousel__image', this.props.isBgImage && 'carousel__image--with-background', 'carousel__image--loading', this.props.className]);

      return React.createElement(
        Tag,
        _extends({ className: newClassName }, filteredProps),
        this.customRender('renderLoading')
      );
    }
  }, {
    key: 'renderError',
    value: function renderError(filteredProps) {
      var Tag = this.tempTag();

      var newClassName = cn([s$6.image, s$6.imageError, 'carousel__image', this.props.isBgImage && 'carousel__image--with-background', 'carousel__image--error', this.props.className]);

      return React.createElement(
        Tag,
        _extends({ className: newClassName }, filteredProps),
        this.customRender('renderError')
      );
    }
  }, {
    key: 'renderSuccess',
    value: function renderSuccess(filteredProps) {
      var _props = this.props,
          style = _props.style,
          Tag = _props.tag;

      var newClassName = cn([s$6.image, 'carousel__image', this.props.isBgImage && 'carousel__image--with-background', 'carousel__image--success', this.props.className]);

      var newStyle = _extends({}, style);

      var newFilteredProps = filteredProps;

      if (Tag !== 'img') {
        var src = filteredProps.src,
            alt = filteredProps.alt,
            tempFilteredProps = objectWithoutProperties(filteredProps, ['src', 'alt']);

        newFilteredProps = tempFilteredProps;
        newStyle = _extends({}, style, {
          backgroundImage: 'url("' + src + '")',
          backgroundSize: 'cover'
        });
      }

      return React.createElement(
        Tag,
        _extends({ className: newClassName, style: newStyle }, newFilteredProps),
        this.props.children
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          carouselStore = _props2.carouselStore,
          children = _props2.children,
          className = _props2.className,
          hasMasterSpinner = _props2.hasMasterSpinner,
          isBgImage = _props2.isBgImage,
          onError = _props2.onError,
          onLoad = _props2.onLoad,
          renderError = _props2.renderError,
          renderLoading = _props2.renderLoading,
          style = _props2.style,
          tag = _props2.tag,
          filteredProps = objectWithoutProperties(_props2, ['carouselStore', 'children', 'className', 'hasMasterSpinner', 'isBgImage', 'onError', 'onLoad', 'renderError', 'renderLoading', 'style', 'tag']);


      switch (this.state.imageStatus) {
        case LOADING:
          return this.renderLoading(filteredProps);
        case SUCCESS:
          return this.renderSuccess(filteredProps);
        case ERROR:
          return this.renderError(filteredProps);
        default:
          throw new Error('unknown value for this.state.imageStatus');
      }
    }
  }]);
  return Image;
}(React.Component);

Image$1.propTypes = {
  alt: index$1.string,
  carouselStore: index$1.object.isRequired,
  children: CarouselPropTypes.children,
  className: index$1.string,
  hasMasterSpinner: index$1.bool.isRequired,
  isBgImage: CarouselPropTypes.isBgImage,
  onError: index$1.func,
  onLoad: index$1.func,
  renderError: index$1.func,
  renderLoading: index$1.func,
  src: index$1.string.isRequired,
  style: index$1.object,
  tag: index$1.string
};
Image$1.defaultProps = {
  alt: '',
  children: null,
  className: null,
  height: null,
  isBgImage: false,
  onError: null,
  onLoad: null,
  renderError: null,
  renderLoading: null,
  style: null,
  tag: 'img'
};

var Image = WithStore(Image$1, function (state) {
  return {
    hasMasterSpinner: state.hasMasterSpinner,
    orientation: state.orientation
  };
});

var s$7 = { "container": "_container_11gb8_1", "overlay": "_overlay_11gb8_8", "hover": "_hover_11gb8_19", "loading": "_loading_11gb8_24", "imageLoadingSpinnerContainer": "_imageLoadingSpinnerContainer_11gb8_28" };

var _class$6;
var _temp$6;

var ImageWithZoom$1 = (_temp$6 = _class$6 = function (_React$Component) {
  inherits(ImageWithZoom$$1, _React$Component);

  function ImageWithZoom$$1() {
    classCallCheck(this, ImageWithZoom$$1);

    var _this = possibleConstructorReturn(this, (ImageWithZoom$$1.__proto__ || Object.getPrototypeOf(ImageWithZoom$$1)).call(this));

    _this.state = {
      isImageLoading: true,
      hovering: false,
      style: {},
      x: null,
      y: null
    };
    _this.handleOnMouseOver = _this.handleOnMouseOver.bind(_this);
    _this.handleOnMouseOut = _this.handleOnMouseOut.bind(_this);
    _this.handleOnMouseMove = _this.handleOnMouseMove.bind(_this);
    _this.handleImageComplete = _this.handleImageComplete.bind(_this);
    return _this;
  }

  createClass(ImageWithZoom$$1, [{
    key: 'handleImageComplete',
    value: function handleImageComplete() {
      this.setState({
        isImageLoading: false
      });
    }
  }, {
    key: 'handleOnMouseOver',
    value: function handleOnMouseOver() {
      this.setState({
        hovering: true
      });
    }
  }, {
    key: 'handleOnMouseOut',
    value: function handleOnMouseOut() {
      this.setState({
        hovering: false
      });
    }
  }, {
    key: 'handleOnMouseMove',
    value: function handleOnMouseMove(ev) {
      var x = ev.nativeEvent.offsetX / ev.target.offsetWidth * 100;
      var y = ev.nativeEvent.offsetY / ev.target.offsetHeight * 100;
      this.setState({ x: x, y: y });
    }
  }, {
    key: 'renderLoading',
    value: function renderLoading() {
      if (this.state.isImageLoading) {
        return React.createElement(
          'div',
          {
            className: cn([s$7.imageLoadingSpinnerContainer, 'carousel__image-loading-spinner-container'])
          },
          React.createElement(Spinner$1, null)
        );
      }

      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          Tag = _props.tag,
          src = _props.src,
          filteredProps = objectWithoutProperties(_props, ['tag', 'src']);


      var imageClassName = cn([s$7.image, 'carousel__zoom-image']);

      var overlayClassName = cn([s$7.overlay, 'carousel__zoom-image-overlay', this.state.hovering && s$7.hover, this.state.hovering && 'carousel__zoom-image-overlay--hovering']);

      var overlayStyle = {};
      overlayStyle.transformOrigin = this.state.x + '% ' + this.state.y + '%';

      return React.createElement(
        Tag,
        _extends({ className: s$7.container }, filteredProps),
        React.createElement(Image, {
          className: imageClassName,
          tag: 'div',
          src: src,
          isBgImage: true,
          onLoad: this.handleImageComplete,
          onError: this.handleImageComplete
        }),
        React.createElement(Image, {
          className: overlayClassName,
          tag: 'div',
          src: src,
          style: overlayStyle,
          isBgImage: true,
          onMouseOver: this.handleOnMouseOver,
          onMouseOut: this.handleOnMouseOut,
          onMouseMove: this.handleOnMouseMove
        }),
        this.renderLoading()
      );
    }
  }]);
  return ImageWithZoom$$1;
}(React.Component), _class$6.propTypes = {
  // alt: PropTypes.string,
  src: index$1.string.isRequired,
  tag: index$1.string
}, _class$6.defaultProps = {
  tag: 'div'
}, _temp$6);

var s$8 = { "slideInner": "_slideInner_fhwgk_1", "slideHorizontal": "_slideHorizontal_fhwgk_1", "slide": "_slide_fhwgk_1", "focusRing": "_focusRing_fhwgk_26" };

var _class$7;
var _temp$7;

var Slide = (_temp$7 = _class$7 = function (_React$PureComponent) {
  inherits(Slide, _React$PureComponent);

  function Slide(props) {
    classCallCheck(this, Slide);

    var _this = possibleConstructorReturn(this, (Slide.__proto__ || Object.getPrototypeOf(Slide)).call(this, props));

    _this.handleOnFocus = _this.handleOnFocus.bind(_this);
    _this.handleOnBlur = _this.handleOnBlur.bind(_this);
    _this.state = {
      focused: false
    };
    return _this;
  }

  createClass(Slide, [{
    key: 'isVisible',
    value: function isVisible() {
      var _props = this.props,
          currentSlide = _props.currentSlide,
          index = _props.index,
          visibleSlides = _props.visibleSlides;

      return index >= currentSlide && index < currentSlide + visibleSlides;
    }
  }, {
    key: 'handleOnFocus',
    value: function handleOnFocus(ev) {
      var onFocus = this.props.onFocus;

      this.setState({
        focused: true
      }, onFocus !== null && onFocus.call(this, ev));
    }
  }, {
    key: 'handleOnBlur',
    value: function handleOnBlur(ev) {
      var onBlur = this.props.onBlur;

      this.setState({
        focused: false
      }, onBlur !== null && onBlur.call(this, ev));
    }
  }, {
    key: 'renderFocusRing',
    value: function renderFocusRing() {
      if (this.state.focused) return React.createElement('div', { className: [s$8.focusRing, 'carousel__slide-focus-ring'].join(' ') });
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          carouselStore = _props2.carouselStore,
          children = _props2.children,
          className = _props2.className,
          currentSlide = _props2.currentSlide,
          index = _props2.index,
          innerClassName = _props2.innerClassName,
          InnerTag = _props2.innerTag,
          naturalSlideHeight = _props2.naturalSlideHeight,
          naturalSlideWidth = _props2.naturalSlideWidth,
          onBlur = _props2.onBlur,
          onFocus = _props2.onFocus,
          orientation = _props2.orientation,
          slideSize$$1 = _props2.slideSize,
          style = _props2.style,
          tabIndex = _props2.tabIndex,
          Tag = _props2.tag,
          totalSlides = _props2.totalSlides,
          visibleSlides = _props2.visibleSlides,
          props = objectWithoutProperties(_props2, ['carouselStore', 'children', 'className', 'currentSlide', 'index', 'innerClassName', 'innerTag', 'naturalSlideHeight', 'naturalSlideWidth', 'onBlur', 'onFocus', 'orientation', 'slideSize', 'style', 'tabIndex', 'tag', 'totalSlides', 'visibleSlides']);


      var tempStyle = {};

      if (orientation === 'horizontal') {
        tempStyle.width = pct(slideSize$$1);
        tempStyle.paddingBottom = pct(naturalSlideHeight * 100 / (naturalSlideWidth * totalSlides));
      } else {
        tempStyle.width = pct(100);
        tempStyle.paddingBottom = pct(naturalSlideHeight * 100 / naturalSlideWidth);
      }

      var newStyle = _extends({}, tempStyle, style);

      var newClassName = cn([s$8.slide, orientation === 'horizontal' && s$8.slideHorizontal, 'carousel__slide', this.state.focused && 'carousel__slide--focused', className]);

      var newInnerClassName = cn([s$8.slideInner, 'carousel__inner-slide', innerClassName]);

      var defaultTabIndex = this.isVisible() ? 0 : -1;
      var newTabIndex = typeof tabIndex === 'number' ? tabIndex : defaultTabIndex;

      return React.createElement(
        Tag,
        _extends({
          ref: function ref(el) {
            _this2.tagRef = el;
          },
          tabIndex: newTabIndex,
          'aria-hidden': !this.isVisible(),
          onFocus: this.handleOnFocus,
          onBlur: this.handleOnBlur,
          className: newClassName,
          style: newStyle
        }, props),
        React.createElement(
          InnerTag,
          {
            ref: function ref(el) {
              _this2.innerTagRef = el;
            },
            className: newInnerClassName
          },
          this.props.children,
          this.renderFocusRing()
        )
      );
    }
  }]);
  return Slide;
}(React.PureComponent), _class$7.propTypes = {
  carouselStore: index$1.object,
  children: CarouselPropTypes.children,
  className: index$1.string,
  currentSlide: index$1.number.isRequired,
  index: index$1.number.isRequired,
  innerClassName: index$1.string,
  innerTag: index$1.string,
  naturalSlideHeight: index$1.number.isRequired,
  naturalSlideWidth: index$1.number.isRequired,
  onBlur: index$1.func,
  onFocus: index$1.func,
  orientation: CarouselPropTypes.orientation.isRequired,
  slideSize: index$1.number.isRequired,
  style: index$1.object,
  tabIndex: index$1.number,
  tag: index$1.string,
  totalSlides: index$1.number.isRequired,
  visibleSlides: index$1.number.isRequired
}, _class$7.defaultProps = {
  carouselStore: null,
  children: null,
  className: null,
  innerClassName: null,
  innerTag: 'div',
  onBlur: null,
  onFocus: null,
  style: {},
  tabIndex: null,
  tag: 'li'
}, _temp$7);

var index$17 = WithStore(Slide, function (state) {
  return {
    currentSlide: state.currentSlide,
    naturalSlideHeight: state.naturalSlideHeight,
    naturalSlideWidth: state.naturalSlideWidth,
    orientation: state.orientation,
    slideSize: state.slideSize,
    totalSlides: state.totalSlides,
    visibleSlides: state.visibleSlides
  };
});

var s$9 = { "horizontalSlider": "_horizontalSlider_al8x6_1", "horizontalSliderTray": "_horizontalSliderTray_al8x6_1", "verticalSlider": "_verticalSlider_al8x6_11", "verticalSliderTray": "_verticalSliderTray_al8x6_1", "verticalTray": "_verticalTray_al8x6_20", "verticalSlideTrayWrap": "_verticalSlideTrayWrap_al8x6_24", "sliderTray": "_sliderTray_al8x6_28", "masterSpinnerContainer": "_masterSpinnerContainer_al8x6_37" };

var _class$8;
var _temp$8;

var Slider$$1 = (_temp$8 = _class$8 = function (_React$Component) {
  inherits(Slider$$1, _React$Component);
  createClass(Slider$$1, null, [{
    key: 'slideSizeInPx',
    value: function slideSizeInPx(orientation, sliderTrayWidth, sliderTrayHeight, totalSlides) {
      return (orientation === 'horizontal' ? sliderTrayWidth : sliderTrayHeight) / totalSlides;
    }
  }, {
    key: 'slidesMoved',
    value: function slidesMoved(orientation, deltaX, deltaY, slideSizeInPx) {
      var threshold = 0.1;
      var bigDrag = Math.abs(Math.round((orientation === 'horizontal' ? deltaX : deltaY) / slideSizeInPx));
      var smallDrag = Math.abs(orientation === 'horizontal' ? deltaX : deltaY) >= slideSizeInPx * threshold ? 1 : 0;
      if ((orientation === 'horizontal' ? deltaX : deltaY) < 0) {
        return Math.max(smallDrag, bigDrag);
      }
      return -Math.max(bigDrag, smallDrag);
    }
  }]);

  function Slider$$1() {
    classCallCheck(this, Slider$$1);

    var _this = possibleConstructorReturn(this, (Slider$$1.__proto__ || Object.getPrototypeOf(Slider$$1)).call(this));

    _this.handleOnKeyDown = _this.handleOnKeyDown.bind(_this);
    _this.handleOnTouchCancel = _this.handleOnTouchCancel.bind(_this);
    _this.handleOnTouchEnd = _this.handleOnTouchEnd.bind(_this);
    _this.handleOnTouchMove = _this.handleOnTouchMove.bind(_this);
    _this.handleOnTouchStart = _this.handleOnTouchStart.bind(_this);

    _this.state = {
      deltaX: 0,
      deltaY: 0,
      startX: 0,
      startY: 0,
      isBeingTouchDragged: false
    };

    _this.originalOverflow = null;
    _this.moveTimer = null;
    return _this;
  }

  createClass(Slider$$1, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.cancelAnimationFrame.call(window, this.moveTimer);
      this.moveTimer = null;
    }
  }, {
    key: 'handleOnTouchStart',
    value: function handleOnTouchStart(ev) {
      if (!this.props.touchEnabled) return;

      window.cancelAnimationFrame.call(window, this.moveTimer);

      var touch = ev.targetTouches[0];
      if (this.props.orientation === 'vertical') {
        this.originalOverflow = this.originalOverflow || document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        ev.preventDefault();
        ev.stopPropagation();
      }
      this.setState({
        isBeingTouchDragged: true,
        startX: touch.screenX,
        startY: touch.screenY
      });
    }
  }, {
    key: 'handleOnTouchMove',
    value: function handleOnTouchMove(ev) {
      var _this2 = this;

      if (!this.props.touchEnabled) return;

      window.cancelAnimationFrame.call(window, this.moveTimer);

      var touch = ev.targetTouches[0];
      this.moveTimer = window.requestAnimationFrame.call(window, function () {
        _this2.setState({
          deltaX: touch.screenX - _this2.state.startX,
          deltaY: touch.screenY - _this2.state.startY
        });
      });
    }
  }, {
    key: 'handleOnKeyDown',
    value: function handleOnKeyDown(ev) {
      var keyCode = ev.keyCode;
      var _props = this.props,
          carouselStore = _props.carouselStore,
          currentSlide = _props.currentSlide,
          totalSlides = _props.totalSlides,
          visibleSlides = _props.visibleSlides;

      var newStoreState = {};
      var isUpdated = false;

      if (totalSlides <= visibleSlides) return;

      // left arrow
      if (keyCode === 37) {
        ev.preventDefault();
        ev.stopPropagation();
        this.focus();
        if (currentSlide > 0) {
          newStoreState.currentSlide = currentSlide - 1;
          isUpdated = true;
        }
      }

      // right arrow
      if (keyCode === 39) {
        ev.preventDefault();
        ev.stopPropagation();
        this.focus();
        if (currentSlide < totalSlides - visibleSlides) {
          newStoreState.currentSlide = currentSlide + 1;
          isUpdated = true;
        }
      }

      if (isUpdated && typeof newStoreState.currentSlide === 'number') {
        carouselStore.setStoreState(newStoreState);
      }
    }
  }, {
    key: 'computeCurrentSlide',
    value: function computeCurrentSlide() {
      var slideSizeInPx = Slider$$1.slideSizeInPx(this.props.orientation, this.sliderTrayElement.clientWidth, this.sliderTrayElement.clientHeight, this.props.totalSlides);

      var slidesMoved = Slider$$1.slidesMoved(this.props.orientation, this.state.deltaX, this.state.deltaY, slideSizeInPx);

      var maxSlide = this.props.totalSlides - Math.min(this.props.totalSlides, this.props.visibleSlides);

      var newCurrentSlide = this.props.currentSlide + slidesMoved;
      newCurrentSlide = Math.max(0, newCurrentSlide);
      newCurrentSlide = Math.min(maxSlide, newCurrentSlide);

      this.props.carouselStore.setStoreState({
        currentSlide: newCurrentSlide
      });
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.sliderElement.focus();
    }
  }, {
    key: 'handleOnTouchEnd',
    value: function handleOnTouchEnd() {
      this.endTouchMove();
    }
  }, {
    key: 'handleOnTouchCancel',
    value: function handleOnTouchCancel() {
      this.endTouchMove();
    }
  }, {
    key: 'endTouchMove',
    value: function endTouchMove() {
      if (!this.props.touchEnabled) return;

      window.cancelAnimationFrame.call(window, this.moveTimer);

      this.computeCurrentSlide();
      if (this.props.orientation === 'vertical') {
        document.documentElement.style.overflow = this.originalOverflow;
        this.originalOverflow = null;
      }

      this.setState({
        deltaX: 0,
        deltaY: 0,
        isBeingTouchDragged: false
      });
    }
  }, {
    key: 'renderMasterSpinner',
    value: function renderMasterSpinner() {
      var _props2 = this.props,
          hasMasterSpinner = _props2.hasMasterSpinner,
          masterSpinnerFinished = _props2.masterSpinnerFinished;


      if (hasMasterSpinner && !masterSpinnerFinished) {
        if (typeof this.props.onMasterSpinner === 'function') this.props.onMasterSpinner();

        return React.createElement(
          'div',
          {
            className: cn([s$9.masterSpinnerContainer, 'carousel__master-spinner-container'])
          },
          React.createElement(Spinner$1, null)
        );
      }

      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props3 = this.props,
          carouselStore = _props3.carouselStore,
          children = _props3.children,
          className = _props3.className,
          currentSlide = _props3.currentSlide,
          disableAnimation = _props3.disableAnimation,
          hasMasterSpinner = _props3.hasMasterSpinner,
          masterSpinnerFinished = _props3.masterSpinnerFinished,
          naturalSlideHeight = _props3.naturalSlideHeight,
          naturalSlideWidth = _props3.naturalSlideWidth,
          onMasterSpinner = _props3.onMasterSpinner,
          orientation = _props3.orientation,
          slideSize$$1 = _props3.slideSize,
          slideTraySize$$1 = _props3.slideTraySize,
          style = _props3.style,
          tabIndex = _props3.tabIndex,
          totalSlides = _props3.totalSlides,
          touchEnabled = _props3.touchEnabled,
          TrayTag = _props3.trayTag,
          visibleSlides = _props3.visibleSlides,
          props = objectWithoutProperties(_props3, ['carouselStore', 'children', 'className', 'currentSlide', 'disableAnimation', 'hasMasterSpinner', 'masterSpinnerFinished', 'naturalSlideHeight', 'naturalSlideWidth', 'onMasterSpinner', 'orientation', 'slideSize', 'slideTraySize', 'style', 'tabIndex', 'totalSlides', 'touchEnabled', 'trayTag', 'visibleSlides']);


      var sliderStyle = _extends({}, style);

      // slider tray wrap
      var trayWrapStyle = {};

      if (orientation === 'vertical') {
        trayWrapStyle.height = 0;
        trayWrapStyle.paddingBottom = pct(naturalSlideHeight * 100 * visibleSlides / naturalSlideWidth);
        trayWrapStyle.width = pct(100);
      }

      // slider tray
      var trayStyle = {};
      var trans = pct(slideSize$$1 * currentSlide * -1);

      if (this.state.isBeingTouchDragged || disableAnimation) {
        trayStyle.transition = 'none';
      }

      if (orientation === 'vertical') {
        trayStyle.transform = 'translateY(' + trans + ') translateY(' + this.state.deltaY + 'px)';
        trayStyle.width = pct(100);
      } else {
        trayStyle.width = pct(slideTraySize$$1);
        trayStyle.transform = 'translateX(' + trans + ') translateX(' + this.state.deltaX + 'px)';
      }

      var sliderClasses = cn([orientation === 'vertical' ? s$9.verticalSlider : s$9.horizontalSlider, 'carousel__slider', orientation === 'vertical' ? 'carousel__slider--vertical' : 'carousel__slider--horizontal', className]);

      var trayWrapClasses = cn([s$9.sliderTrayWrap, 'carousel__slider-tray-wrapper', orientation === 'vertical' ? s$9.verticalSlideTrayWrap : s$9.horizontalTrayWrap, orientation === 'vertical' ? 'carousel__slider-tray-wrap--vertical' : 'carousel__slider-tray-wrap--horizontal']);

      var trayClasses = cn([s$9.sliderTray, 'carousel__slider-tray', orientation === 'vertical' ? s$9.verticalTray : s$9.horizontalTray, orientation === 'vertical' ? 'carousel__slider-tray--vertical' : 'carousel__slider-tray--horizontal']);

      var newTabIndex = tabIndex !== null ? tabIndex : 0;

      // console.log(Object.assign({}, trayStyle), new Date());

      return React.createElement(
        'div',
        _extends({
          ref: function ref(el) {
            _this3.sliderElement = el;
          },
          className: sliderClasses,
          'aria-live': 'polite',
          style: sliderStyle,
          tabIndex: newTabIndex,
          onKeyDown: this.handleOnKeyDown,
          role: 'listbox'
        }, props),
        React.createElement(
          'div',
          { className: trayWrapClasses, style: trayWrapStyle },
          React.createElement(
            TrayTag,
            {
              ref: function ref(el) {
                _this3.sliderTrayElement = el;
              },
              className: trayClasses,
              style: trayStyle,
              onTouchStart: this.handleOnTouchStart,
              onTouchMove: this.handleOnTouchMove,
              onTouchEnd: this.handleOnTouchEnd,
              onTouchCancel: this.handleOnTouchCancel
            },
            children
          ),
          this.renderMasterSpinner()
        )
      );
    }
  }]);
  return Slider$$1;
}(React.Component), _class$8.propTypes = {
  carouselStore: index$1.object.isRequired,
  children: index$1.node.isRequired,
  className: index$1.string,
  currentSlide: index$1.number.isRequired,
  disableAnimation: index$1.bool,
  hasMasterSpinner: index$1.bool.isRequired,
  masterSpinnerFinished: index$1.bool.isRequired,
  naturalSlideHeight: index$1.number.isRequired,
  naturalSlideWidth: index$1.number.isRequired,
  onMasterSpinner: index$1.func,
  orientation: CarouselPropTypes.orientation.isRequired,
  slideSize: index$1.number.isRequired,
  slideTraySize: index$1.number.isRequired,
  style: index$1.object,
  tabIndex: index$1.number,
  totalSlides: index$1.number.isRequired,
  touchEnabled: index$1.bool.isRequired,
  trayTag: index$1.string,
  visibleSlides: index$1.number
}, _class$8.defaultProps = {
  className: '',
  disableAnimation: false,
  height: null,
  onMasterSpinner: null,
  style: {},
  tabIndex: null,
  trayTag: 'ul',
  visibleSlides: 1
}, _temp$8);

var index$18 = WithStore(Slider$$1, function (state) {
  return {
    currentSlide: state.currentSlide,
    hasMasterSpinner: state.hasMasterSpinner,
    masterSpinnerFinished: state.masterSpinnerFinished,
    naturalSlideHeight: state.naturalSlideHeight,
    naturalSlideWidth: state.naturalSlideWidth,
    disableAnimation: state.disableAnimation,
    orientation: state.orientation,
    slideSize: state.slideSize,
    slideTraySize: state.slideTraySize,
    totalSlides: state.totalSlides,
    touchEnabled: state.touchEnabled,
    visibleSlides: state.visibleSlides
  };
});

var s$10 = { "spinner": "_spinner_1dguc_1", "spin": "_spin_1dguc_1" };

var _class$9;
var _temp$9;

var Spinner$1 = (_temp$9 = _class$9 = function (_React$PureComponent) {
  inherits(Spinner, _React$PureComponent);

  function Spinner() {
    classCallCheck(this, Spinner);
    return possibleConstructorReturn(this, (Spinner.__proto__ || Object.getPrototypeOf(Spinner)).apply(this, arguments));
  }

  createClass(Spinner, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          filteredProps = objectWithoutProperties(_props, ['className']);

      var newClassName = cn([s$10.spinner, 'carousel__spinner', className]);
      return React.createElement('div', _extends({ className: newClassName }, filteredProps));
    }
  }]);
  return Spinner;
}(React.PureComponent), _class$9.propTypes = {
  className: index$1.string
}, _class$9.defaultProps = {
  className: null
}, _temp$9);

var index$19 = function deepFreeze (o) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (o.hasOwnProperty(prop)
    && o[prop] !== null
    && (typeof o[prop] === "object" || typeof o[prop] === "function")
    && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });
  
  return o;
};

var DEFAULT_STATE = {
  masterSpinnerFinished: false
};

var Store = function () {
  function Store(initialState) {
    classCallCheck(this, Store);

    this.state = index$19(cjs(DEFAULT_STATE, initialState));
    this.subscriptions = [];
    this.masterSpinnerSubscriptions = {};
    this.setStoreState = this.setStoreState.bind(this);
    this.getStoreState = this.getStoreState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.subscribeMasterSpinner = this.subscribeMasterSpinner.bind(this);
    this.unsubscribeMasterSpinner = this.unsubscribeMasterSpinner.bind(this);
    this.unsubscribeAllMasterSpinner = this.unsubscribeAllMasterSpinner.bind(this);
    this.masterSpinnerSuccess = this.masterSpinnerSuccess.bind(this);
    this.masterSpinnerError = this.masterSpinnerError.bind(this);
  }

  createClass(Store, [{
    key: 'setStoreState',
    value: function setStoreState(newState, cb) {
      this.state = index$19(cjs(this.state, newState));
      this.updateSubscribers(cb);
    }
  }, {
    key: 'getStoreState',
    value: function getStoreState() {
      return cjs({}, this.state);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(func) {
      this.subscriptions.push(func);
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(func) {
      var index = this.subscriptions.indexOf(func);
      if (index !== -1) this.subscriptions.splice(index, 1);
    }
  }, {
    key: 'updateSubscribers',
    value: function updateSubscribers(cb) {
      this.subscriptions.forEach(function (func) {
        return func();
      });
      if (typeof cb === 'function') cb(this.getStoreState());
    }
  }, {
    key: 'subscribeMasterSpinner',
    value: function subscribeMasterSpinner(src) {
      var index = Object.keys(this.masterSpinnerSubscriptions).indexOf(src);
      if (index === -1) {
        this.masterSpinnerSubscriptions[src] = {
          success: false,
          error: false,
          complete: false
        };
      }
    }
  }, {
    key: 'unsubscribeMasterSpinner',
    value: function unsubscribeMasterSpinner(src) {
      var index = Object.keys(this.masterSpinnerSubscriptions).indexOf(src);
      if (index === -1) {
        return false;
      }
      this.setMasterSpinnerFinished();
      return delete this.masterSpinnerSubscriptions[src];
    }
  }, {
    key: 'unsubscribeAllMasterSpinner',
    value: function unsubscribeAllMasterSpinner() {
      this.masterSpinnerSubscriptions = {};
      this.setMasterSpinnerFinished();
    }
  }, {
    key: 'masterSpinnerSuccess',
    value: function masterSpinnerSuccess(src) {
      this.masterSpinnerSubscriptions[src].success = true;
      this.masterSpinnerSubscriptions[src].complete = true;
      this.setMasterSpinnerFinished();
    }
  }, {
    key: 'masterSpinnerError',
    value: function masterSpinnerError(src) {
      this.masterSpinnerSubscriptions[src].error = true;
      this.masterSpinnerSubscriptions[src].complete = true;
      this.setMasterSpinnerFinished();
    }
  }, {
    key: 'setMasterSpinnerFinished',
    value: function setMasterSpinnerFinished() {
      this.setStoreState({
        masterSpinnerFinished: this.isMasterSpinnerFinished()
      });
    }
  }, {
    key: 'isMasterSpinnerFinished',
    value: function isMasterSpinnerFinished() {
      var _this = this;

      // console.log('MASTER SPINNER SUBSCRIPTIONS', this.masterSpinnerSubscriptions);
      return !Object.keys(this.masterSpinnerSubscriptions).find(function (src) {
        return _this.masterSpinnerSubscriptions[src].complete !== true;
      });
    }
  }]);
  return Store;
}();

export { index as ButtonBack, index$6 as ButtonFirst, index$7 as ButtonNext, index$8 as ButtonLast, CarouselProvider$1 as CarouselProvider, Dot, index$16 as DotGroup, Image, ImageWithZoom$1 as ImageWithZoom, index$17 as Slide, index$18 as Slider, Spinner$1 as Spinner, Store };
//# sourceMappingURL=index.es.js.map
