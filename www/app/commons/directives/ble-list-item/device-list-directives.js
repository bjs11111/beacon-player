var deviceListDirectives = angular.module('deviceListDirectives', ['commons.services.cms.beaconAPIServices'])

deviceListDirectives.constant("ngBleItemConfig", {
	
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


/**/
deviceListDirectives.directive('ngBleItem', function() {
  return {
    restrict: 'EA',
    replace:true,
    require: '^ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'app/common/directives/ble-list-item/ble-device.html',
    controller: ['$scope', 'ngBleItemConfig',
    	 function($scope,   ngBleItemConfig) {
    	    	
    	$scope.getCmsStateColor = function(cmsBeacon) {
    	/*	cmsBeacon = (cmsBeacon)?cmsBeacon:$scope.ngModel.bcmsBeacon;
    		
    		if($scope.ngModel.bcmsBeacon != undefined) {
        		return ngBleItemConfig.cmsState.connected.color;
        	}
        	else if($scope.ngModel.cmsBeacon) {
        		return ngBleItemConfig.cmsState.known.color;
        	}
        	else {
        		return ngBleItemConfig.cmsState.unknown.color;
        	}*/
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
deviceListDirectives.directive('ngBleDevice', function() {
  return {
    restrict: 'EA',
    require: '^ngModel',
    scope: {
        ngModel: '='
    },
	//@TODO set relative path  => http://nozzle.io/devblog/relative-angularjs-modules/
    templateUrl: 'app/common/directives/ble-list-item/ble-device.html',
  
  }
});