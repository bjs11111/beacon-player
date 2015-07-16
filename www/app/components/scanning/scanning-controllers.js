/* Controllers of start component */
var scanningControllers = angular.module('scanningControllers', ['bleScanners', 'bleChannels']);


/*Config for scanning controllers*/
scanningControllers.constant("scanningCtrlConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
	iabOpenVibrateTime : 100,

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
});

/*Scanning controller*/
scanningControllers.controller('scanningCtrl', 
				[ '$scope', 'sitBleScanner', 'bleScannerChannel',
         function(  $scope,  sitBleScanner, bleScannerChannel) {

					bleScannerChannel.publishBleScannerStateUpdated($scope, function(args) {
						console.log(sitBleScanner.bleStream); 
					});
					
					
					var subscription = sitBleScanner.bleStream.subscribe(
						    function (rawDevice) {
						        console.log('Next: ' + rawDevice);
						    },
						    function (err) {
						        console.log('Error: ' + err);
						    },
						    function () { 
						        console.log('Completed');
						    });
					console.log('BLETEST: ');
					
}]);