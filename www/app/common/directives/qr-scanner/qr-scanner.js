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
	    		//defaults
	    		scope.successCallback = (scope.successCallback) ? scope.successCallback : generalService.qrSuccessCallback;
	    		scope.errorCallback = (scope.errorCallback) ? scope.errorCallback : generalService.qrErrorCallback ;
	    		scope.isQrScannerOpen=false;
	    	}
	    	
	    	//ng-click callback of directive
	    	scope.scannQrCode = function () {
	    		console.log("Open QR Scanner");
	    		if(scope.isQrScannerOpen==false){
	    			scope.isQrScannerOpen=true;
		    		$ionicPlatform.ready(function() {
		    			console.log("Open QR Scanner Ready");
		    			$cordovaBarcodeScanner
		    				.scan()
				    			.then(function(barcodeData) {
				    				scope.isQrScannerOpen=false;
				    				scope.successCallback(barcodeData);
				    			}, function(error) {
				    				scope.isQrScannerOpen=false;
				    				scope.errorCallback(error);
				    			});	
		    		});
	    		}
	    	};
	    	
	    	init();
	      }
	  }
}]);
