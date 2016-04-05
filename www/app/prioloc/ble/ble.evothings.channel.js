;
(function () {
  'use strict';

  angular.module('prioloc.ble.evothings.channel', ['prioloc.ble.evothingsChannel.constant', 'commons.baseChannel'])
    .factory('EvothingsChannel', EvothingsChannel);

  EvothingsChannel.$inject = ['BaseChannel', 'EvothingsChannelConstant'];
  function EvothingsChannel(BaseChannel, EvothingsChannelConstant) {

    //setup and return service
    var evothingChannel = {
      pubScanningStateChangedChanged: pubScanningStateChangedChanged,
      subScanningStateChangedChanged: subScanningStateChangedChanged,

      pubScannedDeviceChanged: pubScannedDeviceChanged,
      subScannedDeviceChanged: subScannedDeviceChanged
    };

    return evothingChannel;

    ////////////

    function pubScanningStateChangedChanged(state) {
      BaseChannel.pubRootEmit(EvothingsChannelConstant.scannerStateChanged, {state: state});
    }

    function subScanningStateChangedChanged($scope, scopeHandler) {
      BaseChannel.subRootEmit(EvothingsChannelConstant.scannerStateChanged, $scope, scopeHandler, function (args) {
        return args.state;
      });
    }

    function pubScannedDeviceChanged(deviceData) {
      BaseChannel.pubRootEmit(EvothingsChannelConstant.scannedDevice, {deviceData: deviceData});
    }

    function subScannedDeviceChanged($scope, scopeHandler) {
      BaseChannel.subRootEmit(EvothingsChannelConstant.scannedDevice, $scope, scopeHandler, function (args) {
        return args.deviceData;
      });
    }

  }

})();
