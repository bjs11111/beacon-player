/* Controllers of tour component */
//______________________________________________________________________________________

var tourControllers = angular.module('tourControllers', []);

/* Tour Controllers Config*/
tourControllers.constant("tourCtrlConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
	iabOpenVibrateTime : 100,

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
});

/* Tour Controllers */
tourControllers.controller( 'tourCtrl', [ '$scope',
		function($scope) {
	
	
		$scope.receivedDevicesList={};
		
		
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1']={scanData :{}};
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].scanData.rssi=-65;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon={};
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.uuid="699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.major=1;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.minor=1;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.content_title="Beacon1";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.contentThumbnailUrl="http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.triggerZone="Near";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].sort=20;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeaconKey=
				$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.uuid + "." + 
				$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.major + "." + 
				$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.minor;
				
		
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2']={scanData :{}};
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2'].scanData.rssi=-75;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2'].bcmsBeacon={};
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2'].bcmsBeacon.uuid="699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2'].bcmsBeacon.major=1;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2'].bcmsBeacon.minor=2;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2'].bcmsBeacon.content_title="Beacon2";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2'].bcmsBeacon.contentThumbnailUrl="http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2'].bcmsBeacon.triggerZone="Far";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].sort=10;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeaconKey=
			$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.uuid + "." + 
			$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.major + "." + 
			$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.minor;
		
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3']={scanData :{}};
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3'].scanData.rssi=-75;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3'].bcmsBeacon={};
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3'].bcmsBeacon.uuid="699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3'].bcmsBeacon.major=1;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3'].bcmsBeacon.minor=3;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3'].bcmsBeacon.content_title="Beacon3";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3'].bcmsBeacon.contentThumbnailUrl="http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3'].bcmsBeacon.triggerZone="Intermediate";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].sort=8;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeaconKey=
			$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.uuid + "." + 
			$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.major + "." + 
			$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.minor;
		
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4']={scanData :{}};
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4'].scanData.rssi=-75;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4'].bcmsBeacon={};
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4'].bcmsBeacon.uuid="699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4'].bcmsBeacon.major=1;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4'].bcmsBeacon.minor=4;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4'].bcmsBeacon.content_title="Beacon4";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4'].bcmsBeacon.contentThumbnailUrl="http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4'].bcmsBeacon.triggerZone="Far";
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].sort=7;
		$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeaconKey=
			$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.uuid + "." + 
			$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.major + "." + 
			$scope.receivedDevicesList['699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1'].bcmsBeacon.minor;
		

}]);