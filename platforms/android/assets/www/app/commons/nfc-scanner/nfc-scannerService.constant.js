;(function () {
  'use strict';


  var NFCScannerServiceConstant = {
    NFC_OK: 'NFC_OK',
    NFC_DISABLED: 'NFC_DISABLED'
  };

  angular
    .module('commons.nfcScannerService.constant', [])
    .constant("NFCScannerServiceConstant", NFCScannerServiceConstant);

})();
