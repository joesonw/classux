(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Classux"] = factory();
	else
		root["Classux"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	exports.Reducer = Reducer;
	exports.Inject = Inject;
	
	
	var UPDATER = Symbol();
	var DISPOSER = Symbol();
	
	var STATE = Symbol();
	var LISTENERS = Symbol();
	var REDUCERS = Symbol();
	var DEFAULT_STATE = Symbol();
	var MIDDLEWARES = Symbol();
	
	var NOTIFY = Symbol();
	
	var Store = function () {
	    function Store(defaultState) {
	        var _this = this;
	
	        _classCallCheck(this, Store);
	
	        this[DEFAULT_STATE] = defaultState;
	        this[STATE] = defaultState;
	        this[LISTENERS] = [];
	        this[MIDDLEWARES] = this[MIDDLEWARES] || [];
	        this[REDUCERS] = this[REDUCERS] || {};
	        this[NOTIFY] = function (action) {
	            for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                params[_key - 1] = arguments[_key];
	            }
	
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = _this[LISTENERS][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var listener = _step.value;
	
	                    listener.apply(undefined, [_this[STATE], action].concat(params));
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        };
	    }
	
	    _createClass(Store, [{
	        key: 'subscribe',
	        value: function subscribe(listener) {
	            var _this2 = this;
	
	            var index = this[LISTENERS].push(listener) - 1;
	            return function () {
	                _this2[LISTENERS].splice(index, 1);
	            };
	        }
	    }, {
	        key: 'dispatch',
	        value: function dispatch(action) {
	            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                params[_key2 - 1] = arguments[_key2];
	            }
	
	            var dispatch = function () {
	                var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_state) {
	                    var reducer, state;
	                    return regeneratorRuntime.wrap(function _callee$(_context) {
	                        while (1) {
	                            switch (_context.prev = _context.next) {
	                                case 0:
	                                    reducer = self[self[REDUCERS][action]];
	
	                                    if (!reducer) {
	                                        _context.next = 11;
	                                        break;
	                                    }
	
	                                    if (_state) {
	                                        self[STATE] = _state;
	                                    }
	                                    state = reducer.call.apply(reducer, [self].concat(params));
	
	                                    if (!(state instanceof Promise)) {
	                                        _context.next = 10;
	                                        break;
	                                    }
	
	                                    _context.next = 7;
	                                    return state;
	
	                                case 7:
	                                    return _context.abrupt('return', _context.sent);
	
	                                case 10:
	                                    return _context.abrupt('return', state);
	
	                                case 11:
	                                case 'end':
	                                    return _context.stop();
	                            }
	                        }
	                    }, _callee, this);
	                }));
	
	                return function dispatch(_x) {
	                    return _ref.apply(this, arguments);
	                };
	            }();
	
	            var run = function () {
	                var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(next) {
	                    var _this3 = this;
	
	                    var i;
	                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
	                        while (1) {
	                            switch (_context3.prev = _context3.next) {
	                                case 0:
	                                    i = middlewares.length;
	
	                                    while (i--) {
	                                        next = function (middleware, next) {
	                                            return function () {
	                                                var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_state) {
	                                                    var state;
	                                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	                                                        while (1) {
	                                                            switch (_context2.prev = _context2.next) {
	                                                                case 0:
	                                                                    state = _state || self.getState();
	                                                                    _context2.next = 3;
	                                                                    return middleware.apply(undefined, [next, state, action].concat(params));
	
	                                                                case 3:
	                                                                    return _context2.abrupt('return', _context2.sent);
	
	                                                                case 4:
	                                                                case 'end':
	                                                                    return _context2.stop();
	                                                            }
	                                                        }
	                                                    }, _callee2, _this3);
	                                                }));
	
	                                                return function (_x3) {
	                                                    return _ref3.apply(this, arguments);
	                                                };
	                                            }();
	                                        }(middlewares[i], next);
	                                    }
	                                    _context3.next = 4;
	                                    return next();
	
	                                case 4:
	                                    return _context3.abrupt('return', _context3.sent);
	
	                                case 5:
	                                case 'end':
	                                    return _context3.stop();
	                            }
	                        }
	                    }, _callee3, this);
	                }));
	
	                return function run(_x2) {
	                    return _ref2.apply(this, arguments);
	                };
	            }();
	
	            var self = this;
	            ;
	            var middlewares = this[MIDDLEWARES];
	
	            run(dispatch).then(function (state) {
	                self[STATE] = state;
	                self[NOTIFY](action, params);
	            }).catch(function (e) {
	                console.log(e.stack || e);
	            });
	        }
	    }, {
	        key: 'getState',
	        value: function getState() {
	            return this[STATE];
	        }
	    }, {
	        key: 'onUpdate',
	        value: function onUpdate() {
	            for (var _len3 = arguments.length, actions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	                actions[_key3] = arguments[_key3];
	            }
	
	            var self = this;
	            return function (prototype, key) {
	                if (!Array.isArray(prototype[UPDATER])) {
	                    (function () {
	                        prototype[UPDATER] = [];
	                        var componentDidMount = prototype.componentDidMount;
	                        var componentWillUnmount = prototype.componentWillUnmount;
	
	                        prototype.componentDidMount = function () {
	                            var _this4 = this;
	
	                            this[DISPOSER] = [];
	                            var _iteratorNormalCompletion2 = true;
	                            var _didIteratorError2 = false;
	                            var _iteratorError2 = undefined;
	
	                            try {
	                                for (var _iterator2 = this[UPDATER][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                                    var item = _step2.value;
	
	                                    this[DISPOSER].push(item.store.subscribe(function (method, actions) {
	                                        return function (state, action) {
	                                            if (actions.length === 0) {
	                                                _this4[method](state, action);
	                                            } else {
	                                                if (actions.indexOf(action) !== -1) {
	                                                    _this4[method](state, action);
	                                                }
	                                            }
	                                        };
	                                    }(item.method, item.actions)));
	                                }
	                            } catch (err) {
	                                _didIteratorError2 = true;
	                                _iteratorError2 = err;
	                            } finally {
	                                try {
	                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                                        _iterator2.return();
	                                    }
	                                } finally {
	                                    if (_didIteratorError2) {
	                                        throw _iteratorError2;
	                                    }
	                                }
	                            }
	
	                            if (componentDidMount) {
	                                componentDidMount.call(this);
	                            }
	                        };
	
	                        prototype.componentWillUnmount = function () {
	                            var _iteratorNormalCompletion3 = true;
	                            var _didIteratorError3 = false;
	                            var _iteratorError3 = undefined;
	
	                            try {
	                                for (var _iterator3 = this[DISPOSER][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                                    var disposer = _step3.value;
	
	                                    disposer();
	                                }
	                            } catch (err) {
	                                _didIteratorError3 = true;
	                                _iteratorError3 = err;
	                            } finally {
	                                try {
	                                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                                        _iterator3.return();
	                                    }
	                                } finally {
	                                    if (_didIteratorError3) {
	                                        throw _iteratorError3;
	                                    }
	                                }
	                            }
	
	                            if (componentWillUnmount) {
	                                componentWillUnmount.call(this);
	                            }
	                        };
	                    })();
	                }
	
	                prototype[UPDATER].push({
	                    method: key,
	                    actions: actions,
	                    store: self
	                });
	            };
	        }
	    }, {
	        key: 'connect',
	        value: function connect(schema, source) {
	            var self = this;
	            return function (obj) {
	                var METHOD = Symbol();
	                obj.prototype[METHOD] = function (state) {
	                    var s = {};
	                    if (typeof schema === 'string' && typeof source === 'string') {
	                        s[schema] = state[source];
	                    } else if (typeof schema === 'string') {
	                        s[schema] = state;
	                    } else if (schema) {
	                        for (var key in schema) {
	                            var match = schema[key];
	                            if (typeof match === 'function') {
	                                s[key] = schema[key](state);
	                            } else {
	                                s[key] = state[schema[key]];
	                            }
	                        }
	                    } else {
	                        s = state;
	                    }
	                    this.setState(s);
	                };
	                self.onUpdate()(obj.prototype, METHOD);
	            };
	        }
	    }, {
	        key: 'inject',
	        value: function inject() {
	            var _MIDDLEWARES;
	
	            (_MIDDLEWARES = this[MIDDLEWARES]).push.apply(_MIDDLEWARES, arguments);
	        }
	    }]);
	
	    return Store;
	}();
	
	exports.default = Store;
	
	
	function Reducer(action) {
	    return function (prototype, key) {
	        prototype[REDUCERS] = prototype[REDUCERS] || {};
	        prototype[REDUCERS][action] = key;
	    };
	}
	function Inject() {
	    for (var _len4 = arguments.length, middlewares = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	        middlewares[_key4] = arguments[_key4];
	    }
	
	    return function (obj) {
	        var _obj$prototype$MIDDLE;
	
	        obj.prototype[MIDDLEWARES] = obj.prototype[MIDDLEWARES] || [];
	        (_obj$prototype$MIDDLE = obj.prototype[MIDDLEWARES]).push.apply(_obj$prototype$MIDDLE, middlewares);
	    };
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map