;
(function () {
  'use strict';

  angular
    .module('prioloc.diagnostic.service', ['prioloc.diagnostic.channel', 'ngCordova'])
    .service('DiagnosticService', DiagnosticService);

  DiagnosticService.$inject = ['$q', '$interval', '$rootScope', 'DiagnosticChannel', '$cordovaNetwork'];
  function DiagnosticService($q, $interval, $rootScope, DiagnosticChannel, $cordovaNetwork) {

    var network = {
        isOffline: false
      },
      watchWifiInterval,
      wifiWatchFrequenz = 1000 * 10,
      wifi = {
        isEnabled: false,
      },
      watchLocationInterval,
      locationWatchFrequenz = 1000 * 2,
      location = {
        isEnabled: false,
      },
      watchBluetoothInterval,
      bluetoothWatchFrequenz = 1000 * 1,
      bluetooth = {
        isEnabled: false,
      },
      watchCameraInterval,
      cameraWatchFrequenz = 1000 * 10,
      camera = {
        isEnabled: false,
      },
      diagnosticPlugin = cordova.plugins.diagnostic;

    var diagnosticService = {
      //network-information
      getIsOffline: getIsOffline,
      //diagnostic
      switchToSettings : diagnosticPlugin.switchToSettings,
      isLocationEnabled: isLocationEnabled,
      switchToLocationSettings: diagnosticPlugin.switchToLocationSettings,
      isBluetoothEnabled: isBluetoothEnabled,
      switchToBluetoothSettings: diagnosticPlugin.switchToBluetoothSettings,
      setBluetoothState: diagnosticPlugin.setBluetoothState,
      isWifiEnabled: isWifiEnabled,
      switchToWifiSettings: diagnosticPlugin.switchToWifiSettings,
      isCameraEnabled: isCameraEnabled,
      switchToMobileDataSettings: diagnosticPlugin.switchToMobileDataSettings,
  };

  init();
  return diagnosticService;

  ///////

  function init() {
    watchOfflineState();
    watchLocationState();
    watchBluetoothState();
    watchCameraState();
    watchWifiState();
  }

  //Network-Information plugin
  function watchOfflineState() {
    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
      network.isOffline = false;
      DiagnosticChannel.pubIsOfflineChanged(network.isOffline);
    });

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
      network.isOffline = true;
      DiagnosticChannel.pubIsOfflineChanged(network.isOffline);
    });
  }

  function getIsOffline() {
    return !!(network.isOffline);
  }

  //Diagnostic plugin
  function isWifiEnabled() {
    console.log('wifi');
    var defered = $q.defer();
    diagnosticPlugin
      .isWifiEnabled(function (isEnabled) {
        wifi.isEnabled = isEnabled;
        DiagnosticChannel.pubWifiEnabledChanged(wifi.isEnabled);
        defered.resolve(wifi.isEnabled);
      },
      defered.reject);
    return defered.promise;
  }

  function isLocationEnabled() {
    var defered = $q.defer();
    diagnosticPlugin
      .isLocationEnabled(function (isEnabled) {
        location.isEnabled = isEnabled;
        DiagnosticChannel.pubLocationEnabledChanged(location.isEnabled);
        defered.resolve(location.isEnabled);
      },
      defered.reject);
    return defered.promise;
  }

  function isBluetoothEnabled() {
    var defered = $q.defer();
    diagnosticPlugin.isBluetoothEnabled(function (isEnabled) {
        bluetooth.isEnabled = isEnabled;
        DiagnosticChannel.pubBluetoothEnabledChanged(bluetooth.isEnabled);
        defered.resolve(bluetooth.isEnabled);
      },
      defered.reject);
    return defered.promise;
  }

  function isCameraEnabled() {
    var defered = $q.defer();
    diagnosticPlugin.isCameraEnabled(function (isEnabled) {
        camera.isEnabled = isEnabled;
        DiagnosticChannel.pubCameraEnabledChanged(camera.isEnabled);
        defered.resolve(camera.isEnabled);
      },
      defered.reject);
    return defered.promise;
  }

  function watchWifiState() {
    watchWifiInterval = $interval(isWifiEnabled, wifiWatchFrequenz);
  }

  function unwatchWifiState() {
    if (typeof watchWifiInterval == "function") {
      $interval.cancel(watchWifiInterval);
    }
  }

  function watchLocationState() {
    watchLocationInterval = $interval(isLocationEnabled, locationWatchFrequenz);
  }

  function unwatchLocationState() {
    if (typeof watchLocationInterval == "function") {
      $interval.cancel(watchLocationInterval);
    }
  }

  function watchBluetoothState() {
    watchBluetoothInterval = $interval(isBluetoothEnabled, bluetoothWatchFrequenz);
  }

  function unwatchBluetoothState() {
    if (typeof watchBluetoothInterval == "function") {
      $interval.cancel(watchBluetoothInterval);
    }
  }

  function watchCameraState() {
    watchCameraInterval = $interval(isCameraEnabled, cameraWatchFrequenz);
  }

  function unwatchCameraState() {
    if (typeof watchCameraInterval == "function") {
      $interval.cancel(watchCameraInterval);
    }
  }

}

})();
