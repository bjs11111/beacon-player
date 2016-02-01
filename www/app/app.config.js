;(function() {
    'use strict';


angular
    .module('bp.config', ['d7-services.commons.configurations','d7-services.commons.http.configurations'])
    .config(configFunction);

	configFunction.$inject = ['DrupalApiConstant'];

	/** @ngInject */
	function configFunction(DrupalApiConstant)
	{
		//drupal services configurations
		DrupalApiConstant.drupal_instance = 'http://www.starnberger.at/beaconplayer_analyse/';
		DrupalApiConstant.api_endpoint += 'v1/';

	};

})();



