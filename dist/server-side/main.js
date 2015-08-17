@@kwire
  
@@niid

@@mixx

;(function(root) {
  'use strict';

  var namespace = {};

  kwire(namespace); // Configure window in browser for CommonJS module syntax.

  @@asynchronous-for-each

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