var system = require('system');

var ENV = 'local';

system.args.forEach(function(arg) {
    if (arg.indexOf('--env') !== -1) {
        ENV = arg.split('=')[1];
    }
});


var prefix = '';

switch(ENV) {
    case 'staging':
        prefix = 'https://staging.eventials.com/';
        break;

    case 'production':
        prefix = 'https://eventials.com/';
        break;

    case 'local':
    default:
        prefix = 'http://local.eventials.com/';
        break;
}

module.exports = prefix;
