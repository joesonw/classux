var Classux =
/******/ (function(modules) { // webpackBootstrap
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
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.Reducer = Reducer;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UPDATER = Symbol();
	var DISPOSER = Symbol();
	
	var STATE = Symbol();
	var LISTENERS = Symbol();
	var REDUCERS = Symbol();
	var DEFAULT_STATE = Symbol();
	
	var NOTIFY = Symbol();
	
	var Store = function () {
	    function Store(defaultState) {
	        var _this = this;
	
	        _classCallCheck(this, Store);
	
	        this[DEFAULT_STATE] = defaultState;
	        this[STATE] = defaultState;
	        this[LISTENERS] = [];
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
	        key: "subscribe",
	        value: function subscribe(listener) {
	            var _this2 = this;
	
	            var index = this[LISTENERS].push(listener) - 1;
	            return function () {
	                _this2[LISTENERS].splice(index, 1);
	            };
	        }
	    }, {
	        key: "dispatch",
	        value: function dispatch(action) {
	            var _this3 = this;
	
	            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                params[_key2 - 1] = arguments[_key2];
	            }
	
	            var reducer = this[this[REDUCERS][action]];
	            if (reducer) {
	                var state = reducer.call.apply(reducer, [this].concat(params));
	                if (state instanceof Promise) {
	                    state.then(function (state) {
	                        _this3[STATE] = state;
	                        _this3[NOTIFY].apply(_this3, [action].concat(params));
	                    }).catch(function (e) {
	                        if (e) {
	                            console.error(e.stack || e);
	                        }
	                    });
	                } else {
	                    this[STATE] = state;
	                    this[NOTIFY].apply(this, [action].concat(params));
	                }
	            }
	        }
	    }, {
	        key: "getState",
	        value: function getState() {
	            return this[STATE];
	        }
	    }, {
	        key: "onUpdate",
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
	
	                            this[DISPOSER] = self.subscribe(function (state, action) {
	                                var _iteratorNormalCompletion2 = true;
	                                var _didIteratorError2 = false;
	                                var _iteratorError2 = undefined;
	
	                                try {
	                                    for (var _iterator2 = _this4[UPDATER][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                                        var item = _step2.value;
	
	                                        if (actions.length === 0) {
	                                            _this4[key](state, action);
	                                        } else {
	                                            if (actions.indexOf(action) !== -1) {
	                                                _this4[key](state, action);
	                                            }
	                                        }
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
	                            });
	                            if (componentDidMount) {
	                                componentDidMount.call(this);
	                            }
	                        };
	
	                        prototype.componentWillUnmount = function () {
	                            this[DISPOSER]();
	                            if (componentWillUnmount) {
	                                componentWillUnmount.call(this);
	                            }
	                        };
	                    })();
	                }
	
	                prototype[UPDATER].push({
	                    method: key,
	                    actions: actions
	                });
	            };
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

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map