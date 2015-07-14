/* Controllers of start component */
//______________________________________________________________________________________

var scanningControllers = angular.module('scanningControllers', []);



scanningControllers
/*Config for scanning controllers*/
.constant("scanningCtrlConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
	iabOpenVibrateTime : 100,

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
})

/*Scanning controller*/
scanningControllers.controller( 'scanningCtrl', 
				[ '$scope', 
         function(  $scope) {


}]);