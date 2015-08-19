var qrScanner = angular.module('qrScanner', ['generalServices']);


/**
 *  qrScanner Directive 
 **/
qrScanner.directive('ionInfoBar', [ '$ionicPlatform', '$cordovaBarcodeScanner', 'generalService',
                              function($ionicPlatform,   $cordovaBarcodeScanner,   generalService) {
	  return {
	    restrict: 'E',
	    replace:true,
	    scope: {
	    	content		: '=?content',
	    	visible		: '=?visible',
	    	duration 	: '=?duration',
	    	color 		: '=?color',
	    },
	    templateUrl: 'app/common/directives/info-bar/info-bar.html',
	    link: function(scope, element, attrs) {
	        	
	    	var init = function() {
	    		scope.content = (scope.content) ? scope.content : "App is in offline mode";
	    		scope.color =  (color) ? color : 'bar-assertive';
	    	}
	    	
	    	init();
	      }
	  }
}]);
