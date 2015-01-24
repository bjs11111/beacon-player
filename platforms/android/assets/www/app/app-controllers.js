var appControllers = angular.module('app.controllers', [ 'ngCordova', 'bleDirectives', 'bcmsServices']);

/* 
 * 
 * App Controllers 
 * This controller holds general logic for all app.* controlers
 * 
 * Docs:
 * http://ionicframework.com/docs/api/service/$ionicPlatform/
 * http://ionicframework.com/docs/api/service/$ionicPopup/#alert
 * https://cordova.apache.org/docs/en/edge/cordova_events_events.md.html#Events
 * http://jonathancreamer.com/adding-clarity-to-scope-inheritance-in-angular/
 * */


appControllers
.constant("BackgroundProcessConfig", {
	//refreshBeaconListInterval		: ms
	refreshBeaconListInterval 	: 1000 * 5,
})

.controller('AppCtrl', 
							['$scope', '$rootScope', 'BackgroundProcessConfig', 'ngBleStateConfig', 'bleNotificationChannel', '$cordovaNetwork', '$ionicPlatform', '$ionicPopup', '$cordovaEvothingsBLE', 'bcmsAjaxService', '$interval', 
                     function($scope,   $rootScope,   BackgroundProcessConfig,   ngBleStateConfig,   bleNotificationChannel,   $cordovaNetwork,   $ionicPlatform,   $ionicPopup,   $cordovaEvothingsBLE,   bcmsAjaxService,   $interval) {

	/*show alert with information to check inet connection
	 * set closeOnOffline to true closes app after press alert button 
	 * */	
	var alertEnsureInetConnection = function(closeOnOffline) {
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
	};
	
	/*show alert with information to check ble connection
	 * set closeOnOffline to true closes app after press alert button 
	 * */
	var alertEnsureBleConnection = function(closeOnOffline) {
		if (!$scope.allreadyNotifiedNoBle) {
			
			$scope.allreadyNotifiedNoBle = true;
	
			//let alert pop up with given settings
			var noBleAlert =	$ionicPopup.alert({
				   title	: 'No Bluetooth enabled',
				   template	: 'Pleas turn on your bluethooth and try again!',
				   okType	: 'button-energized'
				 });
			
			//actions after press okButton
			noBleAlert.then( function(result) {
								noBleAlert.close();
								
								if(closeOnOffline) 
								{ ionic.Platform.exitApp(); }
							});
			}
	};
	
	//start refreshes serverdata every x ms
	$scope.startRefreshingLoop = function (triggeredFrom) {
		if($scope.isRefreshingBeaconList === false) {
			console.log('APPTEST: on startRefreshingLoop triggered from '+triggeredFrom);
			bcmsAjaxService.refreshBeaconList(); 
			$scope.isRefreshingBeaconList = $interval( 
					function() { bcmsAjaxService.refreshBeaconList(); console.log('APPTEST: on refreshBeaconList'); }, 
					BackgroundProcessConfig.refreshBeaconListInterval
			);
		}
	};
	//stop refreshing serverdata
	$scope.stopRefreshingLoop = function (triggeredFrom) {
		if($scope.isRefreshingBeaconList !== false) {
			console.log('APPTEST: on stopRefreshingLoop triggered from '+triggeredFrom);
			$interval.cancel($scope.isRefreshingBeaconList);
		 	$scope.isRefreshingBeaconList = false;
		}
	};
	
	//start scanning if ble scanner is not scanning
	$scope.startBleScanning = function(triggeredFrom) {
		if( !$cordovaEvothingsBLE.getBleScannerState() ) {
			$ionicPlatform.ready(function() {
				console.log('APPTEST: on startBleScanning triggered from '+triggeredFrom);
				$cordovaEvothingsBLE.startScanning();
			});
		} 
	};
	//stop scanning if ble scanner is scanning
	$scope.stopBleScanning = function(triggeredFrom) {
		if( $cordovaEvothingsBLE.getBleScannerState() ) {
			$ionicPlatform.ready(function() {
				console.log('APPTEST: on stopBleScanning triggered from '+triggeredFrom);
				$cordovaEvothingsBLE.stopScanning();
			});
		} 
	};
	
	// dis or enabel ble start stop button
	$scope.setBleDisabledState = function(value) {
		console.log('APPTEST: on setBleDisabledState');
		wantToDisable = (value === true)?true:false;
		//if we wand to disable the scanner
		if(wantToDisable) {
			$scope.stopBleScanning();
		} 
		$scope.bleDisabledState = value;
	};
	
	//intial 
	var init = function () {
		//
		$scope.headerTitle = 'Title from AppCtrl';
		
		//notifacation states
		$scope.allreadyNotifiedNoInte = false;
		$scope.allreadyNotifiedNoBle = false;
		//scannerbutton state
		$scope.bleDisabledState = false;
		
		//loops
		$scope.isRefreshingBeaconList = false;
		
		//list of all beacons in cms
		$scope.beaconList = {};
		//iabState
		$rootScope.iabIsOpen = 0;
				
		//on inet offline
		$ionicPlatform.on('offline', function(){ 
			console.log('APPTEST: on offline');
			//alert inet offline
			alertEnsureInetConnection();
			//stop refreshbeaconlistloop
			$scope.stopRefreshingLoop();
		});
		
		//on inet online
		//@TODO check why this event is not fired
		$ionicPlatform.on('online', function(){ 
			console.log('APPTEST: on online');
			//stop refreshbeaconlistloop
			$scope.startRefreshingLoop();
		});
		
		//on ble off or error
		//bleNotificationChannel.onBleStartScanError($scope, function () { alertEnsureBleConnection(); }); 
		
		//on app resume
		//http://ionicframework.com/docs/api/service/$ionicPlatform/
		//https://cordova.apache.org/docs/en/edge/cordova_events_events.md.html#Events
		$ionicPlatform.on('resume', function(){
			console.log('APPTEST: on resume');
			$scope.allreadyNotifiedNoInte = false;
			//$scope.allreadyNotifiedNoble  = false;
			
			//start all loops
			console.log('APPTEST:$rootScope.iabIsOpen: '+$rootScope.iabIsOpen);
			if(!$rootScope.iabIsOpen) {
				$scope.startBleScanning('onResume');
				$scope.startRefreshingLoop('onResume');
			} 
		});
		
		//on app paused
		$ionicPlatform.on('pause', function(){
			console.log('APPTEST: on pause'); 
			//stop all loops
			$scope.stopBleScanning('onPause')
			$scope.stopRefreshingLoop('onPause');
	
		});
				
		//start all loops
		$scope.startBleScanning('onInit');
		$scope.startRefreshingLoop('onInit');
		
		 
	};
	
	init();					
	
}]);













