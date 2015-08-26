var qrScanner = angular.module('qrScanner', ['generalServices']);


/**
 *  qrScanner Directive 
 **/
qrScanner.directive('sitQrScanner', [ '$ionicPlatform', '$cordovaBarcodeScanner', '$cordovaFlashlight', 'generalService',
                              function($ionicPlatform,   $cordovaBarcodeScanner,   $cordovaFlashlight,   generalService) {
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
	    		//move this into appState
	    		scope.isQrScannerOpen=false;
	    		scope.isFlashlightOn=false;
	    	}
	    	
	    	//ng-click callback of directive
	    	scope.scannQrCode = function () {
	    		console.log("Open QR Scanner");
	    		if(scope.isQrScannerOpen==false){
	    			scope.isQrScannerOpen=true;
	    			
		    		$ionicPlatform.ready(function() {
		    			
		    			console.log("Open QR Scanner Ready");
		    			//switch flashlight on
		    			$cordovaFlashlight.switchOn()
		    		    .then(
		    		      function (success) { scope.isFlashlightOn=true; console.log("flashlight on success"); },
		    		      function (error) { scope.isFlashlightOn=false; console.log("flashlight on error"); });
		    			
		    			$cordovaBarcodeScanner
		    				.scan()
				    			.then(function(barcodeData) {
				    				scope.isQrScannerOpen=false;
				    				scope.successCallback(barcodeData);
				    				
				    				//switch flashlight off
				    				 $cordovaFlashlight.switchOff()
				    				    .then(
				    				      function (success) { scope.isFlashlightOn=false; console.log("flashlight off sussess"); },
				    				      function (error) {scope.isFlashlightOn=false; console.log("flashlight off error");  });
				    				
				    			}, function(error) {
				    				scope.isQrScannerOpen=false;
				    				scope.errorCallback(error);
				    				
				    				//switch flashlight off
				    				 $cordovaFlashlight.switchOff()
				    				    .then(
				    				      function (success) { scope.isFlashlightOn=false; console.log("flashlight off sussess"); },
				    				      function (error) {scope.isFlashlightOn=false; console.log("flashlight off error");  });
				    			});	
		    		});
	    		}
	    	};
	    	
	    	init();
	      }
	  }
}]);
