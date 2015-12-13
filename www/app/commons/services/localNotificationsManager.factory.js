;(function() {
	'use strict';

	/**
	 * localNotificationsManager Module
	 */
	angular.module('commons.services.localNotificationsManager.factory', ['ngCordova', 'commons.deviceDataManager.channel','commons.filter.bleFilters'])
		   .factory('localNotificationsManager', localNotificationsManager); 

	
	localNotificationsManager.$inject = ['$rootScope','$state','$filter','$ionicPlatform','$cordovaLocalNotification','DeviceDataManagerChannel'];
	function localNotificationsManager(   $rootScope,  $state,  $filter,  $ionicPlatform,  $cordovaLocalNotification,  DeviceDataManagerChannel) {
		
		//
		var scope = $rootScope.$new(), 
			notifiedBeacons = {},
			
			bcmsBeaconKeyToIntFilter = $filter('bcmsBeaconKeyToInt'),
			
			appIsInBackground = false,
			idCount = 0,
			onClickAction = function() {
				$state.go('app.tour');
			};
			
		 //listeners
		/* $rootScope.$on('$cordovaLocalNotification:click',
				    function (event, notification, state) {
			 		//console.log('open: ',  JSON.stringify(JSON.decode(notification.data)) );
			 		//notifiedBeacons[notification.data.bcmsBeaconKey].opened = true;
			 		//console.log('notification.data.bcmsBeaconKey', JSON.stringify(notification.data.bcmsBeaconKey) );
			 		delete notifiedBeacons[notification.data.bcmsBeaconKey];
			 		
				    });*/

		 $rootScope.$on('$cordovaLocalNotification:schedule',
				    function (event, notification, state) {
			 		console.log('scheduled'); 
		 }); 
		 
		 $rootScope.$on('$cordovaLocalNotification:trigger',
				    function (event, notification, state) {
			 		console.log('trigger'); 
		 }); 
		 
		 $rootScope.$on('$cordovaLocalNotification:update',
				    function (event, notification, state) {
			 		console.log('update'); 
		 }); 
		 
		 $rootScope.$on('$cordovaLocalNotification:clear',
				    function (event, notification, state) {
			 		console.log('clear'); 
			 		var decodedNotificationData = JSON.parse(notification.data);
			 		
			 		if(notifiedBeacons[decodedNotificationData.bcmsBeaconKey]) {
			 			notifiedBeacons[decodedNotificationData.bcmsBeaconKey].clearedAt = Date.now();
			 		}
			 		
		 }); 
		 
		 $rootScope.$on('$cordovaLocalNotification:clearall',
				    function (event, notification, state) {
			 		console.log('clearall'); 
		 }); 
		 	 
		 $rootScope.$on('$cordovaLocalNotification:cancel',
				    function (event, notification, state) {
			 		//console.log('open: ',  JSON.stringify(JSON.decode(notification.data)) );
			 		console.log('cancel klicked'); 
			 		var decodedNotificationData = JSON.parse(notification.data);
			 		if(notifiedBeacons[decodedNotificationData.bcmsBeaconKey]) {
			 			notifiedBeacons[decodedNotificationData.bcmsBeaconKey].canceledAt = Date.now();
			 		}
		 }); 
		 
		 $rootScope.$on('$cordovaLocalNotification:cancelall',
				    function (event, notification, state) {
			 		console.log('cancelall'); 
		 }); 
	
		 $rootScope.$on('$cordovaLocalNotification:click',
				    function (event, notification, state) {
			 		console.log('click klicked'); 
			 		var decodedNotificationData = JSON.parse(notification.data);
			 		if(notifiedBeacons[decodedNotificationData.bcmsBeaconKey]) {
			 		notifiedBeacons[decodedNotificationData.bcmsBeaconKey].openedAt = Date.now();
			 		}
			 		onClickAction();
		 }); 
		 
		//on app resume
		$ionicPlatform.on('resume', function() {
			console.log('APPTEST: on resume');
			appIsInBackground = false;
		});
			
		//on app paused
		$ionicPlatform.on('pause', function() {
			console.log('APPTEST: on pause'); 
			appIsInBackground = true;
		});		 
	
		//
		var NotificationChannelService = {
				schedule : schedule,
				setOnclickAction : setOnclickAction
		};
		
		//subscriptions
		//console.log('local not subscriptions'); 
		DeviceDataManagerChannel.subEnteredTriggerArea(scope, subEnteredTriggerHandler);
		
       
        return NotificationChannelService;

        ////////////
        
        function setOnclickAction() {
        	
        }

        /**
		 * schedule
		 * 
		 * subscribe for an event published over $rootScope.$emit(event, args)
	     *
		 * @param 	{String} options 
		 * @param 	{String} scope This param depends to scope of a function that is left out in the ng wrapper we using here.
		 *                   In the original plugin there is a callbackfunction. 
		 *                   see: https://github.com/katzer/cordova-plugin-local-notifications/blob/master/www/local-notification.js#L57
		 *  
		 * 
		 * @return 
		 * 
		**/
		function schedule(options, scope) {

			//if the app runs in background and 
			//the item is not the list or it is in the list and we want to notify the item
			if( ( 	  !notifiedBeacons[options.data.bcmsBeaconKey] || isToNotify(notifiedBeacons[options.data.bcmsBeaconKey])  ) 
					&& appIsInBackground === true
			  ) {

				
				//be sure the phone is ready
				$ionicPlatform.ready(function() {
					notifiedBeacons[options.data.bcmsBeaconKey] = { 
																		id : idCount++,//parstInt(bcmsbeaconKeyToInt(options.data.bcmsBeaconKey) )
																		notified : Date.now(), 
																		openedAt : false, 
																		clearedAt : false,
																		canceledAt : false
																   };
					//set id 
					options.id = options.data.uid;
					$cordovaLocalNotification.schedule(options, scope);
				});
				
		} 
			//////

			function isToNotify(device) {
				var notificationPause = 1000 * 40;
				
				if(!angular.isObject(device)) {
					return false; 
				}
				
				if(	   device.openedAt != false 
					|| device.clearedAt != false) {

						if ( device.notified <= ( Date.now() - notificationPause ) ) {
							//console.log(device.notified, ( Date.now() - notificationPause ) );
							return true;
						}
					}
				
				return false;
			}

		};
		
		/**
		 * subEnterTriggerHandler
		 * 
		 */
		function subEnteredTriggerHandler(device) {
			//console.log( 'JSON.stringify(device)', JSON.stringify(device.bcmsBeacon) ); 

			if('bcmsBeacon' in device) {
				
				if('contentTitle' in device.bcmsBeacon) {

					var bcmsBeaconKeyAsInt = bcmsBeaconKeyToIntFilter(device.bcmsBeaconKey);
					//console.log('bcmsBeaconKeyAsInt', bcmsBeaconKeyAsInt); 
	
					schedule({
					    title : device.bcmsBeacon.contentTitle,
					    text  : "uid: " + bcmsBeaconKeyAsInt, 
					    //firstAt: monday_9_am,
					    //every: "week",
					    //sound: "app/data/bus_faehrt_ein.mp3",
					    //icon: "app/data/gewista.png",
					    data: { bcmsBeaconKey : device.bcmsBeaconKey, uid : bcmsBeaconKeyAsInt }
					});
				}
				
			} 
			else {
				//console.log('no contentTitle forr notification'); 
			}

		}
		

	};

})();