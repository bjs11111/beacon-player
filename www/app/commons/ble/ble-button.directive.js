var bleState = angular.module('commons.ble-button.directive', ['commons.ble-button.classnames.constant', 'prioloc.diagnostic']);

/* BleState Directive
 * it handles the dis- and enabling of the bleScanner
 * if enabled it offers onClick start stop bleScanning functionality
 * */
bleState.directive('bleButton', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/common/ble/ble-button/ble-button.html',
    controller: function ($scope, BLEButtonClassnameConstant) {

      init();

      /*function init() {
        $scope.state = sitBleScanner.getBleScannerState();
        bleScannerChannel.onBleScannerStateUpdated($scope, onBleScannerStateUpdatedHandler);

        document.addEventListener("resume", onResume, false);
        document.addEventListener("pause", onPause, false);
      };

      // Start scanning when App is Resumed
      function onResume() {
        sitBleScanner.startScanning();
        $scope.$apply();
      }

      // Stop scanning when App is in Background
      function onPause() {
        sitBleScanner.stopScanning();
        $scope.$apply();
      }

      var onBleScannerStateUpdatedHandler = function (newState) {
        $scope.state = sitBleScanner.getBleScannerState();
      };

      //provide stateClas in view
      $scope.getStateClass = function () {
        return $scope.bleDisabledState ? BLEButtonClassnameConstant.bleDisabledClass : ( $scope.state ? BLEButtonClassnameConstant.bleScanningClass : BLEButtonClassnameConstant.blePausedClass );
      }

      $scope.toggleState = function () {

        //if bleDisabledState is disabled (set in AppCtrl) then scip
        //if($scope.bleDisabledState) {return;}

        if (!sitBleScanner.getBleScannerState()) {
          sitBleScanner.startScanning();
        }
        else {
          sitBleScanner.stopScanning();
        }
      };*/

    }
  }
});
