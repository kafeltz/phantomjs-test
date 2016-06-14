'use strict';

module.exports = function(obj) {
    // return '    abc: abc\n    xyz: xyz\n';
    var strArray = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            strArray.push('    ' + key + ': ' + obj[key]);
        }
    }

    return strArray.join('\n');
}
