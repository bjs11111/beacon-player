;(function() {
    'use strict';

	angular
	    .module('commons.qrScanner', [
              'commons.qrScannerChannel.constant',
              'commons.qrScanner.channel',
              'commons.qrScanner.service',
              'commons.qrScanner.qrButton.directive'
      ]);

})();
