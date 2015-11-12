;(function() {
	'use strict';

	/**
	 * NotificationChannel Module
	 */
	angular.module('commons.services.localNotificationsManager.factory', ['ngCordova'])
		   .factory('localNotificationsManager', localNotificationsManager); 

	/**
	 * Manually identify dependencies for minification-safe code
	 * 
	 **/
	localNotificationsManager.$inject = ['$rootScope','$state','$filter','$ionicPlatform','bleDeviceChannel','bleDeviceService', '$cordovaLocalNotification'];
	
	/**
	 * The function holds the logic for local notifications
	 * 
	 **/
	function localNotificationsManager($rootScope,$state,$filter,$ionicPlatform, bleDeviceChannel,bleDeviceService, $cordovaLocalNotification) {
		
		//
		var scope = $rootScope.$new(), 
			scannedBeaconsWithContent = {},
			bcmsBeaconKeyToObjFilter = $filter('bcmsBeaconKeyToObj'),
			onClickAction = function() {
				$state.go('app.tour');
			};
		
		//
		var NotificationChannelService = {
				schedule : schedule,
				setOnclickAction : setOnclickAction
		};
		
		//subscriptions
		
		bleDeviceChannel.subEnteredTriggerArea(scope, subEnteredTriggerHandler);
		
       
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
			//be shure the phone is ready
			$ionicPlatform.ready(function() {
				$cordovaLocalNotification.schedule(options, scope);
			});
		};
		
		/**
		 * subEnterTriggerHandler
		 * 
		 * 
		 */
		function subEnteredTriggerHandler(device) {
			
			schedule({
			    id: 1,
			    title: device.bcmsBeacon.contentTitle,
			    text: "Some more text possible here", 
			    //firstAt: monday_9_am,
			    //every: "week",
			    //sound: "file://sounds/reminder.mp3",
			    //icon: "http://icons.com/?cal_id=1",
			    data: { bcmsBeaconKey:device.bcmsBeaconKey }
			});

			 $rootScope.$on('$cordovaLocalNotification:click',
					    function (event, notification, state) {
				 		//console.log('event', JSON.stringify(event) );
				 
				 		console.log('notification.data.bcmsBeaconKey', JSON.stringify(notification.data.bcmsBeaconKey) );
				 		
				 		onClickAction();
					    });
			
			
			console.log('trigger frtom: ', device.bcmsBeaconKey); 
		}

	};

})();