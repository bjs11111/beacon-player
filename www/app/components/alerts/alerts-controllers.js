/* Controllers of settings component */
//______________________________________________________________________________________

var alertsControllers = angular.module('alertsControllers', []);

/* alert Controllers */
alertsControllers.controller('alertsCtrl', 
		['$scope','$ionicPopup', 
 function($scope, $ionicPopup) {
 	
	$scope.alerts = {};

	/*
	 * alerts 
	 */

	/*show alert with information to check inet connection
	 * set closeOnOffline to true closes app after press alert button 
	 * */	
	$scope.alerts.alertEnsureInetConnection = function(forceCloseApp) {
		
		forceCloseApp = (forceCloseApp)?true:false;
		
		//let alert pop up with given settings
		var noInetAlert =	$ionicPopup.alert({
			   title	: 'No internet',
			   template	: 'Pleas turn on your internet connection and try again!',
			   okType	: 'button-energized'
		});
		
		//actions after press okButton
		noInetAlert.then( function(result) {
							noInetAlert.close();
							if(forceCloseApp) { ionic.Platform.exitApp(); }
						});
	};
	
	/*show alert with information to check inet connection
	 * set closeOnOffline to true closes app after press alert button 
	 * */	
	$scope.alerts.alertWrongUrl = function(forceCloseApp) {
		
		forceCloseApp = (forceCloseApp)?true:false;
		console.log('ASDFSFD'); 
		//let alert pop up with given settings
		var wrongUrl =	$ionicPopup.alert({
			   title	: 'Wrond QR-Code',
			   template	: 'QR-Code not in system',
			   okType	: 'button-energized'
			 });
		
		//actions after press okButton
		wrongUrl.then( function(result) {
							wrongUrl.close();
							if(forceCloseApp) { ionic.Platform.exitApp(); }
						});
	};
	
 
 	
    var init = function() {
    	console.log('init alertsControllers');	
	};
	
	init();
 	
	
}]);