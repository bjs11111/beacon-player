/* Controllers of start component */
//______________________________________________

var helpControllers = angular.module('helpControllers', ['ngCordova']);

/* Main Start Controllers */
helpControllers.controller('helpCtrl', 
						   ['$scope','$ionicPlatform','$cordovaLocalNotification', 
                    function($scope,  $ionicPlatform,  $cordovaLocalNotification) {
			console.log('init helpCtrl');	
			
			$scope.schedule = schedule;
			
			function schedule() {
				 
				var options = {},
					scope = $scope;
				$ionicPlatform.ready(function() {
					alert('schedule');
					$cordovaLocalNotification.schedule(options, scope);
				});
			}
			
			
}])