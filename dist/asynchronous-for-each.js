;(function(root) {

	'use strict';

	var namespace = {};

	;
(function(namespace) {

	'use strict';

	/**
	 * Augments the window object with a 
	 * module and a require property to 
	 * emulate CommonJS in the browser.
	 * @param  {Object} appRoot The object to use as the root object for your 'modules' reqistered with kwire.
	 * @param  {Object} globalShadow An object to shadow the global object for testing purposes.
	 */
	function kwire(appRoot, globalShadow) {
		appRoot = appRoot == null ? {} : appRoot;
		globalShadow = globalShadow || window;

		if (typeof appRoot !== 'object') {
			throw 'root object must be an object.'
		}

		if (isServerSide() ||
			isUsingRequireJS() ||
			rootIsAlreadyConfigured(globalShadow)) {
			return;
		}

		globalShadow.module = {
			set exports(value) {
				if (value === undefined) {
					throw 'module not defined.';
				}
				if (value === null) { // null or undefined.
					return;
				}
				if (!value.hasOwnProperty('_path_')) {
					throw '_path_ own-property must be present on modules registered with kwire.';
				}

				if (typeof value._path_ !== 'string') {
					throw '_path_ own-property must be a string.';
				}

				appRoot[value._path_] = value;
			}
		};

		/**
		 * cb is optional.
		 */
		globalShadow.require = function(value, cb) {
			var valueIsArray = Array.isArray(value);
			if (value == null) {
				throw 'value not defined.'
			}
			if (typeof value !== 'string' && !valueIsArray) {
				throw 'value must be a string or an array.'
			}

			if (cb) {
				if (!valueIsArray) {
					return cb(appRoot[value]);
				}

				return cb.apply(null, value.map(function(v) {
					return appRoot[v];
				}));
			}

			var result = appRoot[value];

			return result === undefined ? globalShadow[camelify(value)] : result;
		};

	}

	function camelify(str) {
		return str.replace(/(\-([^-]{1}))/g, function(match, $1, $2) {
			return $2.toUpperCase();
		});
	}

	function isServerSide() {
		return (typeof exports === 'object') && module;
	}

	function isUsingRequireJS() {
		return (typeof define === 'function') && define.amd;
	}

	function rootIsAlreadyConfigured(globalShadow) {
		return (globalShadow.module && globalShadow.require);
	}

	kwire.camelify = camelify;
	namespace.kwire = kwire;

}(namespace));

	if ((typeof exports === 'object') && module) {
		module.exports = namespace; // CommonJS
	} else if ((typeof define === 'function') && define.amd) {
		define(function() {
			return namespace;
		}); // AMD
	} else {
		root.kwire = namespace.kwire; // Browser
	}

}(this));
  
;(function(root) {

	'use strict';

	var namespace = {};

	;
(function(namespace) {

	'use strict';

	/**
	 * Expects an arguments object, followed by zero or more 
	 * string arguments, corresponding to argument names.
	 * If a single argument is supplied, then all arguments 
	 * are verified to be defined. If more than one argument 
	 * is supplied, then the arguments corresponding to indices 
	 * that do not contain an '_' (underscore) are checked to 
	 * be defined.
	 * @param  {Arguments} args  The arguments object to check.
	 * @return {undefined}
	 */
	function need(args) {
		var argsArray, restArgs;

		if (!args) {
			return args;
		}

		argsArray = Array.prototype.slice.call(args);
		restArgs = Array.prototype.slice.call(arguments, 1);

		if (isArgumentObject(args)) {
			return argCheck(argsArray, restArgs);
		}

		return objectCheck(args, restArgs);
	}

	function argCheck(args, restArgs) {
		var iterator, reduceFn;

		iterator = restArgs.length ? restArgs : args;
		reduceFn = iterator === args ? undefinedCheck : unneededCheck.bind(null, args);

		iterator.reduce(reduceFn, null);
	}

	function objectCheck(o, restArgs) {
		var iterator, reduceFn;

		iterator = restArgs.length ? restArgs : Object.keys(o);
		reduceFn = undefinedCheckIn.bind(null, o);

		iterator.reduce(reduceFn, null);
	}

	function undefinedCheckIn(o, p, c) {
		if (o[c] === undefined) {
			throw c + ' not defined.';
		}
	}

	function unneededCheck(args, p, c, i) {
		if (c === '_') {
			return;
		}

		if (args[i] === undefined) {
			throw c + ' not defined.';
		}
	}

	function undefinedCheck(p, c, i) {
		if (c === undefined) {
			throw 'argument not defined.';
		}
	}

	function isArgumentObject(item) {
		return Object.prototype.toString.call(item) === '[object Arguments]';
	}

	namespace.need = need;

}(namespace));

	if ((typeof exports === 'object') && module) {
		module.exports = namespace; // CommonJS
	} else if ((typeof define === 'function') && define.amd) {
		define(function() {
			return namespace;
		}); // AMD
	} else {
		root.niid = namespace; // Browser
	}

}(this));

