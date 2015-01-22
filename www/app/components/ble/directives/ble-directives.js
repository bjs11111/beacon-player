/*@TODO write documantation*/
var bleDirectives = angular.module('bleDirectives', [])

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
    	         function($scope, ngBleItemConfig) {
    	    	
    	var getCmsStateColor = function() {
    		 
    		if($scope.ngModel.cmsContent != undefined) {
        		return ngBleItemConfig.cmsState.connected.color;
        	}
        	else if($scope.ngModel.cmsBeacon) {
        		return ngBleItemConfig.cmsState.known.color;
        	}
        	else {
        		return ngBleItemConfig.cmsState.unknown.color;
        	}
    	};
    	
    	var getContentTypeIcon = function() {
    		var icon = ngBleItemConfig.contentType.unknown.icon;
    		
    		if($scope.ngModel.cmsContent) {
    			angular.forEach(ngBleItemConfig.contentType, function(obj, i) {
    				if(obj.name ===  $scope.ngModel.cmsContent.type) {
    					icon = obj.icon;
    				}
    			});
        	}
        	
    		return icon;
        	
    	};
    	
    	var getRssiStateColor = function() {
    		var color = ngBleItemConfig.rssiState.notInRange.color;
    		
    		if( $scope.ngModel.scanData.rssi >= -65 ) {
    			color = ngBleItemConfig.rssiState.activeRange.color;
    		} 
    		else if( $scope.ngModel.scanData.rssi < -65 ) {
    			color = ngBleItemConfig.rssiState.inRange.color;
    		}
    		
    		return color;
    	}
    	    	
    	var init = function() {
    		//$scope.itemTypeIcon 		=  ngBleItemConfig.type.beacon.icon;
    		//$scope.cmsStateColor 		= getCmsStateColor();
    		//$scope.contentTypeIcon 	= getContentTypeIcon(); 
    		//$scope.rssiStateColor 	= getRssiStateColor(); 
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
