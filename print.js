var page = require('webpage').create();

page.customHeaders = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36',
    'Authorization': 'Basic ' + btoa('eventials:w3b1n4r!@#'),
};

page.onResourceError = function(resourceError) {
    // ignore url we forcely aborted
    if (resourceError.status === null) {
        return;
    }

    console.log('Error');
    console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
    console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
    console.log('URL: ', resourceError.url);
    console.log('End Error');
};

page.onLoadFinished = function(status) {
    console.log('onLoadFinished: ', status);
};


page.open('https://www.eventials.com/precos-e-planos-webinars/', function() {
  page.render('myprint.png');
  phantom.exit();
});