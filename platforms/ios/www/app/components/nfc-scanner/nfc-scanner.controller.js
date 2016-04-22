;(function () {
  'use strict'

  angular.module('bp.nfc-scanner.controller', ['commons.nfcScanner.service','commons.nfcScanner.channel'])
          .controller('NFCScannerController', NFCScannerController);

  function NFCScannerController($scope, NFCScannerService, NFCScannerChannel) {

    var vm = this;

    vm.isOpen;
    vm.code;

    vm.scanCode = scanCode;


    init();

    ////////////////

    function init() {
      vm.isOpen = NFCScannerService.getIsQrScannerOpen();

      NFCScannerChannel.subIsOpenChanged($scope, function(newValue) {
        console.log('newValue', newValue);
        vm.isOpen = NFCScannerService.getIsQrScannerOpen();
      })
    }

    function scanCode() {
      NFCScannerService
        .saveOpenScan()
        .then(function (barcodeData) {
          vm.code = barcodeData;
        }, function (error) {
          vm.code = error;
        });
    }

  }

})();
