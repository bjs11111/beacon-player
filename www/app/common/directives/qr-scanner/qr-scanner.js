var qrScanner = angular.module('qrScanner', []);


/**
 *  qrScanner Directive 
 **/
qrScanner.directive('sitQrScanner', [ '$ionicPlatform', '$cordovaBarcodeScanner', function($ionicPlatform,   $cordovaBarcodeScanner) {
	  return {
	    restrict: 'E',
	    scope: {
	       successCallback: '&qrSuccessCallback',
	    },
	    //templateUrl: 'app/common/directives/qr-scanner/qr-scanner.html',
	    link: function(scope, element, attrs) {
	    	scope.captureQrCode = function () {
	    		
		    		/*$ionicPlatform.ready(function() {
		    			$cordovaBarcodeScanner
		    			.scan()
		    			.then(function(barcodeData) {
		    			// Success! Barcode data is here
		    				$scope.barcode = barcodeData;
		    			}, function(error) {
		    			// An error occurred
		    				$scope.barcode = 'error while scanning barcode';
		    			});	
		    		});*/
		    	console.log('Asdf'); 
	    		scope.successCallback(); 
	    	};
	    	
	      }
	  }
}]);
