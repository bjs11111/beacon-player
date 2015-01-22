var appControllers = angular.module('app.controllers', ['ngCordova']);

/* App Controllers 
 * This controller holds general logic for all app.* controlers
 * 
 * Docs:
 * http://ionicframework.com/docs/api/service/$ionicPlatform/
 * http://ionicframework.com/docs/api/service/$ionicPopup/#alert
 * http://ionicframework.com/docs/api/utility/ionic.Platform/
 * 
 * */


appControllers.controller('AppCtrl', 
							['$scope', 'ngBleStateConfig', '$cordovaNetwork', '$ionicPlatform', '$ionicPopup', '$cordovaEvothingsBLE',
                     function($scope,   ngBleStateConfig,   $cordovaNetwork,   $ionicPlatform,   $ionicPopup,   $cordovaEvothingsBLE) {

	/*show alert with information to check inet connection
	 * set closeOnOffline to true closes app after press alert button 
	 * */	
	var alertEnsureInetConnection = function(closeOnOffline) {
			console.log('ensureInetConnection'); 
		if (!$scope.allreadyNotifiedNoInte) {
				$scope.allreadyNotifiedNoInte = true;
		
				//let alert pop up with given settings
				var noInetAlert =	$ionicPopup.alert({
					   title	: 'No internet',
					   template	: 'Pleas turn on your internet connection and try again!',
					   okType	: 'button-energized'
					 });
				
				//actions after press okButton
				noInetAlert.then( function(result) {
									noInetAlert.close();
									
									if(closeOnOffline) 
									{ ionic.Platform.exitApp(); }
								});
			}
		
	}
	
	var init = function () {
		
		$scope.headerTitle = 'Title from AppCtrl';
		
		$scope.allreadyNotifiedNoInte = false;
		
		$scope.bleDisabledState = false;

		//on app offline
		//http://ionicframework.com/docs/api/service/$ionicPlatform/
		//https://cordova.apache.org/docs/en/edge/cordova_events_events.md.html#Events
		$ionicPlatform.on('offline', function(){ 
			alertEnsureInetConnection();
		});
		
		//on app resume
		//http://ionicframework.com/docs/api/service/$ionicPlatform/
		//https://cordova.apache.org/docs/en/edge/cordova_events_events.md.html#Events
		$ionicPlatform.on('resume', function(){
			
			//check inet manualy
			$ionicPlatform.ready(function() {
				if($cordovaNetwork.isOffline()) {
					//to be shure the alert opens set allreadyNotifiedNoInte to false
					$scope.allreadyNotifiedNoInte = false;
					
					alertEnsureInetConnection();
				}
			});
			
			//stop scanning if ble scanner is scanning
			if( !$cordovaEvothingsBLE.getBleScannerState() ) {
				$cordovaEvothingsBLE.startScanning();
			} 
			
		});
		
		$ionicPlatform.on('pause', function(){
			
			//stop scanning if ble scanner is scanning
			if( $cordovaEvothingsBLE.getBleScannerState() ) {
				$cordovaEvothingsBLE.stopScanning();
			} 
			
		});
		
		//on view changes
		$scope.$on('$stateChangeStart', 
				function(event, toState, toParams, fromState, fromParams){ 		
				
		});
		
		//@TODO check if there is a better place for that
		//for now i go with following:
		//this code decides for every child view the actual scanner state, 
		//so it is a general business logic and so it goes in this controller
		$scope.setBleDisabledState = function(value) {
			wantToDisable = (value === true)?true:false;
			//if we wand to disable the scanner
			if(wantToDisable && $cordovaEvothingsBLE.getBleScannerState() ) {
				$cordovaEvothingsBLE.stopScanning();
			} 
			$scope.bleDisabledState = value;
		};
	};
	
	init();					
	
}]);













