var appControllers = angular.module('app.controllers', [ 'ngCordova', 'bleDirectives', 'bcmsServices']);

/* 
 * App Controllers 
 * This controller holds general logic for all app.* controlers
 * 
 * Docs:
 * http://ionicframework.com/docs/api/service/$ionicPlatform/
 * http://ionicframework.com/docs/api/service/$ionicPopup/#alert
 * http://ionicframework.com/docs/api/utility/ionic.Platform/
 * 
 * */


appControllers

.constant("BackgroundProcessConfig", {
	//refreshBeaconListInterval		: ms
	refreshBeaconListInterval 	: 1000 * 1 * 5,
})

.controller('AppCtrl', 
							['$scope', 'BackgroundProcessConfig', 'ngBleStateConfig', '$cordovaNetwork', '$ionicPlatform', '$ionicPopup', '$cordovaEvothingsBLE', 'bcmsAjaxService', '$interval', 
                     function($scope,   BackgroundProcessConfig,   ngBleStateConfig,   $cordovaNetwork,   $ionicPlatform,   $ionicPopup,   $cordovaEvothingsBLE,   bcmsAjaxService,  $interval) {

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
	
	var startRefreshingLoop = function () {
		
		$scope.isRefreshingBeaconList = $interval( 
					function() { bcmsAjaxService.refreshBeaconList(); }, 
					BackgroundProcessConfig.refreshBeaconListInterval
		);
		
	}
	
	var stopRefreshingLoop = function () {
		 $interval.cancel($scope.isRefreshingBeaconList);
		 $scope.isRefreshingBeaconList = false;
	}
	
	var init = function () {
		
		$scope.headerTitle = 'Title from AppCtrl';
		
		$scope.allreadyNotifiedNoInte = false;
		
		$scope.bleDisabledState = false;
		//list of all beacons in cms
		$scope.beaconList = {};

		//on inet offline
		//http://ionicframework.com/docs/api/service/$ionicPlatform/
		//https://cordova.apache.org/docs/en/edge/cordova_events_events.md.html#Events
		$ionicPlatform.on('offline', function(){ 
			alertEnsureInetConnection();
			//stop refreshbeaconlistloop
			stopRefreshingLoop();
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
			
			//start scanning if ble scanner is not scanning
			if( !$cordovaEvothingsBLE.getBleScannerState() ) {
				$cordovaEvothingsBLE.startScanning();
			} 
			
			//start refreshbeaconlistloop
			startRefreshingLoop();
		});
		
		//on app paused
		$ionicPlatform.on('pause', function(){
			
			//stop scanning if ble scanner is scanning
			if( $cordovaEvothingsBLE.getBleScannerState() ) {
				$cordovaEvothingsBLE.stopScanning();
			} 
			
			//@TODO stop refreshbeaconlistloop
			stopRefreshingLoop();
		});
		
		//on view changes
		$scope.$on('$stateChangeStart', 
				function(event, toState, toParams, fromState, fromParams) { 		
				
		});
		
		//start refreshbeaconlistloop
		bcmsAjaxService.refreshBeaconList();
		startRefreshingLoop();
		
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