;(function(root) {

	'use strict';

	var namespace = {};

	;(function(namespace) {

	'use strict';

	var mixFn = (function() {
		return isES5() ? mixIntoObjectES5 : mixIntoObjectES3;
	}());

	/**
	 * Accepts an object and zero or more objects.
	 * Returns the function, modified so that the
	 * methods on the supplied objects are present
	 * on the function's prototype.
	 */
	function mix(target) {
		var objs = Array.prototype.slice.call(arguments, 1);

		switch (typeof target) {
			case 'function':
				mixFn(target.prototype, objs);
				return target;
			case 'object':
				return mixFn(target, objs);
		}

		return target;
	}

	function mixIntoObjectES3(target, objs) {
		var i, key, o;

		for (i = 0; i < objs.length; i++) {
			o = objs[i];

			if(o == null) { // null or undefined
				continue;
			}

			for (key in o) {
				if (!o.hasOwnProperty(key)) {
					continue;
				}

				target[key] = o[key];
			}
		}

		return target;
	}

	function mixIntoObjectES5(target, objs) {
		objs.forEach(function(o) {
			if(o == null) { // null or undefined
				return;
			}
			Object.keys(o).forEach(function(k) {
				var descriptor = Object.getOwnPropertyDescriptor(o, k);
				descriptor.configurable = true;
				Object.defineProperty(target, k, descriptor);
			});
		});

		return target;
	}

	function isES5() {
		return Object.getOwnPropertyDescriptor && Array.prototype.forEach;
	}

	namespace.mix = mix;

}(namespace));

	if ((typeof exports === 'object') && module) {
		module.exports = namespace; // CommonJS
	} else if ((typeof define === 'function') && define.amd) {
		define(function() {
			return namespace;
		}); // AMD
	} else {
		root.mixx = namespace; // Browser
	}

}(this));

;(function(root) {
  'use strict';

  var namespace = {};

  kwire(namespace); // Configure window in browser for CommonJS module syntax.

  /* global require, module */ ;
(function() {

    'use strict';

    var mix = require('mixx').mix;
    var need = require('niid').need;
    var noop = function() {};

    var defaultOptions = Object.freeze({
        cb: noop,
        done: noop,
        fail: noop,
        interval: 0,
    });

    /**
     * For each item in arr options.cb is run, 
     * with each cb instantiation ocurring on 
     * a different tick of the event loop.
     */
    function forEach(arr, options) {
        if (!Array.isArray(arr)) {
            throw 'arr must be an array.';
        }

        need(options = mix({}, defaultOptions, options));

        addJob(function each(i) {
            try {
                if (i === arr.length) {
                    options.done();
                    return;
                }
                options.cb(arr[i]);
                addJob(each, ++i);
            } catch (err) {
                options.fail(err);
            }
        }, 0); // 0 is the initial index.

        function addJob(job) {
            var args = [job].concat([].slice.call(arguments, 1));
            setTimeout(job.bind.apply(job, args), options.interval);
        }
    }

    forEach._path_ = './for-each';

    module.exports = forEach;

}());

  if ((typeof exports === 'object') && module) {
    module.exports = namespace; // CommonJS
  } else if ((typeof define === 'function') && define.amd) {
    define(function() {
      return namespace;
    }); // AMD
  } else {
    root.aForEach = namespace; // Browser
  }
}(this));