/*@TODO write documantation*/
var bleDirectives = angular.module('bleDirectives', ['bcmsServices', 'angularMoment'])

/*Constants for the bleDirectives*/
bleDirectives.constant("ngBleStateConfig", {
    	bleDisabledClass 	: 'ble-disabled',
    	blePausedClass 		: 'ble-paused',
    	bleScanningClass 	: 'ble-scanning',
});

bleDirectives.constant("ngBleItemConfig", {
	
	type : {
				beacon : {
					name : 'beacon',
					icon : 'ion-cube'
				},
				content :  {
					name : 'content',
					icon : 'ion-chatbox'
				}
			},
			
	cmsState : {
		unknown : {
			name  : 'unknown',
			color : 'stable'
		},
		known :  {
			name : 'known',
			color : 'dark'
		},
		connected : {
			name : 'connected',
			color : 'positive'
		}
		
	},
	
	contentType : {
			'unknown' 	: {
					name : 'unknown',
					icon : 'ion-record'
						},
			text 		: {
						name : 'text',
						icon : 'ion-document'
						},
			images 		: {
						name : 'images',
						icon : 'ion-images'
					},
			audio 		: {
						name : 'audio',
						icon : 'ion-headphone'
						},
			video 		:  {
						name : 'video',
						icon : 'ion-videocamera'
					}
	},
	
	rssiState : {
		notInRange : {
			name  : 'notInRange',
			color : 'stable'
		},
		inRange :  {
			name : 'inRagne',
			color : 'energized'
		},
		activeRange : {
			name : 'activeRange',
			color : 'balanced'
		},
	}

})

/* BleState Directive 
 * The element is located in the apps navigation header in main.sidemenu.html
 * it handles the dis- and enabling of the bleScanner options and 
 * if enabled it offers onClick start stop bleScanning functionality
 * */
bleDirectives.directive('ngBleState', [ '$cordovaEvothingsBLE', 
                               function($cordovaEvothingsBLE) {
	//@TODO use he ng-model to control deactivation from outside
	  return {
	    restrict: 'EA',
	    template:'<button class="button button-icon ion-radio-waves" ng-click="toggleState()" ng-class="getStateClass()"></button>',
	    controller: ['$scope', 'ngBleStateConfig', 'bleNotificationChannel', 
	        function($scope,   ngBleStateConfig, bleNotificationChannel) {
	    		 
		    	var init = function() {
			    	$scope.state = $cordovaEvothingsBLE.getBleScannerState();
			    	//subscribe for onBleScannerStateUpdated on bleNotificationChannel 
		     		bleNotificationChannel.onBleScannerStateUpdated($scope, onBleScannerStateUpdatedHandler);
		    	};
	     	
		     	var onBleScannerStateUpdatedHandler = function(newState) {
		     		//request new state only if newState is different form actual
		     		if(newState != $scope.bleScannerState) {
		     			$scope.state = $cordovaEvothingsBLE.getBleScannerState();
		     		} 
		     	};
		     	
		     	//provide stateClas in view
		    	$scope.getStateClass = function() {
		    		return $scope.bleDisabledState ? ngBleStateConfig.bleDisabledClass : ( $scope.state?ngBleStateConfig.bleScanningClass : ngBleStateConfig.blePausedClass );
		    	}
	
		    	$scope.toggleState = function() {	
		    		//if bleDisabledState is disabled (set in AppCtrl) then scip
		    		if($scope.bleDisabledState) {return;}
		    		
		    		if(!$cordovaEvothingsBLE.getBleScannerState()){ $cordovaEvothingsBLE.startScanning(); }
		    		else { $cordovaEvothingsBLE.stopScanning(); }
		        };
		        
		        init();

	    }],
	    link: function (scope, element, attrs) {
	    	
        }
	  
	  }
}])

/**/
bleDirectives.directive('ngBleItem', function() {
  return {
    restrict: 'EA',
    require: '^ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'app/components/ble/directives/templates/ble-item.html',
    controller: ['$scope', 'ngBleItemConfig',
    	 function($scope,   ngBleItemConfig) {
    	    	
    	$scope.getCmsStateColor = function(cmsBeacon) {
    		cmsBeacon = (cmsBeacon)?cmsBeacon:$scope.ngModel.bcmsBeacon;
    		
    		if($scope.ngModel.bcmsBeacon != undefined) {
        		return ngBleItemConfig.cmsState.connected.color;
        	}
        	else if($scope.ngModel.cmsBeacon) {
        		return ngBleItemConfig.cmsState.known.color;
        	}
        	else {
        		return ngBleItemConfig.cmsState.unknown.color;
        	}
    	};
    	
    	$scope.getContentTypeIcon = function() {
    		var icon = ngBleItemConfig.contentType.unknown.icon;
    		return icon;
    	};
    	
    	$scope.getRssiStateColor = function(actualTriggerArea) {
    		var color = ngBleItemConfig.rssiState.notInRange.color;
    		//@TODO 
    		if( actualTriggerArea == 'Positive' ) {
    			color = ngBleItemConfig.rssiState.activeRange.color;
    		} 
    		else if( actualTriggerArea == 'Negative' ) {
    			color = ngBleItemConfig.rssiState.inRange.color;
    		}
    		return color;
    	}
    	
    	//@TODO enhanch the bcms data mapping now on every bcms load all items causes watch 
    	$scope.$watch('ngModel.bcmsBeacon', function(newValue, oldValue) {
    		$scope.cmsStateColor = $scope.getCmsStateColor(newValue);
    	});
    	$scope.$watch('ngModel.scanData.actualTriggerArea', function(actualTriggerArea, oldValue) {
    		$scope.rssiStateColor = $scope.getRssiStateColor(actualTriggerArea);
    	});
     	    	
    	var init = function() {
    		$scope.itemTypeIcon 		=  ngBleItemConfig.type.beacon.icon;
    		$scope.cmsStateColor 		=  $scope.getCmsStateColor();
    		$scope.contentTypeIcon 		=  $scope.getContentTypeIcon(); 
    		$scope.rssiStateColor 		=  ngBleItemConfig.rssiState.notInRange.color; 
    	};
    	
    	init(); 
    }]
  	}
});


/*@TODO write documantation + use link*/
bleDirectives.directive('ngBleDevice', function() {
  return {
    restrict: 'EA',
    require: '^ngModel',
    scope: {
        ngModel: '='
    },
	//@TODO set relative path  => http://nozzle.io/devblog/relative-angularjs-modules/
    templateUrl: 'app/components/ble/directives/templates/ble-device.html',
  
  }
});
