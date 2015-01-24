/* Controllers of start component */
//______________________________________________________________________________________

var ngCordovaBle = angular.module('ngCordovaBle', ['ngCordova']);



ngCordovaBle
var me = new NetworkConnection();
var timerId = null;
var timeout = 500;
channel.createSticky('onCordovaConnectionReady');
channel.waitForInitialization('onCordovaConnectionReady');
channel.onCordovaReady.subscribe(function() {
me.getInfo(function(info) {
me.type = info;
if (info === "none") {
// set a timer if still offline at the end of timer send the offline event
timerId = setTimeout(function(){
cordova.fireDocumentEvent("offline");
timerId = null;
}, timeout);
} else {
// If there is a current offline event pending clear it
if (timerId !== null) {
clearTimeout(timerId);
timerId = null;
}
cordova.fireDocumentEvent("online");
}
// should only fire this once
if (channel.onCordovaConnectionReady.state !== 2) {
channel.onCordovaConnectionReady.fire();
}
},





/* othe Scanning Controllers */
ngCordovaBle.service( 'TESTBLECTRL', 
				['$scope', '$cordovaBLE',
         function( $scope,  $cordovaBLE ) {

      	 
      	$ionicPlatform.ready(function() {
      		
      		var onDiscoverDevice = function(device) {
          		console.log('APPTEST on device found'); 
          		console.log(JSON.stringify(device));
    		}
      		
      		//check ble is on or off
	      	$cordovaBLE.isEnabled().then(
	      			function(state) {
			      		console.log('APPTEST isEnabled success:' + state ); 
			      		return true;
			  		},
			  		function(error) {
			      		console.log('APPTEST isEnabled error:' + error);
			      		return true;
			  		}
	      	);
	      
	      	
	      	/*scan params*/
	        //services: List of services to discover, or [] to find all devices
	        //seconds: Number of seconds to run discovery
	        //success: Success callback function that is invoked with a list of bonded devices.
	        //failure: Error callback function, invoked when error occurs. [optional]
	      	/*console.log('APPTEST before startscan');
	      	// [] => scann all devices
	      	// 5 => scan for 5 seconds
	      	$cordovaBLE.scan([],5)
  			.then(
      			//success
      			function(bondedDevices) {
      				console.log('APPTEST scan success'); 
      				console.log(bondedDevices); 
		  		},
		  		//error
		  		function(failure) {
		  			//error => scan returns failure
		  			console.log('APPTEST failure:' + failure); 
		  		}
  			);
	      	console.log('APPTEST after start scan');*/
      	 });
      	

}]);

