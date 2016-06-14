var assert = require('chai').assert;
var allowedRequest = require('../helper/allowed-request');

describe('Scenario: ', function(){
	it('it should block all known urls', function(){
		var blockedUrl = [
			'https://www.googletagmanager.com/gtm.js?id=GTM-NJH547',
			'https://connect.facebook.net/en_US/fbevents.js',
			'https://www.facebook.com/tr/?id=977354192358334&ev=PageView&dl=https%3A%2F%2Fwww.eventials.com%2Fprecos-e-planos-webinars%2F&rl=&if=false&ts=1466817894169&v=2.5.0',
			'https://www.google-analytics.com/collect?v=1&_v=j44&a=1325724509&t=pageview&_s=1&dl=https%3A%2F%2Fwww.eventials.com%2Fprecos-e-planos-webinars%2F&ul=pt-br&de=UTF-8&dt=Webinars%20-%20Pre%C3%A7os%20e%20Planos%20-%20Eventials&sd=32-bit&sr=1024x768&vp=400x300&je=0&_u=QGAAgAQ~&jid=1132915312&cid=1274245224.1466817894&uid=0&tid=UA-35258968-1&gtm=GTM-NJH547&cd1=0&cd3=&cd4=Visitor&z=665462926',
			'https://stats.g.doubleclick.net/r/collect?t=dc&aip=1&_r=3&v=1&_v=j44&tid=UA-35258968-1&cid=1274245224.1466817894&uid=0&jid=1132915312&_u=QGAAgAQ~&z=2116077922',
			'https://js-agent.newrelic.com/nr-952.min.js',
			'https://fonts.googleapis.com/css?family=Roboto:500,400',
			'https://bam.nr-data.net/1/4e8c44d12b?a=2367125&v=952.3a19e93&to=ZlNaMhFQV0dWARdaC18ZfhMNUk1dWAxMUhRBRRYDG0FVW0UHTUUNVEFLXBdQVV9oBxtDCF5EXQ==&rst=292&ref=https://staging.eventials.com/highlights/&ap=229&fe=279&dc=91&jsonp=NREUM.setToken',
			'https://maps.google.com.br/maps?f=q&source=s_q&hl=en&geocode=&q=Rua+Itapaiúna,+2434&aq=&sll=-14.239424,-53.186502&sspn=46.299676,79.013672&ie=UTF8&hq=&hnear=R.+Itapaiúna,+2434+-+Vila+Andrade,+São+Paulo,+05707-000&t=m&ll=-23.641222,-46.727772&spn=0.015725,0.020514&z=14&output=embed',
			'https://eventials.zendesk.com/account/dropboxes/20166327',
		];

		blockedUrl.forEach(function(element) {
			assert.isFalse(allowedRequest(element), element + ' this must be blocked');
		});
	});

	it('it should not block accepted urls', function() {
		var allowedRequests = [ // not all possible url, just some good examples
			'https://dlq8vi77lxj74.cloudfront.net/CACHE/css/8b10157a891d.css',
			'https://dlq8vi77lxj74.cloudfront.net/images/clients/logo-anhanguera.png',
			'https://dlq8vi77lxj74.cloudfront.net/fonts/eventials/eventials.ttf?sisnb0&a225b06d9a7c',
			'https://dlq8vi77lxj74.cloudfront.net/fonts/gibson/251F21_6_0.woff?fda6a1ad2678',
			'https://dlq8vi77lxj74.cloudfront.net/images/btn-livechat.png?d04b49568c1e',
			'https://gist.github.com/julionc/7476620',
		];

		allowedRequests.forEach(function(element) {
			assert.isTrue(allowedRequest(element), element + ' this must be allowed');
		});
	});

	it('it should return null for invalid input', function() {
		assert.isNull(allowedRequest(1));
		assert.isNull(allowedRequest(true));
		assert.isNull(allowedRequest(undefined));
	});
});
