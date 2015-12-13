(function() {
    'use strict';
    
	/**
	 * System modules bundle
	**/
	angular.module('commons.deviceDataManager', 
			['commons.deviceDataManagerChannel.constant', 
			 'commons.deviceDataManagerService.constant', 
			 'commons.deviceDataManager.service', 
			 'commons.deviceDataManager.channel']);
})();