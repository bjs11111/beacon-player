/* Controllers of start component */
//______________________________________________________________________________________

var tourControllers = angular.module('tourControllers', []);



tourControllers
/**/
.constant("tourCtrlConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
	iabOpenVibrateTime : 100,

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
})

/* Scanning Controllers */
scanningControllers.controller( 'tourCtrl', [ '$scope',
		function($scope) {
				

}]);