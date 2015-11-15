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
			notifiedBeacons = {},
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
			

			//console.log( notifiedBeacons[options.data.bcmsBeaconKey].notified <= ( Date.now() - 10000 )  ); 
			
			if( !notifiedBeacons[options.data.bcmsBeaconKey] || isToNotify(notifiedBeacons[options.data.bcmsBeaconKey]) ) {

				//be sure the phone is ready
				$ionicPlatform.ready(function() {
					notifiedBeacons[options.data.bcmsBeaconKey] = { notified : Date.now(), opened : false };
					//console.log( 'notify: ', JSON.stringify( options.data ) ); 
					$cordovaLocalNotification.schedule(options, scope);
				});
				
			} else {
				
			}
			
			///
			
			function isToNotify(device) {
				
				if(angular.isObject(device)) {
					if(device.notified) {
						if (device.notified <= ( Date.now() - 30000 )) {
							return true;
						}
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
			
			schedule({
			    id: device.bcmsBeaconKey,
			    title: device.bcmsBeacon.contentTitle,
			    text: "Some more text possible here", 
			    //firstAt: monday_9_am,
			    //every: "week",
			    //sound: "app/data/bus_faehrt_ein.mp3",
			    //icon: "app/data/gewista.png",
			    data: { bcmsBeaconKey : device.bcmsBeaconKey }
			});

			 $rootScope.$on('$cordovaLocalNotification:click',
					    function (event, notification, state) {
				 		//console.log('open: ',  JSON.stringify(JSON.decode(notification.data)) );
				 		//notifiedBeacons[notification.data.bcmsBeaconKey].opened = true;
				 		//console.log('notification.data.bcmsBeaconKey', JSON.stringify(notification.data.bcmsBeaconKey) );
				 		
				 		onClickAction();
					    });
			
			
			//console.log('trigger frtom: ', device.bcmsBeaconKey); 
		}

	};

})();