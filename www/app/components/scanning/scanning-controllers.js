/* Controllers of start component */
var scanningControllers = angular.module('scanningControllers', []);


/*Config for scanning controllers*/
scanningControllers.constant("scanningCtrlConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
	iabOpenVibrateTime : 100,

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
});

/*Scanning controller*/
scanningControllers.controller('scanningCtrl', 
				[ '$scope', 
         function(  $scope) {


}]);