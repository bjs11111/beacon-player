;(function () {
  'use strict'

  angular.module('bp.qrScanner.controller', ['commons.qrScanner.service','commons.qrScanner.channel', 'commons.qrScanner.qrButton.directive'])
          .controller('QRScannerController', QRScannerController);

  function QRScannerController($scope, QRScannerService, QRScannerChannel) {

    var vm = this;

    vm.isOpen;
    vm.code;

    vm.scanCode = scanCode;

    vm.successCallback = successCallback;
    vm.errorCallback = errorCallback;

    init();

    ////////////////

    function init() {
      vm.isOpen = QRScannerService.getIsQrScannerOpen();
      QRScannerChannel.subIsOpenChanged($scope, function(newValue) {
        vm.isOpen = QRScannerService.getIsQrScannerOpen();
      })
    }

    function scanCode() {
      QRScannerService.saveOpenScan()
        .then(successCallback, errorCallback);
    }
    function successCallback(barcodeData) {console.log('ctrl: successCallback'); vm.code = barcodeData;}
    function errorCallback(error) {console.log('ctrl: errorCallback'); vm.code = error;}



  }

})();
