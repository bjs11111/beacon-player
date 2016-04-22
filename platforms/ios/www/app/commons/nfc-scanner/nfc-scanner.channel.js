;(function () {
  'use strict';

  angular.module('commons.nfcScanner.channel', ['commons.nfcScannerChannel.constant', 'commons.baseChannel'])
    .factory('NFCScannerChannel', NFCScannerChannel);

  NFCScannerChannel.$inject = ['BaseChannel', 'NFCScannerChannelConstant'];
  function NFCScannerChannel(BaseChannel, NFCScannerChannelConstant) {

    //setup and return service
    var diagnosticChannel = {
      pubIsListeningChanged: pubIsListeningChanged,
      subIsListeningChanged: subIsListeningChanged
    };

    return diagnosticChannel;

    ////////////

    function pubIsListeningChanged(isListening) {
      BaseChannel.pubRootEmit(NFCScannerChannelConstant.isListeningChanged, {isListening: isListening});
    }

    function subIsListeningChanged($scope, scopeHandler) {
      BaseChannel.subRootEmit(NFCScannerChannelConstant.isListeningChanged, $scope, scopeHandler, function (args) {
        return args.isListening;
      });
    }
  }

})();
