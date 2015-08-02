/* Controllers of settings component */
//______________________________________________________________________________________

var qrScannerControllers = angular.module('qrScannerControllers', ['ngCordova']);

/* qrScanne Controllers */
qrScannerControllers.controller('qrScannerCtrl', 
		['$scope','$ionicPlatform', '$cordovaBarcodeScanner', 
 function($scope, $ionicPlatform, $cordovaBarcodeScanner) {
 	
	$scope.qrScaner = {};	
 
	$scope.scannQrCode = function () {
		$ionicPlatform.ready(function() {
			$cordovaBarcodeScanner
				.scan()
	    			.then(function(barcodeData) {
	    				 console.log('qr-scann success: ', JSON.stringyfy(barcodeData) ); 
	    			}, function(error) {
	    				console.log('qr-scann success: ', JSON.stringyfy(error) ); 
	    			});	
		});
};

	
 	
    var init = function() {
    	console.log('init alertsControllers');	
	};
	
	init();
 	
	
}]);
