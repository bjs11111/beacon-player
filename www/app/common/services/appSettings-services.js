/* Services */
var appSettingsModule = angular.module('appSettings', []);

appSettingsModule.constant("appSettingsConfig", {
	// Event Names
	autoTriggerStateUpdated 	: 'autoTriggerStateUpdated',
});


// 
appSettingsModule.factory('appSettingsChannel', 
		['$rootScope', 'appSettingsConfig',
function ($rootScope,   appSettingsConfig) {
   
	//private functions
	var _subscribe = function(event, $scope, scopeHandler, mapArgs) {
		//subscribe with rotscope to event and cache unsubscribe function
		var unsubscopeHandler = $rootScope.$on(event, function(event, args) {
			scopeHandler(mapArgs(args));
		 });
		 
		//unsubscribe rootRcope listener after scope destruction
		$scope.$on('$destroy', function() {
			unsubscopeHandler();
		});
	};
	
	var _publish = function(event, args) {
		 $rootScope.$emit(event, args);
	};

   // updateDate is an array of  device.address => true
   var pubAutoTriggerStateUpdated = function (newState) {
	   console.log('pubAutoTriggerStateUpdated' + Date.now(), newState);
	   _publish(appSettingsConfig.getAllBeaconsSuccess, {newState : newState});
   };
   // subscribe to knownDevices updated notification
   var subAutoTriggerStateUpdated = function ($scope, scopeHandler) {
	   console.log('subAutoTriggerStateUpdated' + Date.now());
	   _subscribe(appSettingsConfig.getAllBeaconsSuccess, $scope, scopeHandler, function(args) { return args.newState; });
   };
  
   return {
	   pubAutoTriggerStateUpdated	: pubAutoTriggerStateUpdated,
	   subAutoTriggerStateUpdated	: subAutoTriggerStateUpdated
   	};
}])


appSettingsModule.factory('appSettingsService', ['appSettingsChannel', 
		function(appSettingsChannel) {

    	    var autoTriggerState = false;
    	   
			var getAutoTriggerState = function() {
				return autoTriggerState;
			};

			var setAutoTriggerState = function(newState) {
				//be shure that newState is boolean
				newState = (newState) ? true : false;
				console.log(newState ,getAutoTriggerState(), newState != getAutoTriggerState());
				//apply only if newState is different from current state
				
				if (newState != getAutoTriggerState()) {
					
					autoTriggerState = newState;
					console.log('ASFDASFDASFAS', autoTriggerState ); 
					appSettingsChannel.pubAutoTriggerStateUpdated(autoTriggerState);
				}
			};
    	   
			
			return {
				getAutoTriggerState	: getAutoTriggerState,
				setAutoTriggerState : setAutoTriggerState
			};

}]);