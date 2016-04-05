;
(function () {
  'use strict';


  var diagnosticChannelConstant = {
    isOfflineChanged: 'isOfflineChanged',
    locationEnabledChanged: 'locationEnabledChanged',
    bluetoothEnabledChanged: 'bluetoothEnabledChanged',
    cameraEnabledChanged: 'cameraEnabledChanged',
    wifiEnabledChanged : 'wifiEnabledChanged'
  };

  angular
    .module('prioloc.diagnosticChannel.constant', [])
    .constant("DiagnosticChannelConstant", diagnosticChannelConstant);

})();
