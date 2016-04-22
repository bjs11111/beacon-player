;
(function () {
  'use strict';

  angular.module('commons.qrScanner.channel', ['commons.qrScannerChannel.constant', 'commons.baseChannel'])
    .factory('QRScannerChannel', QRScannerChannel);

  QRScannerChannel.$inject = ['BaseChannel', 'QRScannerChannelConstant'];
  function QRScannerChannel(BaseChannel, QRScannerChannelConstant) {

    //setup and return service
    var diagnosticChannel = {
      pubIsOpenChanged: pubIsOpenChanged,
      subIsOpenChanged: subIsOpenChanged
    };

    return diagnosticChannel;

    ////////////

    function pubIsOpenChanged(isOpen) {
      BaseChannel.pubRootEmit(QRScannerChannelConstant.isOpenChanged, {isOpen: isOpen});
    }

    function subIsOpenChanged($scope, scopeHandler) {
      BaseChannel.subRootEmit(QRScannerChannelConstant.isOpenChanged, $scope, scopeHandler, function (args) {
        return args.isOpen;
      });
    }
  }

})();
