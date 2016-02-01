;(function() {
    'use strict';

    /**
	 *  Constants for AdvertisingDataResourceModules
	 *
	 *  NOTE: if you want to change this constant do this in your app.js config section
	 */
	var AdvertisingDataResourceConstant =  {

	 		// NOTE: This is the default alias aliases for your system resources defined in Drupal
	 		resourcePath : 'advertising_data',
	 		//actions of system resource
	 		actions : {
        //following actions are defined over their request method (GET, POST, PUT, DELETE) so they are commented out
        //retrieve 	: 'retrieve',
        //create 	: 'create'
	 		}

	};

	/**
	 * AdvertisingData Constant Modules
	 */
	angular
	    .module('commons.resources.advertisingData.resourceConstant', [])
	    .constant("AdvertisingDataResourceConstant", AdvertisingDataResourceConstant);

})();
