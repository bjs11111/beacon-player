/* Services */
var companyProvicers = angular.module('companyProvicers', []);


 /*Constants for the bleDeviceService*/
companyProvicers.constant("bleCompanyIdentifierConfig", {
 		_UNKNOWN_COMPANY_ 	: 'Unknown Company',
 })
    
 companyProvicers.factory('bleCompanyIdentifierService', 
		 [ '$http', '$filter', 'bleCompanyIdentifierConfig', 
   function($http,   $filter,   bleCompanyIdentifierConfig) {
 	 var companyIdentifiers = {};
 	 var reverseMIdFilter = $filter('reverseMId');
 	
 	 //@TODO move into run method
 	 var init = function() {
 	  //list of all known companyIdentifier {hex:0x000,copmany:company name}
 	  //got data from https://www.bluetooth.org/en-us/specification/assigned-numbers/company-identifiers
 	  	getCompanyIdentifiers();
 	 }
 	
 		var getCompanyIdentifiers = function() {
 			
 		  $http({
 			    method: 'GET',
 			    url: 'app/data/companyIdentifier.json'
 			  }).success(function(data) {
 				  companyIdentifiers = data;
 			  }).error(function(data) {
 				  //console.log('error while loading app/data/companyIdentifier.json');
 				  //console.log(data); 
 			  });
 	  };
 	  
 	  var getHex = function(companyName) {
     	  var result = undefined;
 		  angular.forEach(companyIdentifiers, function(obj, i){
 			 if(obj.company == companyName) {
 				 result = obj.hex;
 			 }	 
     	  }); 
     	  return result; 
       };
 	  
       var getCompanyName = function(hex) {
     	  var result = bleCompanyIdentifierConfig._UNKNOWN_COMPANY_;
 		  angular.forEach(companyIdentifiers, function(obj, i){
 			 if(reverseMIdFilter(obj.hex.toString().substr(-4), true).toLowerCase() == hex) {
 				 result = obj.company;
 			 }	 
     	  }); 
     	  return result; 
       };
       
       var getHex = function(companyName) {
     	  var result = undefined;
 		  angular.forEach(companyIdentifiers, function(obj, i){
 			 if(obj.company == companyName) {
 				 result = obj.hex;
 			 }	 
     	  }); 
     	  return result; 
       };

       //do initialisation
       init();
       
       // return the publicly accessible methods
               return {
             	  getCompanyName			: getCompanyName,
             	  getHex					: getHex,
             	  getCompanyIdentifiers 	: getCompanyIdentifiers,
               };
               
 }]);