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
	
	

		$scope.receivedDevicesList=[
		                            {	bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1",
		                            	contentTitle:"Beacon1",
		                            	contentThumbnailUrl:"http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF",
		                            	uuid:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
		                            	major:1,
		                            	minor:1,		                            	
		                            	triggerZone:"Near",
		                            	rssi:-65,
		                            	sort:4
		                            },
		                            {	bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.2",
		                            	contentTitle:"Beacon2",
		                            	contentThumbnailUrl:"http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF",
		                            	uuid:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
		                            	major:1,
		                            	minor:2,		                            	
		                            	triggerZone:"Intermediate",
		                            	rssi:-65,
		                            	sort:2
		                            },
		                            {	bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.3",
		                            	contentTitle:"Beacon3",
		                            	contentThumbnailUrl:"http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF",
		                            	uuid:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
		                            	major:1,
		                            	minor:3,		                            	
		                            	triggerZone:"Near",
		                            	rssi:-65,
		                            	sort:3
		                            },
		                            {	bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.4",
		                            	contentTitle:"Beacon4",
		                            	contentThumbnailUrl:"http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF",
		                            	uuid:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
		                            	major:1,
		                            	minor:4,		                            	
		                            	triggerZone:"Near",
		                            	rssi:-65,
		                            	sort:1
		                            },
		
		
		];

}]);