(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rivets"] = factory();
	else
		root["rivets"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var rivets = _interopRequire(__webpack_require__(1));

	var View = _interopRequire(__webpack_require__(3));

	var _constants = __webpack_require__(2);

	var OPTIONS = _constants.OPTIONS;
	var EXTENSIONS = _constants.EXTENSIONS;

	var adapter = _interopRequire(__webpack_require__(7));

	var binders = _interopRequire(__webpack_require__(8));

	var Observer = _interopRequire(__webpack_require__(6));

	// Returns the public interface.

	rivets.binders = binders;
	rivets.adapters["."] = adapter;

	// Binds some data to a template / element. Returns a Rivets.View instance.
	rivets.bind = function (el, models, options) {
	  var viewOptions = {};
	  models = models || {};
	  options = options || {};

	  EXTENSIONS.forEach(function (extensionType) {
	    viewOptions[extensionType] = Object.create(null);

	    if (options[extensionType]) {
	      Object.keys(options[extensionType]).forEach(function (key) {
	        viewOptions[extensionType][key] = options[extensionType][key];
	      });
	    }

	    Object.keys(rivets[extensionType]).forEach(function (key) {
	      if (!viewOptions[extensionType][key]) {
	        viewOptions[extensionType][key] = rivets[extensionType][key];
	      }
	    });
	  });

	  OPTIONS.forEach(function (option) {
	    var value = options[option];
	    viewOptions[option] = value != null ? value : rivets[option];
	  });

	  viewOptions.starBinders = Object.keys(viewOptions.binders).filter(function (key) {
	    return key.indexOf("*") > 0;
	  });

	  Observer.updateOptions(viewOptions);

	  var view = new View(el, models, viewOptions);
	  view.bind();
	  return view;
	};

	// Initializes a new instance of a component on the specified element and
	// returns a Rivets.View instance.
	rivets.init = function (component, el) {
	  var data = arguments[2] === undefined ? {} : arguments[2];

	  if (!el) {
	    el = document.createElement("div");
	  }

	  var component = rivets.components[component];
	  el.innerHTML = component.template.call(rivets, el);
	  var scope = component.initialize.call(rivets, el, data);

	  var view = rivets.bind(el, scope);
	  view.bind();
	  return view;
	};

	module.exports = rivets;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _constants = __webpack_require__(2);

	var OPTIONS = _constants.OPTIONS;
	var EXTENSIONS = _constants.EXTENSIONS;

	var rivets = Object.defineProperties({
	  // Global binders.
	  binders: {},

	  // Global components.
	  components: {},

	  // Global formatters.
	  formatters: {},

	  // Global sightglass adapters.
	  adapters: {},

	  // Default attribute prefix.
	  _prefix: "rv",

	  _fullPrefix: "rv-",

	  // Default template delimiters.
	  templateDelimiters: ["{", "}"],

	  // Default sightglass root interface.
	  rootInterface: ".",

	  // Preload data by default.
	  preloadData: true,

	  // Default event handler.
	  handler: function handler(context, ev, binding) {
	    this.call(context, ev, binding.view.models);
	  },

	  // Sets the attribute on the element. If no binder above is matched it will fall
	  // back to using this binder.
	  fallbackBinder: function fallbackBinder(el, value) {
	    if (value != null) {
	      el.setAttribute(this.type, value);
	    } else {
	      el.removeAttribute(this.type);
	    }
	  },

	  // Merges an object literal into the corresponding global options.
	  configure: function configure(options) {
	    var _this = this;

	    if (!options) {
	      return;
	    }
	    Object.keys(options).forEach(function (option) {
	      var value = options[option];

	      if (EXTENSIONS.indexOf(option) > -1) {
	        Object.keys(value).forEach(function (key) {
	          _this[option][key] = value[key];
	        });
	      } else {
	        _this[option] = value;
	      }
	    });
	  }
	}, {
	  prefix: {
	    get: function () {
	      return this._prefix;
	    },
	    set: function (value) {
	      this._prefix = value;
	      this._fullPrefix = value + "-";
	    },
	    configurable: true,
	    enumerable: true
	  }
	});

	module.exports = rivets;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var OPTIONS = ["prefix", "templateDelimiters", "rootInterface", "preloadData", "handler"];

	exports.OPTIONS = OPTIONS;
	var EXTENSIONS = ["binders", "formatters", "components", "adapters"];
	exports.EXTENSIONS = EXTENSIONS;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var rivets = _interopRequire(__webpack_require__(1));

	var _bindings = __webpack_require__(4);

	var Binding = _bindings.Binding;
	var ComponentBinding = _bindings.ComponentBinding;

	var parseTemplate = __webpack_require__(5).parseTemplate;

	var textBinder = {
	  routine: function (node, value) {
	    node.data = value != null ? value : "";
	  }
	};

	var parseNode = function (view, node) {
	  var block = false;

	  if (node.nodeType === 3) {
	    var tokens = parseTemplate(node.data, rivets.templateDelimiters);

	    if (tokens) {
	      for (var i = 0; i < tokens.length; i++) {
	        var token = tokens[i];
	        var text = document.createTextNode(token.value);
	        node.parentNode.insertBefore(text, node);

	        if (token.type === 1) {
	          view.buildBinding(text, null, token.value, textBinder, null);
	        }
	      }

	      node.parentNode.removeChild(node);
	    }
	    block = true;
	  } else if (node.nodeType === 1) {
	    block = view.traverse(node);
	  }

	  if (!block) {
	    for (var i = 0; i < node.childNodes.length; i++) {
	      parseNode(view, node.childNodes[i]);
	    }
	  }
	};

	var bindingComparator = function (a, b) {
	  var aPriority = a.binder ? a.binder.priority || 0 : 0;
	  var bPriority = b.binder ? b.binder.priority || 0 : 0;
	  return bPriority - aPriority;
	};

	var trimStr = function (str) {
	  return str.trim();
	};

	// A collection of bindings built from a set of parent nodes.

	var View = (function () {
	  // The DOM elements and the model objects for binding are passed into the
	  // constructor along with any local options that should be used throughout the
	  // context of the view and it's bindings.

	  function View(els, models, options) {
	    _classCallCheck(this, View);

	    if (els.jquery || els instanceof Array) {
	      this.els = els;
	    } else {
	      this.els = [els];
	    }

	    this.models = models;
	    this.options = options;

	    this.build();
	  }

	  _createClass(View, {
	    buildBinding: {
	      value: function buildBinding(node, type, declaration, binder, arg) {
	        var pipes = declaration.match(/((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g).map(trimStr);

	        var context = pipes.shift().split("<").map(trimStr);

	        var keypath = context.shift();
	        var dependencies = context.shift();
	        var options = { formatters: pipes };

	        if (dependencies) {
	          options.dependencies = dependencies.split(/\s+/);
	        }

	        this.bindings.push(new Binding(this, node, type, keypath, binder, arg, options));
	      }
	    },
	    build: {

	      // Parses the DOM tree and builds `Binding` instances for every matched
	      // binding declaration.

	      value: function build() {
	        this.bindings = [];

	        var elements = this.els,
	            i = undefined,
	            len = undefined;
	        for (i = 0, len = elements.length; i < len; i++) {
	          parseNode(this, elements[i]);
	        }

	        this.bindings.sort(bindingComparator);
	      }
	    },
	    traverse: {
	      value: function traverse(node) {
	        var bindingPrefix = rivets._fullPrefix;
	        var block = node.nodeName === "SCRIPT" || node.nodeName === "STYLE";
	        var attributes = node.attributes;
	        var bindInfos = [];
	        var starBinders = this.options.starBinders;
	        var type, binder, identifier, arg;

	        for (var i = 0, len = attributes.length; i < len; i++) {
	          var attribute = attributes[i];
	          if (attribute.name.indexOf(bindingPrefix) === 0) {
	            type = attribute.name.slice(bindingPrefix.length);
	            binder = this.options.binders[type];
	            arg = undefined;

	            if (!binder) {
	              for (var k = 0; k < starBinders.length; k++) {
	                identifier = starBinders[k];
	                if (type.slice(0, identifier.length - 1) === identifier.slice(0, -1)) {
	                  binder = this.options.binders[identifier];
	                  arg = type.slice(identifier.length - 1);
	                  break;
	                }
	              }
	            }

	            if (!binder) {
	              binder = rivets.fallbackBinder;
	            }

	            if (binder.block) {
	              this.buildBinding(node, type, attribute.value, binder, arg);
	              return true;
	            }

	            bindInfos.push({ attr: attribute, binder: binder, type: type, arg: arg });
	          }
	        }

	        for (var i = 0; i < bindInfos.length; i++) {
	          var bindInfo = bindInfos[i];
	          this.buildBinding(node, bindInfo.type, bindInfo.attr.value, bindInfo.binder, bindInfo.arg);
	        }

	        if (!block) {
	          var _type = node.nodeName.toLowerCase();

	          if (this.options.components[_type] && !node._bound) {
	            this.bindings.push(new ComponentBinding(this, node, _type));
	            block = true;
	          }
	        }

	        return block;
	      }
	    },
	    bind: {

	      // Binds all of the current bindings for this view.

	      value: function bind() {
	        this.bindings.forEach(function (binding) {
	          binding.bind();
	        });
	      }
	    },
	    unbind: {

	      // Unbinds all of the current bindings for this view.

	      value: function unbind() {
	        this.bindings.forEach(function (binding) {
	          binding.unbind();
	        });
	      }
	    },
	    sync: {

	      // Syncs up the view with the model by running the routines on all bindings.

	      value: function sync() {
	        this.bindings.forEach(function (binding) {
	          binding.sync();
	        });
	      }
	    },
	    publish: {

	      // Publishes the input values from the view back to the model (reverse sync).

	      value: function publish() {
	        this.bindings.forEach(function (binding) {
	          if (binding.binder && binding.binder.publishes) {
	            binding.publish();
	          }
	        });
	      }
	    },
	    update: {

	      // Updates the view's models along with any affected bindings.

	      value: function update() {
	        var _this = this;

	        var models = arguments[0] === undefined ? {} : arguments[0];

	        Object.keys(models).forEach(function (key) {
	          _this.models[key] = models[key];
	        });

	        this.bindings.forEach(function (binding) {
	          if (binding.update) {
	            binding.update(models);
	          }
	        });
	      }
	    }
	  });

	  return View;
	})();

	module.exports = View;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var rivets = _interopRequire(__webpack_require__(1));

	var parseType = __webpack_require__(5).parseType;

	var _constants = __webpack_require__(2);

	var EXTENSIONS = _constants.EXTENSIONS;
	var OPTIONS = _constants.OPTIONS;

	var Observer = _interopRequire(__webpack_require__(6));

	//there's a cyclic dependency that makes imported View a dummy object
	//import View from './view'

	function getInputValue(el) {
	  var results = [];
	  if (el.type === "checkbox") {
	    return el.checked;
	  } else if (el.type === "select-multiple") {

	    el.options.forEach(function (option) {
	      if (option.selected) {
	        results.push(option.value);
	      }
	    });

	    return results;
	  } else {
	    return el.value;
	  }
	}

	// A single binding between a model attribute and a DOM element.

	var Binding = exports.Binding = (function () {
	  // All information about the binding is passed into the constructor; the
	  // containing view, the DOM node, the type of binding, the model object and the
	  // keypath at which to listen for changes.

	  function Binding(view, el, type, keypath, binder, arg, options) {
	    _classCallCheck(this, Binding);

	    this.view = view;
	    this.el = el;
	    this.type = type;
	    this.keypath = keypath;
	    this.options = options;
	    this.dependencies = [];
	    this.formatterObservers = {};
	    this.model = undefined;
	    this.binder = binder;
	    this.arg = arg;
	  }

	  _createClass(Binding, {
	    observe: {

	      // Observes the object keypath to run the provided callback.

	      value: function observe(obj, keypath, callback) {
	        return new Observer(obj, keypath, this);
	      }
	    },
	    parseTarget: {
	      value: function parseTarget() {
	        if (this.keypath) {
	          var token = parseType(this.keypath);

	          if (token.type === 0) {
	            this.value = token.value;
	          } else {
	            this.observer = this.observe(this.view.models, this.keypath, this.sync);
	            this.model = this.observer.target;
	          }
	        } else {
	          this.value = undefined;
	        }
	      }
	    },
	    parseFormatterArguments: {
	      value: function parseFormatterArguments(args, formatterIndex) {
	        var _this = this;

	        return args.map(parseType).map(function (_ref, ai) {
	          var type = _ref.type;
	          var value = _ref.value;

	          if (type === 0) {
	            return value;
	          } else {
	            if (!_this.formatterObservers[formatterIndex]) {
	              _this.formatterObservers[formatterIndex] = {};
	            }

	            var observer = _this.formatterObservers[formatterIndex][ai];

	            if (!observer) {
	              observer = _this.observe(_this.view.models, value, _this.sync);
	              _this.formatterObservers[formatterIndex][ai] = observer;
	            }

	            return observer.value();
	          }
	        });
	      }
	    },
	    formattedValue: {

	      // Applies all the current formatters to the supplied value and returns the
	      // formatted value.

	      value: function formattedValue(value) {
	        var _this = this;

	        this.options.formatters.forEach(function (formatterStr, fi) {
	          var args = formatterStr.match(/[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g);
	          var id = args.shift();
	          var formatter = _this.view.options.formatters[id];

	          var processedArgs = _this.parseFormatterArguments(args, fi);

	          if (formatter && formatter.read instanceof Function) {
	            value = formatter.read.apply(formatter, [value].concat(_toConsumableArray(processedArgs)));
	          } else if (formatter instanceof Function) {
	            value = formatter.apply(undefined, [value].concat(_toConsumableArray(processedArgs)));
	          }
	        });

	        return value;
	      }
	    },
	    eventHandler: {

	      // Returns an event handler for the binding around the supplied function.

	      value: function eventHandler(fn) {
	        var binding = this;
	        var handler = binding.view.options.handler;

	        return function (ev) {
	          handler.call(fn, this, ev, binding);
	        };
	      }
	    },
	    set: {

	      // Sets the value for the binding. This Basically just runs the binding routine
	      // with the supplied value formatted.

	      value: function set(value) {
	        if (value instanceof Function && !this.binder["function"]) {
	          value = this.formattedValue(value.call(this.model));
	        } else {
	          value = this.formattedValue(value);
	        }

	        var routineFn = this.binder.routine || this.binder;

	        if (routineFn instanceof Function) {
	          routineFn.call(this, this.el, value);
	        }
	      }
	    },
	    sync: {

	      // Syncs up the view binding with the model.

	      value: function sync() {
	        var _this = this;

	        if (this.observer) {
	          if (this.model !== this.observer.target) {
	            var deps = this.options.dependencies;

	            this.dependencies.forEach(function (observer) {
	              observer.unobserve();
	            });

	            this.dependencies = [];
	            this.model = this.observer.target;

	            if (this.model && deps && deps.length) {
	              deps.forEach(function (dependency) {
	                var observer = _this.observe(_this.model, dependency, _this.sync);
	                _this.dependencies.push(observer);
	              });
	            }
	          }

	          this.set(this.observer.value());
	        } else {
	          this.set(this.value);
	        }
	      }
	    },
	    publish: {

	      // Publishes the value currently set on the input element back to the model.

	      value: function publish() {
	        var _this = this;

	        var value, lastformatterIndex;
	        if (this.observer) {
	          value = this.getValue(this.el);
	          lastformatterIndex = this.options.formatters.length - 1;

	          this.options.formatters.slice(0).reverse().forEach(function (formatter, fiReversed) {
	            var fi = lastformatterIndex - fiReversed;
	            var args = formatter.split(/\s+/);
	            var id = args.shift();
	            var f = _this.view.options.formatters[id];
	            var processedArgs = _this.parseFormatterArguments(args, fi);

	            if (f && f.publish) {
	              value = f.publish.apply(f, [value].concat(_toConsumableArray(processedArgs)));
	            }
	          });

	          this.observer.setValue(value);
	        }
	      }
	    },
	    bind: {

	      // Subscribes to the model for changes at the specified keypath. Bi-directional
	      // routines will also listen for changes on the element to propagate them back
	      // to the model.

	      value: function bind() {
	        var _this = this;

	        this.parseTarget();

	        if (this.binder.hasOwnProperty("bind")) {
	          this.binder.bind.call(this, this.el);
	        }

	        if (this.model && this.options.dependencies) {
	          this.options.dependencies.forEach(function (dependency) {
	            var observer = _this.observe(_this.model, dependency, _this.sync);
	            _this.dependencies.push(observer);
	          });
	        }

	        if (this.view.options.preloadData) {
	          this.sync();
	        }
	      }
	    },
	    unbind: {

	      // Unsubscribes from the model and the element.

	      value: function unbind() {
	        var _this = this;

	        if (this.binder.unbind) {
	          this.binder.unbind.call(this, this.el);
	        }

	        if (this.observer) {
	          this.observer.unobserve();
	        }

	        this.dependencies.forEach(function (observer) {
	          observer.unobserve();
	        });

	        this.dependencies = [];

	        Object.keys(this.formatterObservers).forEach(function (fi) {
	          var args = _this.formatterObservers[fi];

	          Object.keys(args).forEach(function (ai) {
	            args[ai].unobserve();
	          });
	        });

	        this.formatterObservers = {};
	      }
	    },
	    update: {

	      // Updates the binding's model from what is currently set on the view. Unbinds
	      // the old model first and then re-binds with the new model.

	      value: function update() {
	        var models = arguments[0] === undefined ? {} : arguments[0];

	        if (this.observer) {
	          this.model = this.observer.target;
	        }

	        if (this.binder.update) {
	          this.binder.update.call(this, models);
	        }
	      }
	    },
	    getValue: {

	      // Returns elements value

	      value: function getValue(el) {
	        if (this.binder && this.binder.getValue) {
	          return this.binder.getValue.call(this, el);
	        } else {
	          return getInputValue(el);
	        }
	      }
	    }
	  });

	  return Binding;
	})();

	// component view encapsulated as a binding within it's parent view.

	var ComponentBinding = exports.ComponentBinding = (function (_Binding) {
	  // Initializes a component binding for the specified view. The raw component
	  // element is passed in along with the component type. Attributes and scope
	  // inflections are determined based on the components defined attributes.

	  function ComponentBinding(view, el, type) {
	    _classCallCheck(this, ComponentBinding);

	    this.view = view;
	    this.el = el;
	    this.type = type;
	    this.component = view.options.components[this.type];
	    this["static"] = {};
	    this.observers = {};
	    this.upstreamObservers = {};

	    var bindingPrefix = rivets._fullPrefix;

	    for (var i = 0, len = el.attributes.length; i < len; i++) {
	      var attribute = el.attributes[i];
	      if (attribute.name.indexOf(bindingPrefix) !== 0) {
	        var propertyName = this.camelCase(attribute.name);
	        var stat = this.component["static"];

	        if (stat && stat.indexOf(propertyName) > -1) {
	          this["static"][propertyName] = attribute.value;
	        } else {
	          this.observers[propertyName] = attribute.value;
	        }
	      }
	    }
	  }

	  _inherits(ComponentBinding, _Binding);

	  _createClass(ComponentBinding, {
	    sync: {

	      // Intercepts `Rivets.Binding::sync` since component bindings are not bound to
	      // a particular model to update it's value.

	      value: function sync() {}
	    },
	    update: {

	      // Intercepts `Rivets.Binding::update` since component bindings are not bound
	      // to a particular model to update it's value.

	      value: function update() {}
	    },
	    publish: {

	      // Intercepts `Rivets.Binding::publish` since component bindings are not bound
	      // to a particular model to update it's value.

	      value: function publish() {}
	    },
	    locals: {

	      // Returns an object map using the component's scope inflections.

	      value: function locals() {
	        var _this = this;

	        var result = {};

	        Object.keys(this["static"]).forEach(function (key) {
	          result[key] = _this["static"][key];
	        });

	        Object.keys(this.observers).forEach(function (key) {
	          result[key] = _this.observers[key].value();
	        });

	        return result;
	      }
	    },
	    camelCase: {

	      // Returns a camel-cased version of the string. Used when translating an
	      // element's attribute name into a property name for the component's scope.

	      value: function camelCase(string) {
	        return string.replace(/-([a-z])/g, function (grouped) {
	          grouped[1].toUpperCase();
	        });
	      }
	    },
	    bind: {

	      // Intercepts `Rivets.Binding::bind` to build `@componentView` with a localized
	      // map of models from the root view. Bind `@componentView` on subsequent calls.

	      value: function bind() {
	        var _this = this;

	        var options = {};
	        if (!this.bound) {
	          Object.keys(this.observers).forEach(function (key) {
	            var keypath = _this.observers[key];

	            _this.observers[key] = _this.observe(_this.view.models, keypath, (function (key) {
	              return function () {
	                _this.componentView.models[key] = _this.observers[key].value();
	              };
	            }).call(_this, key));
	          });

	          this.bound = true;
	        }

	        if (this.componentView) {
	          this.componentView.bind();
	        } else {
	          this.el.innerHTML = this.component.template.call(this);
	          var scope = this.component.initialize.call(this, this.el, this.locals());
	          this.el._bound = true;

	          EXTENSIONS.forEach(function (extensionType) {
	            options[extensionType] = {};

	            if (_this.component[extensionType]) {
	              Object.keys(_this.component[extensionType]).forEach(function (key) {
	                options[extensionType][key] = _this.component[extensionType][key];
	              });
	            }

	            Object.keys(_this.view.options[extensionType]).forEach(function (key) {
	              if (options[extensionType][key]) {
	                options[extensionType][key] = _this.view[extensionType][key];
	              }
	            });
	          });

	          OPTIONS.forEach(function (option) {
	            if (_this.component[option] != null) {
	              options[option] = _this.component[option];
	            } else {
	              options[option] = _this.view[option];
	            }
	          });

	          //there's a cyclic dependency that makes imported View a dummy object. Use rivets.bind
	          //this.componentView = new View(this.el, scope, options)
	          //this.componentView.bind()
	          this.componentView = rivets.bind(Array.prototype.slice.call(this.el.childNodes), scope, options);

	          Object.keys(this.observers).forEach(function (key) {
	            var observer = _this.observers[key];
	            var models = _this.componentView.models;

	            var upstream = _this.observe(models, key, (function (key, observer) {
	              return function () {
	                observer.setValue(_this.componentView.models[key]);
	              };
	            }).call(_this, key, observer));

	            _this.upstreamObservers[key] = upstream;
	          });
	        }
	      }
	    },
	    unbind: {

	      // Intercept `Rivets.Binding::unbind` to be called on `@componentView`.

	      value: function unbind() {
	        var _this = this;

	        Object.keys(this.upstreamObservers).forEach(function (key) {
	          _this.upstreamObservers[key].unobserve();
	        });

	        Object.keys(this.observers).forEach(function (key) {
	          _this.observers[key].unobserve();
	        });

	        if (this.componentView) {
	          this.componentView.unbind.call(this);
	        }
	      }
	    }
	  });

	  return ComponentBinding;
	})(Binding);

/***/ },
/* 5 */
/***/ function(module, exports) {

	

	// Parser and tokenizer for getting the type and value from a string.
	"use strict";

	exports.parseType = parseType;

	// Template parser and tokenizer for mustache-style text content bindings.
	// Parses the template and returns a set of tokens, separating static portions
	// of text from binding declarations.
	exports.parseTemplate = parseTemplate;
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var PRIMITIVE = 0;
	var KEYPATH = 1;
	var TEXT = 0;
	var BINDING = 1;
	function parseType(string) {
	  var type = PRIMITIVE;
	  var value = string;

	  if (/^'.*'$|^".*"$/.test(string)) {
	    value = string.slice(1, -1);
	  } else if (string === "true") {
	    value = true;
	  } else if (string === "false") {
	    value = false;
	  } else if (string === "null") {
	    value = null;
	  } else if (string === "undefined") {
	    value = undefined;
	  } else if (!isNaN(string)) {
	    value = Number(string);
	  } else {
	    type = KEYPATH;
	  }

	  return { type: type, value: value };
	}

	function parseTemplate(template, delimiters) {
	  var tokens;
	  var length = template.length;
	  var index = 0;
	  var lastIndex = 0;
	  var open = delimiters[0],
	      close = delimiters[1];

	  while (lastIndex < length) {
	    index = template.indexOf(open, lastIndex);

	    if (index < 0) {
	      if (tokens) {
	        tokens.push({
	          type: TEXT,
	          value: template.slice(lastIndex)
	        });
	      }

	      break;
	    } else {
	      tokens || (tokens = []);
	      if (index > 0 && lastIndex < index) {
	        tokens.push({
	          type: TEXT,
	          value: template.slice(lastIndex, index)
	        });
	      }

	      lastIndex = index + open.length;
	      index = template.indexOf(close, lastIndex);

	      if (index < 0) {
	        var substring = template.slice(lastIndex - close.length);
	        var lastToken = tokens[tokens.length - 1];

	        if (lastToken && lastToken.type === TEXT) {
	          lastToken.value += substring;
	        } else {
	          tokens.push({
	            type: TEXT,
	            value: substring
	          });
	        }

	        break;
	      }

	      var value = template.slice(lastIndex, index).trim();

	      tokens.push({
	        type: BINDING,
	        value: value
	      });

	      lastIndex = index + close.length;
	    }
	  }

	  return tokens;
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	
	// Check if a value is an object than can be observed.
	"use strict";

	function isObject(obj) {
	  return typeof obj === "object" && obj !== null;
	}

	// Error thrower.
	function error(message) {
	  throw new Error("[Observer] " + message);
	}

	var adapters;
	var interfaces;
	var rootInterface;

	// Constructs a new keypath observer and kicks things off.
	function Observer(obj, keypath, callback) {
	  this.keypath = keypath;
	  this.callback = callback;
	  this.objectPath = [];
	  this.parse();
	  this.obj = this.getRootObject(obj);

	  if (isObject(this.target = this.realize())) {
	    this.set(true, this.key, this.target, this.callback);
	  }
	}

	Observer.updateOptions = function (options) {
	  adapters = options.adapters;
	  interfaces = Object.keys(adapters);
	  rootInterface = options.rootInterface;
	};

	// Tokenizes the provided keypath string into interface + path tokens for the
	// observer to work with.
	Observer.tokenize = function (keypath, root) {
	  var tokens = [];
	  var current = { i: root, path: "" };
	  var index, chr;

	  for (index = 0; index < keypath.length; index++) {
	    chr = keypath.charAt(index);

	    if (!! ~interfaces.indexOf(chr)) {
	      tokens.push(current);
	      current = { i: chr, path: "" };
	    } else {
	      current.path += chr;
	    }
	  }

	  tokens.push(current);
	  return tokens;
	};

	// Parses the keypath using the interfaces defined on the view. Sets variables
	// for the tokenized keypath as well as the end key.
	Observer.prototype.parse = function () {
	  var path, root;

	  if (!interfaces.length) {
	    error("Must define at least one adapter interface.");
	  }

	  if (!! ~interfaces.indexOf(this.keypath[0])) {
	    root = this.keypath[0];
	    path = this.keypath.substr(1);
	  } else {
	    root = rootInterface;
	    path = this.keypath;
	  }

	  this.tokens = Observer.tokenize(path, root);
	  this.key = this.tokens.pop();
	};

	// Realizes the full keypath, attaching observers for every key and correcting
	// old observers to any changed objects in the keypath.
	Observer.prototype.realize = function () {
	  var current = this.obj;
	  var unreached = false;
	  var prev;
	  var token;

	  for (var index = 0; index < this.tokens.length; index++) {
	    token = this.tokens[index];
	    if (isObject(current)) {
	      if (typeof this.objectPath[index] !== "undefined") {
	        if (current !== (prev = this.objectPath[index])) {
	          this.set(false, token, prev, this);
	          this.set(true, token, current, this);
	          this.objectPath[index] = current;
	        }
	      } else {
	        this.set(true, token, current, this);
	        this.objectPath[index] = current;
	      }

	      current = this.get(token, current);
	    } else {
	      if (unreached === false) {
	        unreached = index;
	      }

	      if (prev = this.objectPath[index]) {
	        this.set(false, token, prev, this);
	      }
	    }
	  }

	  if (unreached !== false) {
	    this.objectPath.splice(unreached);
	  }

	  return current;
	};

	// Updates the keypath. This is called when any intermediary key is changed.
	Observer.prototype.sync = function () {
	  var next, oldValue, newValue;

	  if ((next = this.realize()) !== this.target) {
	    if (isObject(this.target)) {
	      this.set(false, this.key, this.target, this.callback);
	    }

	    if (isObject(next)) {
	      this.set(true, this.key, next, this.callback);
	    }

	    oldValue = this.value();
	    this.target = next;
	    newValue = this.value();
	    if (newValue !== oldValue || newValue instanceof Function) this.callback.sync();
	  } else if (next instanceof Array) {
	    this.callback.sync();
	  }
	};

	// Reads the current end value of the observed keypath. Returns undefined if
	// the full keypath is unreachable.
	Observer.prototype.value = function () {
	  if (isObject(this.target)) {
	    return this.get(this.key, this.target);
	  }
	};

	// Sets the current end value of the observed keypath. Calling setValue when
	// the full keypath is unreachable is a no-op.
	Observer.prototype.setValue = function (value) {
	  if (isObject(this.target)) {
	    adapters[this.key.i].set(this.target, this.key.path, value);
	  }
	};

	// Gets the provided key on an object.
	Observer.prototype.get = function (key, obj) {
	  return adapters[key.i].get(obj, key.path);
	};

	// Observes or unobserves a callback on the object using the provided key.
	Observer.prototype.set = function (active, key, obj, callback) {
	  var action = active ? "observe" : "unobserve";
	  adapters[key.i][action](obj, key.path, callback);
	};

	// Unobserves the entire keypath.
	Observer.prototype.unobserve = function () {
	  var obj;
	  var token;

	  for (var index = 0; index < this.tokens.length; index++) {
	    token = this.tokens[index];
	    if (obj = this.objectPath[index]) {
	      this.set(false, token, obj, this);
	    }
	  }

	  if (isObject(this.target)) {
	    this.set(false, this.key, this.target, this.callback);
	  }
	};
	// traverse the scope chain to find the scope which has the root property
	// if the property is not found in chain, returns the root scope
	Observer.prototype.getRootObject = function (obj) {
	  var rootProp, current;
	  if (!obj.$parent) {
	    return obj;
	  }

	  if (this.tokens.length) {
	    rootProp = this.tokens[0].path;
	  } else {
	    rootProp = this.key.path;
	  }

	  current = obj;
	  while (current.$parent && current[rootProp] === undefined) {
	    current = current.$parent;
	  }

	  return current;
	};

	module.exports = Observer;

/***/ },
/* 7 */
/***/ function(module, exports) {

	// The default `.` adapter thats comes with Rivets.js. Allows subscribing to
	// properties on plain objects, implemented in ES5 natives using
	// `Object.defineProperty`.

	"use strict";

	var ARRAY_METHODS = ["push", "pop", "shift", "unshift", "sort", "reverse", "splice"];

	var adapter = {
	  counter: 0,
	  weakmap: {},

	  weakReference: function weakReference(obj) {
	    if (!obj.hasOwnProperty("__rv")) {
	      var id = this.counter++;

	      Object.defineProperty(obj, "__rv", {
	        value: id
	      });
	    }

	    if (!this.weakmap[obj.__rv]) {
	      this.weakmap[obj.__rv] = {
	        callbacks: {}
	      };
	    }

	    return this.weakmap[obj.__rv];
	  },

	  cleanupWeakReference: function cleanupWeakReference(ref, id) {
	    if (!Object.keys(ref.callbacks).length) {
	      if (!(ref.pointers && Object.keys(ref.pointers).length)) {
	        delete this.weakmap[id];
	      }
	    }
	  },

	  stubFunction: function stubFunction(obj, fn) {
	    var original = obj[fn];
	    var map = this.weakReference(obj);
	    var weakmap = this.weakmap;

	    obj[fn] = function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var response = original.apply(obj, args);

	      Object.keys(map.pointers).forEach(function (r) {
	        var k = map.pointers[r];

	        if (weakmap[r]) {
	          if (weakmap[r].callbacks[k] instanceof Array) {
	            weakmap[r].callbacks[k].forEach(function (callback) {
	              callback.sync();
	            });
	          }
	        }
	      });

	      return response;
	    };
	  },

	  observeMutations: function observeMutations(obj, ref, keypath) {
	    var _this = this;

	    if (obj instanceof Array) {
	      var map = this.weakReference(obj);

	      if (!map.pointers) {
	        map.pointers = {};

	        ARRAY_METHODS.forEach(function (fn) {
	          _this.stubFunction(obj, fn);
	        });
	      }

	      if (!map.pointers[ref]) {
	        map.pointers[ref] = [];
	      }

	      if (map.pointers[ref].indexOf(keypath) === -1) {
	        map.pointers[ref].push(keypath);
	      }
	    }
	  },

	  unobserveMutations: function unobserveMutations(obj, ref, keypath) {
	    if (obj instanceof Array && obj.__rv != null) {
	      var map = this.weakmap[obj.__rv];

	      if (map) {
	        var pointers = map.pointers[ref];

	        if (pointers) {
	          var idx = pointers.indexOf(keypath);

	          if (idx > -1) {
	            pointers.splice(idx, 1);
	          }

	          if (!pointers.length) {
	            delete map.pointers[ref];
	          }

	          this.cleanupWeakReference(map, obj.__rv);
	        }
	      }
	    }
	  },

	  observe: function observe(obj, keypath, callback) {
	    var _this = this;

	    var value;
	    var callbacks = this.weakReference(obj).callbacks;

	    if (!callbacks[keypath]) {
	      callbacks[keypath] = [];
	      var desc = Object.getOwnPropertyDescriptor(obj, keypath);

	      if (!desc || !(desc.get || desc.set || !desc.configurable)) {
	        value = obj[keypath];

	        Object.defineProperty(obj, keypath, {
	          enumerable: true,

	          get: function () {
	            return value;
	          },

	          set: function (newValue) {
	            if (newValue !== value) {
	              _this.unobserveMutations(value, obj.__rv, keypath);
	              value = newValue;
	              var map = _this.weakmap[obj.__rv];

	              if (map) {
	                var _callbacks = map.callbacks[keypath];

	                if (_callbacks) {
	                  _callbacks.forEach(function (cb) {
	                    cb.sync();
	                  });
	                }

	                _this.observeMutations(newValue, obj.__rv, keypath);
	              }
	            }
	          }
	        });
	      }
	    }

	    if (callbacks[keypath].indexOf(callback) === -1) {
	      callbacks[keypath].push(callback);
	    }

	    this.observeMutations(obj[keypath], obj.__rv, keypath);
	  },

	  unobserve: function unobserve(obj, keypath, callback) {
	    var map = this.weakmap[obj.__rv];

	    if (map) {
	      var callbacks = map.callbacks[keypath];

	      if (callbacks) {
	        var idx = callbacks.indexOf(callback);

	        if (idx > -1) {
	          callbacks.splice(idx, 1);

	          if (!callbacks.length) {
	            delete map.callbacks[keypath];
	            this.unobserveMutations(obj[keypath], obj.__rv, keypath);
	          }
	        }

	        this.cleanupWeakReference(map, obj.__rv);
	      }
	    }
	  },

	  get: function get(obj, keypath) {
	    return obj[keypath];
	  },

	  set: function (obj, keypath, value) {
	    obj[keypath] = value;
	  }
	};

	module.exports = adapter;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var rivets = _interopRequire(__webpack_require__(1));

	var View = _interopRequire(__webpack_require__(3));

	var getString = function (value) {
	  return value != null ? value.toString() : undefined;
	};

	var times = function (n, cb) {
	  for (var i = 0; i < n; i++) {
	    cb();
	  }
	};

	var binders = {
	  // Binds an event handler on the element.
	  "on-*": {
	    "function": true,
	    priority: 1000,

	    unbind: function unbind(el) {
	      if (this.handler) {
	        el.addEventListener(this.arg, this.handler);
	      }
	    },

	    routine: function routine(el, value) {
	      if (this.handler) {
	        el.removeEventListener(this.arg, this.handler);
	      }

	      this.handler = this.eventHandler(value);
	      el.addEventListener(this.arg, this.handler);
	    }
	  },

	  // Appends bound instances of the element in place for each item in the array.
	  "each-*": {
	    block: true,
	    priority: 4000,

	    bind: function bind(el) {
	      if (!this.marker) {
	        var attr = rivets._fullPrefix + this.type;
	        this.marker = document.createComment(" rivets: " + this.type + " ");
	        this.iterated = [];

	        el.removeAttribute(attr);
	        el.parentNode.insertBefore(this.marker, el);
	        el.parentNode.removeChild(el);
	      } else {
	        this.iterated.forEach(function (view) {
	          view.bind();
	        });
	      }
	    },

	    unbind: function unbind(el) {
	      if (this.iterated) {
	        this.iterated.forEach(function (view) {
	          view.unbind();
	        });
	      }
	    },

	    routine: function routine(el, collection) {
	      var _this = this;

	      var modelName = this.arg;
	      var collection = collection || [];
	      var indexProp = el.getAttribute("index-property") || "$index";

	      if (this.iterated.length > collection.length) {
	        times(this.iterated.length - collection.length, function () {
	          var view = _this.iterated.pop();
	          view.unbind();
	          _this.marker.parentNode.removeChild(view.els[0]);
	        });
	      }

	      collection.forEach(function (model, index) {
	        var data = { $parent: _this.view.models };
	        data[indexProp] = index;
	        data[modelName] = model;

	        if (!_this.iterated[index]) {

	          var previous = _this.marker;

	          if (_this.iterated.length) {
	            previous = _this.iterated[_this.iterated.length - 1].els[0];
	          }

	          //todo
	          //options.preloadData = true

	          var template = el.cloneNode(true);
	          var view = new View(template, data, _this.view.options);
	          view.bind();
	          _this.iterated.push(view);
	          _this.marker.parentNode.insertBefore(template, previous.nextSibling);
	        } else if (_this.iterated[index].models[modelName] !== model) {
	          _this.iterated[index].update(data);
	        }
	      });

	      if (el.nodeName === "OPTION") {
	        this.view.bindings.forEach(function (binding) {
	          if (binding.el === _this.marker.parentNode && binding.type === "value") {
	            binding.sync();
	          }
	        });
	      }
	    },

	    update: function update(models) {
	      var _this = this;

	      var data = {};

	      //todo: add test and fix if necessary

	      Object.keys(models).forEach(function (key) {
	        if (key !== _this.arg) {
	          data[key] = models[key];
	        }
	      });

	      this.iterated.forEach(function (view) {
	        view.update(data);
	      });
	    }
	  },

	  // Adds or removes the class from the element when value is true or false.
	  "class-*": function _class(el, value) {
	    var elClass = " " + el.className + " ";

	    if (!value === elClass.indexOf(" " + this.arg + " ") > -1) {
	      if (value) {
	        el.className = "" + el.className + " " + this.arg;
	      } else {
	        el.className = elClass.replace(" " + this.arg + " ", " ").trim();
	      }
	    }
	  },

	  // Sets the element's text value.
	  text: function (el, value) {
	    el.textContent = value != null ? value : "";
	  },

	  // Sets the element's HTML content.
	  html: function (el, value) {
	    el.innerHTML = value != null ? value : "";
	  },

	  // Shows the element when value is true.
	  show: function (el, value) {
	    el.style.display = value ? "" : "none";
	  },

	  // Hides the element when value is true (negated version of `show` binder).
	  hide: function (el, value) {
	    el.style.display = value ? "none" : "";
	  },

	  // Enables the element when value is true.
	  enabled: function (el, value) {
	    el.disabled = !value;
	  },

	  // Disables the element when value is true (negated version of `enabled` binder).
	  disabled: function (el, value) {
	    el.disabled = !!value;
	  },

	  // Checks a checkbox or radio input when the value is true. Also sets the model
	  // property when the input is checked or unchecked (two-way binder).
	  checked: {
	    publishes: true,
	    priority: 2000,

	    bind: function bind(el) {
	      var self = this;
	      if (!this.callback) {
	        this.callback = function () {
	          self.publish();
	        };
	      }
	      el.addEventListener("change", this.callback);
	    },

	    unbind: function unbind(el) {
	      el.removeEventListener("change", this.callback);
	    },

	    routine: function routine(el, value) {
	      if (el.type === "radio") {
	        el.checked = getString(el.value) === getString(value);
	      } else {
	        el.checked = !!value;
	      }
	    }
	  },

	  // Unchecks a checkbox or radio input when the value is true (negated version of
	  // `checked` binder). Also sets the model property when the input is checked or
	  // unchecked (two-way binder).
	  unchecked: {
	    publishes: true,
	    priority: 2000,

	    bind: function bind(el) {
	      var self = this;
	      if (!this.callback) {
	        this.callback = function () {
	          self.publish();
	        };
	      }
	      el.addEventListener("change", this.callback);
	    },

	    unbind: function unbind(el) {
	      el.removeEventListener("change", this.callback);
	    },

	    routine: function routine(el, value) {
	      if (el.type === "radio") {
	        el.checked = getString(el.value) !== getString(value);
	      } else {
	        el.checked = !value;
	      }
	    }
	  },

	  // Sets the element's value. Also sets the model property when the input changes
	  // (two-way binder).
	  value: {
	    publishes: true,
	    priority: 3000,

	    bind: function bind(el) {
	      this.isRadio = el.tagName === "INPUT" && el.type === "radio";
	      if (!this.isRadio) {
	        this.event = el.getAttribute("event-name") || (el.tagName === "SELECT" ? "change" : "input");

	        var self = this;
	        if (!this.callback) {
	          this.callback = function () {
	            self.publish();
	          };
	        }

	        el.addEventListener(this.event, this.callback);
	      }
	    },

	    unbind: function unbind(el) {
	      if (!this.isRadio) {
	        el.removeEventListener(this.event, this.callback);
	      }
	    },

	    routine: function routine(el, value) {
	      if (this.isRadio) {
	        el.setAttribute("value", value);
	      } else {
	        if (el.type === "select-multiple") {
	          if (value instanceof Array) {
	            for (var i = 0; i < el.length; i++) {
	              var option = el[i];
	              option.selected = value.indexOf(option.value) > -1;
	            }
	          }
	        } else if (getString(value) !== getString(el.value)) {
	          el.value = value != null ? value : "";
	        }
	      }
	    }
	  },

	  // Inserts and binds the element and it's child nodes into the DOM when true.
	  "if": {
	    block: true,
	    priority: 4000,

	    bind: function bind(el) {
	      if (!this.marker) {
	        var attr = rivets._fullPrefix + this.type;
	        var declaration = el.getAttribute(attr);

	        this.marker = document.createComment(" rivets: " + this.type + " " + declaration + " ");
	        this.bound = false;

	        el.removeAttribute(attr);
	        el.parentNode.insertBefore(this.marker, el);
	        el.parentNode.removeChild(el);
	      }
	    },

	    unbind: function unbind() {
	      if (this.nested) {
	        this.nested.unbind();
	        this.bound = false;
	      }
	    },

	    routine: function routine(el, value) {
	      if (!!value === !this.bound) {
	        if (value) {

	          if (this.nested) {
	            this.nested.bind();
	          } else {
	            this.nested = new View(el, this.view.models, this.view.options);
	            this.nested.bind();
	          }

	          this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
	          this.bound = true;
	        } else {
	          el.parentNode.removeChild(el);
	          this.nested.unbind();
	          this.bound = false;
	        }
	      }
	    },

	    update: function update(models) {
	      if (this.nested) {
	        this.nested.update(models);
	      }
	    }
	  },

	  // Removes and unbinds the element and it's child nodes into the DOM when true
	  // (negated version of `if` binder).
	  unless: {
	    block: true,
	    priority: 4000,

	    bind: function bind(el) {
	      rivets.binders["if"].bind.call(this, el);
	    },

	    unbind: function unbind() {
	      rivets.binders["if"].unbind.call(this);
	    },

	    routine: function routine(el, value) {
	      rivets.binders["if"].routine.call(this, el, !value);
	    },

	    update: function update(models) {
	      rivets.binders["if"].update.call(this, models);
	    }
	  }
	};

	module.exports = binders;

/***/ }
/******/ ])
});
;