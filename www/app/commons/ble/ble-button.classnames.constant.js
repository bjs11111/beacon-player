;(function () {
  'use strict';

  var BLEButtonClassnameConstant = {
      bleEnabledClass 	: 'ble-enabled',
      bleDisabledClass 	: 'ble-disabled',
      blePausedClass 		: 'ble-paused',
      bleScanningClass 	: 'ble-scanning'
  };

  angular
    .module('commons.ble-button.classnames.constant', [])
    .constant("BLEButtonClassnameConstant", BLEButtonClassnameConstant);

})();
