;(function () {
  'use strict';


  angular
    .module('commons.qrScanner.qrButton.directive', ['commons.qrScanner.service', 'ngCordova'])
    .directive('qrButton', qrButton);

    function qrButton(QRScannerService) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          successCallback: '=',
          errorCallback: '='
        },
        templateUrl: 'app/commons/qr-scanner/qr-button.directive.template.html',
        link: function (scope, element, attrs) {

          scope.scannQrCode = scannQrCode;

          //ng-click callback of directive
          function scannQrCode() {
            QRScannerService.saveOpenScan()
              .then(scope.successCallback, scope.errorCallback);
          }

        }
      }
    }


})();

