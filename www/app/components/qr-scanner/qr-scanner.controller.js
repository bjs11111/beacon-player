;(function () {
  'use strict'

  angular.module('bp.qr-scanner.controller', ['commons.qrScanner.service','commons.qrScanner.channel'])
          .controller('QRScannerController', QRScannerController);

  function QRScannerController($scope, QRScannerService, QRScannerChannel) {

    var vm = this;

    vm.isOpen;
    vm.code;

    vm.scanCode = scanCode;


    init();

    ////////////////

    function init() {
      vm.isOpen = QRScannerService.getIsQrScannerOpen();
      $scope
      QRScannerChannel.subIsOpenChanged($scope, function(newValue) {
        console.log('newValue', newValue);
        vm.isOpen = QRScannerService.getIsQrScannerOpen();
      })
    }

    function scanCode() {
      QRScannerService
        .saveOpenScan()
        .then(function (barcodeData) {
          vm.code = barcodeData;
        }, function (error) {
          vm.code = error;
        });
    }

  }

})();
