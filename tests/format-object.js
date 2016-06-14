'use strict';

var assert = require('chai').assert;
var formatObject = require('../helper/format-object');


describe('Format', function(){
    it('it should format json object', function() {
        var object = {
            'abc': 'abc',
            'xyz': 'xyz',
        };

        var result = '    abc: abc\n    xyz: xyz';

        assert(formatObject(object) === result, 'The format is unexpected');
    });
});
