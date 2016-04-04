;(function () {
  'use strict';


  angular
    .module('commons.qr-scanner.iconButton.directive', ['commons.qrScanner.channel', 'ngCordova'])
    .directive('iconButton', iconButton);

    function iconButton(QRScannerService) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          successCallback: '@qrSuccessCallback',
          errorCallback: '@qrErrorCallback'
        },
        templateUrl: 'app/common/directives/qr-scanner/icon-button.directive.template.html',
        link: function (scope, element, attrs) {

          //ng-click callback of directive
          scope.scannQrCode = function () {
            QRScannerService.saveOpenScan()
              .then(function (barcodeData) {
                scope.successCallback(barcodeData);
              }, function (error) {
                scope.errorCallback(error);
              });
          }

        }
      }
    }


})();

