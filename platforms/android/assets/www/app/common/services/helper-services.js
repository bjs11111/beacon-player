/* Services */
var helperServices = angular.module('helperServices', []);

/*Constants for the bleDeviceService*/
helperServices.constant("helperServiceConfig", {

});

helperServices.factory('helperService', 
		['helperServiceConfig',
function (helperServiceConfig) {
	
	var randBetween = function(min, max) {
		return Math.floor((min < 0) ? (min + Math.random()* (Math.abs(min) + max)) : (min + Math.random()* max));
	};
	
	var capitalize = function(str) {
		str = str.toString();
		console.log(str); 
		var capitalized = str.charAt(0).toUpperCase() + str.substring(1);
		return capitalized;
	};
	
	return {
		randBetween : randBetween,
		capitalize : capitalize,
	};
	
}]);