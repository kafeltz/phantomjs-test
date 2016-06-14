'use strict';

module.exports = function(url) {
	if (typeof url === 'string' && url.length > 0) {
		return url.match(/google|gstatic|facebook|doubleclick|newrelic|nr-data.net|zendesk/gi) === null; 
	} else {
		return null;
	}
}
