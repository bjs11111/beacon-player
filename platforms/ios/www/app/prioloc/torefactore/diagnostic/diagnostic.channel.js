;
(function () {
  'use strict';

  angular.module('prioloc.diagnostic.channel', ['prioloc.diagnosticChannel.constant', 'commons.baseChannel'])
    .factory('DiagnosticChannel', DiagnosticChannel);

  DiagnosticChannel.$inject = ['BaseChannel', 'DiagnosticChannelConstant'];
  function DiagnosticChannel(BaseChannel, DiagnosticChannelConstant) {

    //setup and return service
    var diagnosticChannel = {
      pubIsOfflineChanged: pubIsOfflineChanged,
      subIsOfflineChanged: subIsOfflineChanged,

      pubLocationEnabledChanged: pubLocationEnabledChanged,
      subLocationEnabledChanged: subLocationEnabledChanged,

      pubBluetoothEnabledChanged: pubBluetoothEnabledChanged,
      subBluetoothEnabledChanged: subBluetoothEnabledChanged,

      pubCameraEnabledChanged: pubCameraEnabledChanged,
      subCameraEnabledChanged: subCameraEnabledChanged,

      pubWifiEnabledChanged: pubWifiEnabledChanged,
      subWifiEnabledChanged: subWifiEnabledChanged
    };

    return diagnosticChannel;

    ////////////

    function pubIsOfflineChanged(isOffline) {
      BaseChannel.pubRootEmit(DiagnosticChannelConstant.isOfflineChanged, {isOffline: isOffline});
    }

    function subIsOfflineChanged($scope, scopeHandler) {
      BaseChannel.subRootEmit(DiagnosticChannelConstant.isOfflineChanged, $scope, scopeHandler, function (args) {
        return args.isOffline;
      });
    }

    function pubLocationEnabledChanged(isLocationEnabled) {
      BaseChannel.pubRootEmit(DiagnosticChannelConstant.locationEnabledChanged, {isLocationEnabled: isLocationEnabled});
    }

    function subLocationEnabledChanged($scope, scopeHandler) {
      BaseChannel.subRootEmit(DiagnosticChannelConstant.locationEnabledChanged, $scope, scopeHandler, function (args) {
        return args.isLocationEnabled;
      });
    }

    function pubBluetoothEnabledChanged(isBluetoothEnabled) {
      BaseChannel.pubRootEmit(DiagnosticChannelConstant.bluetoothEnabledChanged, {isBluetoothEnabled: isBluetoothEnabled});
    }

    function subBluetoothEnabledChanged($scope, scopeHandler) {
      BaseChannel.subRootEmit(DiagnosticChannelConstant.bluetoothEnabledChanged, $scope, scopeHandler, function (args) {
        return args.isBluetoothEnabled;
      });
    }

    function pubCameraEnabledChanged(isCameraEnabled) {
      BaseChannel.pubRootEmit(DiagnosticChannelConstant.cameraEnabledChanged, {isCameraEnabled: isCameraEnabled});
    }

    function subCameraEnabledChanged($scope, scopeHandler) {
      BaseChannel.subRootEmit(DiagnosticChannelConstant.cameraEnabledChanged, $scope, scopeHandler, function (args) {
        return args.isCameraEnabled;
      });
    }

    function pubWifiEnabledChanged(isWifiEnabled) {
      BaseChannel.pubRootEmit(DiagnosticChannelConstant.wifiEnabledChanged, {isWifiEnabled: isWifiEnabled});
    }

    function subWifiEnabledChanged($scope, scopeHandler) {
      BaseChannel.subRootEmit(DiagnosticChannelConstant.wifiEnabledChanged, $scope, scopeHandler, function (args) {
        return args.isWifiEnabled;
      });
    }

  }

})();
