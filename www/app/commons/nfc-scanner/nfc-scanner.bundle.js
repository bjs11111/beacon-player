;(function() {
    'use strict';

	angular
	    .module('commons.nfcScanner', [
              'commons.nfcScannerChannel.constant',
              'commons.nfcScanner.channel',
              'commons.nfcScannerService.constant',
              'commons.nfcScanner.service'
      ]);

})();
