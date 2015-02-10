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
	refreshBeaconListInterval 	: 1000 * 30,
	msBeforeBeaconIsOld : 1000 * 10,
})

.controller('AppCtrl', 
							['$scope', '$rootScope', 'BackgroundProcessConfig', 'ngBleStateConfig', 'bleNotificationChannel',  '$ionicPlatform', '$ionicPopup', '$cordovaBLE', '$cordovaEvothingsBLE', 'bcmsAjaxService', '$interval', 
                     function($scope,   $rootScope,   BackgroundProcessConfig,   ngBleStateConfig,   bleNotificationChannel,    $ionicPlatform,   $ionicPopup,   $cordovaBLE,   $cordovaEvothingsBLE,   bcmsAjaxService,   $interval) {

	/*show alert with information to check inet connection
	 * set closeOnOffline to true closes app after press alert button 
	 * */	
	$scope.alertEnsureInetConnection = function( forceOpen, forceCloseApp ) {
		
		forceOpen = (forceOpen)?true:false;
		forceCloseApp = (forceCloseApp)?true:false;
	
		//if alert inert not notified jet or forceOpen is true
		if (!$scope.allreadyNotifiedNoInte || forceOpen) {
				//if triggered again will not open 
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
									
									if(forceCloseApp) 
									{ ionic.Platform.exitApp(); }
								});
				}
	};
	
	//start refreshes serverdata every x ms
	$scope.refreshServerData = function (triggeredFrom) {
			//console.log('APPTEST: on refreshServerData triggered from '+triggeredFrom);
			//add then to do something on finieh
			bcmsAjaxService.refreshBeaconList().then(function () {
				//Stop the ion-refresher from spinning
				//console.log('refreshServerData'); 
			    $scope.$broadcast('scroll.refreshComplete');
			}, function() {
				//if request fails close pukll to refresh
				 $scope.$broadcast('scroll.refreshComplete');
			}); 
	};
	
	
	//start scanning if ble scanner is not scanning
	$scope.startBleScanning = function(triggeredFrom) {
		
		$ionicPlatform.ready(function() {
			//console.log('APPTEST: on startBleScanning triggered from '+triggeredFrom);
			$cordovaEvothingsBLE.startScanning();
		});
		
	};
	//stop scanning if ble scanner is scanning
	$scope.stopBleScanning = function(triggeredFrom) {
			$ionicPlatform.ready(function() {
				//console.log('APPTEST: on stopBleScanning triggered from '+triggeredFrom);
				$cordovaEvothingsBLE.stopScanning();
			});
	};
	
	$scope.updateListLength = function() {
		var i = 0;
		for (key in $scope.receivedDevicesList) {
			i++; 
		}
		//used in view
		$scope.listLength = i;
	};
	
	//start interval for cleaning old devices
	$scope.startcleaningOldDevicesinterval = function (interval) {
		//console.log('APPTEST: on startcleaningOldDevicesinterval');
		if(!$scope.cleaningOldDevicesintervalPromise) cleaningOldDevicesintervalPromise = $interval(function() {
				for (key in $scope.receivedDevicesList) {
					if($scope.receivedDevicesList[key].scanData.lastScan < Date.now() -  interval) {
						delete $scope.receivedDevicesList[key];
					} 
				}
				$scope.updateListLength();
			}, interval);
	};
	//stopt interval for cleaning old devices
	$scope.stopcleaningOldDevicesinterval = function () {
		if($scope.cleaningOldDevicesintervalPromise) {
			$interval.cancel(intervalPromise);
			$scope.cleaningOldDevicesintervalPromise = undefined;
		}
	};
	
	// dis or enabel ble start stop button
	$scope.setBleDisabledState = function(value) {
		//console.log('APPTEST: on setBleDisabledState');
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
		
		//notifacation states
		$scope.allreadyNotifiedNoInte = false;
		$scope.allreadyNotifiedNoBle = false;
		//scannerbutton state
		$scope.bleDisabledState = false;
		
		$scope.receivedDevicesList = {};
		$scope.listLength = 0;
		
		//for interval
		$scope.cleaningOldDevicesintervalPromise = undefined;

		//iabState
		$rootScope.iabIsOpen = false;
				
		//on inet offline
		$ionicPlatform.on('offline', function(){ 
			console.log('APPTEST: on offline');
			//alert inet offline
			$scope.alertEnsureInetConnection();
		});
		
		//on inet online
		//NOTICE this event fires only on "resume online" so we have to init server loop manually in inti()
		$ionicPlatform.on('online', function(){ 
			console.log('APPTEST: on online');
			
			//start server loading loops
			$scope.refreshServerData('online');
		});
		
		//@TODO on ble off or error
		//bleNotificationChannel.onBleStartScanError($scope, function () { $scope.alertEnsureBleConnection(); }); 
		
		//on app resume
		$ionicPlatform.on('resume', function(){
			console.log('APPTEST: on resume');
			//alert inert shows up if triggered
			$scope.allreadyNotifiedNoInte = false;
			
			$scope.refreshServerData('onInit');
			//start all loops
			//console.log('APPTEST:$rootScope.iabIsOpen: '+$rootScope.iabIsOpen);
			if(!$rootScope.iabIsOpen) {
				//start all loops
				$scope.startBleScanning('onResume');
				$scope.startcleaningOldDevicesinterval(BackgroundProcessConfig.msBeforeBeaconIsOld);
			} 
		});
		
		//on app paused
		$ionicPlatform.on('pause', function(){
			console.log('APPTEST: on pause'); 
			//stop scanning
			$scope.stopBleScanning('onPause');
			$scope.stopcleaningOldDevicesinterval();
		});
				
		//init data and start scanning
		$scope.refreshServerData('onInit');
		$scope.startBleScanning('onInit');
		$scope.startcleaningOldDevicesinterval(BackgroundProcessConfig.msBeforeBeaconIsOld);
	};
	
	init();					
	
}]);













