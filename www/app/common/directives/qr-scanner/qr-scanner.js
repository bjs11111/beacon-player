var qrScanner = angular.module('qrScanner', ['generalServices']);


/**
 *  qrScanner Directive 
 **/
qrScanner.directive('sitQrScanner', [ '$ionicPlatform', '$cordovaBarcodeScanner', 'generalService',
                              function($ionicPlatform,   $cordovaBarcodeScanner,   generalService) {
	  return {
	    restrict: 'E',
	    replace:true,
	    scope: {
	    	successCallback	: '=?qrSuccessCallback',
	    	errorCallback	: '=?qrErrorCallback'
	    },
	    templateUrl: 'app/common/directives/qr-scanner/qr-scanner.html',
	    link: function(scope, element, attrs) {
	        	
	    	var init = function() {
	    		scope.successCallback = (scope.successCallback) ? scope.successCallback : generalService.qrSuccessCallback;
	    		scope.errorCallback = (scope.errorCallback) ? scope.errorCallback : generalService.qrErrorCallback ;
	    	}
	    	
	    	scope.scannQrCode = function () {
		    		$ionicPlatform.ready(function() {
		    			$cordovaBarcodeScanner
		    			.scan()
		    			.then(function(barcodeData) {
                              console.log(barcodeData);
		    				scope.successCallback(barcodeData);
		    			}, function(error) {
                              console.log(error);
		    				scope.errorCallback(error);
		    			});	
		    		});
	    	};
	    	
	    	init();
	      }
	  }
}]);
