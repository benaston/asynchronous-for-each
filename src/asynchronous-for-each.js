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