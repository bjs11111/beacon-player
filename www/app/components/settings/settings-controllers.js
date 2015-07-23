/* Controllers of settings component */
//______________________________________________________________________________________

var settingsControllers = angular.module('settingsControllers', ['appSettings', 'helperServices']);

/* Settings Controllers */
settingsControllers.controller('settingsCtrl',
		['$scope', 'appSettingsService', 'appSettingsChannel', 'helperService',
 function($scope,  appSettingsService, appSettingsChannel, helperService) {
 	
	$scope.states = {};
	$scope.states.autoTriggerState = appSettingsService.getAutoTriggerState();
	//@TODO implement debugstate functions
	//$scope.debugState = appSettings.getDebugState();
	
	
	
	//_stateName is the stateName of this controller var
	//stateName is the stateName of the services var
	$scope.toggleSettingsState = function(_stateName, service, stateName) {
		stateName = (stateName)?stateName:_stateName;

		//create get and set functions name
		var setStateFunctionName = 'get'+helperService.capitalize(stateName),
			getStateFunctionName = 'set'+helperService.capitalize(stateName);
        //toggle if changed
        if (service[getStateFunctionName]()  != $scope[_stateName]) {
        	service[setStateFunctionName](!$scope[_stateName]);
        }   
	};

	$scope.toggleAutoTriggerState = function() {	
		 $scope.toggleSettingsState('states.autoTriggerState', appSettingsService, 'autoTriggerState');
    };
    //@TODO remove this test function, also in view!
    $scope.test = function() {
    	appSettingsService.setAutoTriggerState(!$scope.states.autoTriggerState);
 	};
   
    var subAutoTriggerStateUpdated = function(newState) {
    	$scope.states.autoTriggerState = newState;
 	};
 	
    var init = function() {
    	console.log('init settingsControllers');
    	appSettingsChannel.subAutoTriggerStateUpdated($scope, subAutoTriggerStateUpdated);
	};
	
	init();
 	
	
}]);