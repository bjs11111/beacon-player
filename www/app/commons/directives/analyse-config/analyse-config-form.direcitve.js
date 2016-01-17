(function() {
	'use strict';

	/**
	 * analyseConforPannel Module
	 */
	var analyseConfigForm = angular.module('commons.directives.analyseConfigForm.directive', ['commons.services.scannLogger.factory','services.scannLogger.saveProgress.directive'])
	
	.directive('analyseConfigForm', analyseConfigForm);

	/**
	 * Manually identify dependencies for minification-safe code
	 * 
	 **/
	analyseConfigForm.$inject = ['ScannLogger'];
	
	/**
	 * analyseConforPannel
	 **/
	/** @ngInject */
	function analyseConfigForm(ScannLogger) {
		
		 return {
			    restrict: 'E',
			    replace:true,
			    templateUrl: 'app/commons/directives/analyse-config/analyse-config-form.html',
			    scope: {},
			    controller: ['$scope',
			        function( $scope) {
			    	 ////////////
			        
			    	
			    	//________________________________________________________________________________________________________________________________________
			    	
			    		//prepare
			    
			    		$scope.cfd = {};
			    		$scope.cfd.config = {};
			    		$scope.cfd.packagesCount = ScannLogger.packagesCount;
			    		$scope.cfd.saveConfig = saveConfig;
			    		$scope.cfd.updateCount = updateCount;
			    		$scope.cfd.startAnalyse = ScannLogger.start;
			    		$scope.cfd.stopAnalyse = ScannLogger.stop;
			    		$scope.cfd.saveData = ScannLogger.save;
			    	
			    		init();
			    
			    		/////
			    		
			    		//listeners, 
				    	function init() {
				    		var currentConfig = ScannLogger.getConfig();
				    		$scope.cfd.config.title = currentConfig.title;
				    		$scope.cfd.config.withOS = currentConfig.withOS;
				    		$scope.cfd.config.withOSVersion = currentConfig.withOSVersion;
				    		$scope.cfd.config.withAppState = currentConfig.withAppState;
				    		$scope.cfd.config.withGPSPosition = currentConfig.withGPSPosition;

				    	};
				    	
				    	function updateCount() {
				    		$scope.cfd.packagesCount = ScannLogger.packagesCount;
				    	}
				    	
				    	
				    	/**
				    	 * saveConfig
				    	 * 
				    	 * validates and saves params form form into loggerService
				    	 * 
				    	 * @param configForm {ngForm} the form
				    	 * @param config {Object} the config data
				    	 * 
				    	**/
				    	function saveConfig(configForm, config) {
				    			//console.log('saveConfig', configForm.$valid); 
				    		if(configForm.$valid) {
				    			ScannLogger.setConfig(config);
				    		}
				    	}


			    }]
			  
			  }
    	
	};

})();
