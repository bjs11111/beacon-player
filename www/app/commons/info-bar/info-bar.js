var infoBar = angular.module('infoBar', ['commons.services.generalServices.factory']);


/**
 *  infoBar Directive 
 **/
infoBar.directive('ionInfoBar', [ '$ionicPlatform', '$cordovaBarcodeScanner', 'generalService',
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
	    		scope.content = (scope.content) ? scope.content : "No Internet Connection!";
	    		scope.color =  (color) ? color : 'bar-assertive';
	    	}
	    	
	    	init();
	      }
	  }
}]);
