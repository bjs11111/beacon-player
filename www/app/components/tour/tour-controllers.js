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
				

}]);