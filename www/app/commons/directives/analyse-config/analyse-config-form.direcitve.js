(function() {
	'use strict';

	/**
	 * analyseConforPannel Module
	 */
	var analyseConfigForm = angular.module('commons.directives.analyseConfigForm.directive', ['angular.filter','commons.services.scannLogger.factory', 'commons.services.scannLogger.channel', 'services.scannLogger.saveProgress.directive'])
	
	.directive('analyseConfigForm', analyseConfigForm);

	/**
	 * Manually identify dependencies for minification-safe code
	 * 
	 **/
	analyseConfigForm.$inject = ['ScannLogger', 'ScannLoggerChannel', '$timeout'];
	
	/**
	 * analyseConforPannel
	 **/
	/** @ngInject */
	function analyseConfigForm(ScannLogger, ScannLoggerChannel, $timeout, $filter) {
		
		var buttonIcons = {
				ready : 'ion-play',
				recording : 'ion-stop',
				finished : 'ion-upload'
		};
		
		 return {
			    restrict: 'E',
			    replace:true,
			    templateUrl: 'app/commons/directives/analyse-config/analyse-config-form.html',
			    controller: ['$scope',
			        function( $scope) {
			    		
			    		$scope.cfd = {};
			    		
			    		$scope.cfd.config = {};
			    		$scope.cfd.packagesCount = undefined;
			    		$scope.cfd.title = '';
			    		$scope.cfd.isTitle = false;
			    		$scope.cfd.saveTitle = saveTitle;
			    		
			    		$scope.cfd.mainButtonPress = mainButtonPress;

			    		init();
			    
			    		/////////////////////////////////////////
			    		
			    		//listeners, 
				    	function init() {

				    		stateUpdatedHandler(ScannLogger.getState());
				    		ScannLoggerChannel.subStateUpdated($scope, stateUpdatedHandler);
				    		
				    		countUpdatedHandler(ScannLogger.getCount());
				    		ScannLoggerChannel.subCountUpdated($scope, countUpdatedHandler)

				    	};

				    	function countUpdatedHandler(count) {
				    		//@TODO this should work without timeout
				    		$timeout(function() {
				    			$scope.cfd.packagesCount = count; 
				    		},0);
				    	}
				    	
				    	function stateUpdatedHandler(newState) {
				    		$scope.cfd.mainBtnIcon = buttonIcons[newState];	
				    		
				    		if(newState === 'ready') {
				    			$scope.cfd.title = '';
					    		$scope.cfd.isTitle = false;
				    		}
				    	}
				    	
				    	function mainButtonPress() {
				    	
				    		var actualState = ScannLogger.getState();
				    		
				    		switch(actualState) {
				    			case 'ready':
				    				ScannLogger.start();
				    				break;
				    			case 'recording':
				    				ScannLogger.stop();
				    				break;
				    			case 'finished':
				    				ScannLogger.save();
				    				break;
				    		}
				    	}
				    	
				    	function saveTitle(analyseForm, title) {
				    		
				    		if(analyseForm.$valid) {
				    			ScannLogger.setTitle(title);
				    			$scope.cfd.isTitle = true;
				    		}
				    	}

			    }]
			  
			  }
    	
	};

})();
