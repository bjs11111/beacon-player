/* Services */
var utilsServices = angular.module('utilsServices', [])

utilsServices
/*
 * @TODO try to implement localForage =>
 * https://github.com/ocombe/angular-localForage
 */
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, emptyValue) {
      emptyValue = (emptyValue)?emptyValue:undefined;
      
      return $window.localStorage[key] || emptyValue;
    },
    clear: function(key) {
      
         delete $window.localStorage[key];
        
    },
    
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key, emptyValue) {
    	emptyValue = (emptyValue)?emptyValue:'{}';
    	
    	return JSON.parse($window.localStorage[key] || emptyValue);
    },
    clearObject: function(key) {
        delete $window.localStorage[key];
    },
    
    clearAll: function(key) {
        delete $window.localStorage[key];
        $window.localStorage = [];
   },
  }
}]);
