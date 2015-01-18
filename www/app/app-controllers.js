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
	$scope.bleDisabledState = false;
	//console.log('app bleDisabledState: '+ $rootScope.bleDisabledState); 
	
	//@TODO check if there is a better place for that
	//for now i go with following:
	//this code decides for every child view the scanner state, 
	//so it is a general business logic and so it goes in the parent controller
	
	$scope.setBleDisabledState = function(value) {
		wantToDisable = (value === true)?true:false;
		//if we wand to disable the scanner
		if(wantToDisable && $cordovaEvothingsBLE.getBleScannerState() ) {
			$cordovaEvothingsBLE.stopScanning();
		} 
		$scope.bleDisabledState = value;
	};
	
	$scope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){ 
			
		//console.log(toState.name.indexOf("app.profile")); 
			if(		toState.name.indexOf("app.start") != -1
				||	toState.name.indexOf("app.profile") != -1 ) 
			{
				console.log("app.profile"); 
				$scope.setBleDisabledState(true);
			}
			
			if(		toState.name.indexOf("app.bluespace") != -1
				||	toState.name.indexOf("app.settings") != -1 ) 
			{
				$scope.setBleDisabledState(false);
			}
			
			//console.log('AppCtrl $stateChangeStart  $rootScope.bleDisabledState: '+ $scope.bleDisabledState); 
		});
	
	
	
	/*
	 * @TODO remove when publish
	 * Testing function
	 * */						
	var ensureFakeInetConnection = function() {
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
								
	var ensureInetConnection = function() {
		$ionicPlatform.ready(function() {
			if($cordovaNetwork.isOffline()) {
				//let alert pop up with given settings
				var noInetAlert =	$ionicPopup.alert({
					   title	: 'No internet',
					   template	: 'Pleas turn on your internet connection and try again!',
					   okType	: 'button-energized'
					 });
				//actions after press okButton
				noInetAlert.then(
						function(result) {
						 noInetAlert.close();
						 ionic.Platform.exitApp();
						});
			}
		});
	}
	
	var init = function () {
		$scope.headerTitle = 'Title from AppCtrl';
		//ensureInetConnection();
		//@TODO remove when publish and decomment above function
		ensureFakeInetConnection();
	};
	
	init();					
	
}]);













