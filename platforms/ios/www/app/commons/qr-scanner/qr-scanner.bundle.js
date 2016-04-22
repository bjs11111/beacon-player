;(function() {
    'use strict';

	angular
	    .module('commons.qr-scanner', [
              'commons.qr-scannerChannel.constant',
              'commons.qr-scanner.channel',
              'commons.qr-scanner.service',
              'commons.qr-scanner.iconButton.directive'
      ]);

})();
