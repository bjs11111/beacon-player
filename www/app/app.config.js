;(function() {
    'use strict';


angular
    .module('bp.config', ['ngDrupal7Services-3_x.commons.configurations','ngDrupal7Services-3_x.commons.http.configurations'])
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



