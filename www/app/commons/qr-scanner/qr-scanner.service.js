;
(function () {
  'use strict';

  angular
    .module('commons.qrScanner.service', ['commons.qrScanner.channel', 'ngCordova'])
    .service('QRScannerService', QRScannerService);

  function QRScannerService($q, $ionicPlatform, $cordovaBarcodeScanner, QRScannerChannel) {

    var isQrScannerOpenState = false;

    var diagnosticService = {
      getIsQrScannerOpen: getIsQrScannerOpen,
      saveOpenScan : saveOpenScan,
    };

    init();
    return diagnosticService;

    ///////

    function init() {

    }

    function getIsQrScannerOpen() {
      return isQrScannerOpenState;
    }

    function setIsQrScannerOpen(newState) {
      if(newState !== isQrScannerOpenState) {
        isQrScannerOpenState = !!(newState);
        QRScannerChannel.pubIsOpenChanged(isQrScannerOpenState);
      }
    }

    function saveOpenScan(successCallback, Errorcallback) {

      var defer = $q.defer();

      if (!getIsQrScannerOpen()) {
        setIsQrScannerOpen(true);
        $ionicPlatform.ready(function () {
          $cordovaBarcodeScanner
            .scan()
            .then(function (barcodeData) {
              setIsQrScannerOpen(false);
              defer.resolve(barcodeData);
            }, function (error) {
              setIsQrScannerOpen(false)
              defer.reject(error);
            });
        })
      } else {
        defer.reject(false);
      }

      return defer.promise;

    }


  }

})();
