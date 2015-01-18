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
	/*
	 * @TODO remove when publish
	 * Testing function
	 * */						
	var ensureFakeInetConnection = function(closeOnOffline) {
		//set to flase to prevent alert popup
		var demoIsOfline = false;
		
		$ionicPlatform.ready(function() {
			
			if(demoIsOfline === true) {
				var noInetAlert =	$ionicPopup.alert({
					   title	: 'No internet tesing message',
					   template	: 'Edit the demoNetworkState var in the ensureFakeInetConnection function to true to avoid this alert',
					   okType	: 'button-energized'
					 });
					
					noInetAlert.then(function(result) {
					noInetAlert.close();
					});
			}
		});
	}	
	
	
	/*show alert with information to check inet connection
	 * set closeOnOffline to true closes app after press alert button 
	 * */	
	var ensureInetConnection = function(closeOnOffline) {
			
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
		
		
		//ensureInetConnection(false);
		//@TODO remove when publish and decomment above function
		//ensureFakeInetConnection();
		
		$ionicPlatform.on('offline', function(){ 
			ensureInetConnection();
		});
		
		//on view changes
		$scope.$on('$stateChangeStart', 
				function(event, toState, toParams, fromState, fromParams){ 	
							
					//enure inet on app start
					$scope.allreadyNotifiedNoInte = false;
					/*
					// Disable ble scanner in specific view
					if(		toState.name.indexOf("app.start") != -1) 
					{
						$scope.setBleDisabledState(true);
					} else {
						$scope.setBleDisabledState(false);
					}*/
				});
		
		
		//on app resume
		//http://ionicframework.com/docs/api/service/$ionicPlatform/
		//https://cordova.apache.org/docs/en/edge/cordova_events_events.md.html#Events
		$ionicPlatform.on('resume', function(){
			$scope.allreadyNotifiedNoInte = false;
		});
		
		$scope.allreadyNotifiedNoInte = false;
		
		$scope.bleDisabledState = false;
		//console.log('app bleDisabledState: '+ $rootScope.bleDisabledState); 
		
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













