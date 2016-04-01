var bleState = angular.module('bleState', ['bleChannels', 'bleScanners']);

/*Constants for the bleState*/
bleState.constant("bleStateConfig", {
    	bleDisabledClass 	: 'ble-disabled',
    	blePausedClass 		: 'ble-paused',
    	bleScanningClass 	: 'ble-scanning',
});

/* BleState Directive 
 * it handles the dis- and enabling of the bleScanner 
 * if enabled it offers onClick start stop bleScanning functionality
 * */
bleState.directive('sitBleState', function() {
	  return {
	    restrict: 'E',
	    replace:true,
	    templateUrl: 'app/common/directives/ble-state/ble-state.html',
	    controller: ['$scope', 'bleStateConfig', 'bleScannerChannel', 'sitBleScanner',
	        function( $scope,   bleStateConfig,   bleScannerChannel,   sitBleScanner) {
	    		
		    	var init = function() {
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
	     	
		     	var onBleScannerStateUpdatedHandler = function(newState) {
		     		$scope.state = sitBleScanner.getBleScannerState();
		     	};
		     	
		     	//provide stateClas in view
		    	$scope.getStateClass = function() {
		    		return $scope.bleDisabledState ? bleStateConfig.bleDisabledClass : ( $scope.state?bleStateConfig.bleScanningClass : bleStateConfig.blePausedClass );
		    	}
	
		    	$scope.toggleState = function() {	
		    		
		    		//if bleDisabledState is disabled (set in AppCtrl) then scip
		    		//if($scope.bleDisabledState) {return;}
		    		
		    		if(!sitBleScanner.getBleScannerState()){ 
		    			sitBleScanner.startScanning(); }
		    		else { sitBleScanner.stopScanning(); }
		        };
		        
		        init();

	    }],
	   /* link: function (scope, element, attrs) {
	    	
        }*/
	  }
});