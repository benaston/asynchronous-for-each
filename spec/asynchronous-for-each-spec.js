/* global require, describe, beforeEach, it, expect */
'use strict';

var forEach = require('./asynchronous-for-each');
var noop = function() {};

describe('forEach', function() {


    beforeEach(function() {
        
    });

    it('should invoke the done callback when the enumeration is complete', function() {
        //arrange
        var options = {
            cb: noop,
            done: noop,
        };

        //act
        forEach([1,2], options);

        //assert
        expect(options.done.calls.count()).toBe(1);
    });

});