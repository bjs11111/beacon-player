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
	analyseConfigForm.$inject = ['ScannLogger','ScannLoggerChannel','$timeout','$interval','$filter'];

	/**
	 * analyseConforPannel
	 **/
	/** @ngInject */
	function analyseConfigForm(  ScannLogger,  ScannLoggerChannel,   $timeout,   $interval, $filter) {

		var buttonIcons = {
				ready : 'ion-play',
				recording : 'ion-stop',
				finished : 'ion-upload'
    },
    countInterval = undefined;

		 return {
			    restrict: 'E',
			    replace:true,
			    templateUrl: 'app/commons/directives/analyse-config/analyse-config-form.html',
			    controller: ['$scope',
			        function( $scope) {

			    		$scope.cfd = {};

			    		$scope.cfd.config = {};
			    		$scope.cfd.packagesCount = 0;
              $scope.cfd.isCreatingNode = false;
			    		$scope.cfd.title = '';
			    		$scope.cfd.isTitle = false;
			    		$scope.cfd.saveTitle = saveTitle;

			    		$scope.cfd.mainButtonPress = mainButtonPress;

			    		init();

			    		/////////////////////////////////////////

			    		//listeners,
				    	function init() {

                countInterval = $interval(function(){
                  countUpdatedHandler(ScannLogger.getCount());
                }, 1000 * 1);

				    		stateUpdatedHandler(ScannLogger.getState());
				    		ScannLoggerChannel.subStateUpdated($scope, stateUpdatedHandler);

				    		//countUpdatedHandler(ScannLogger.getCount());
				    		//ScannLoggerChannel.subCountUpdated($scope, countUpdatedHandler);

                ScannLoggerChannel.subProgressError($scope, progressErrorHandler);

				    	};



				    	function countUpdatedHandler(count) {
				    		//@TODO this should work without timeout
                //We use this here because the event is triggered out of angular
				    		$timeout(function() {
				    			$scope.cfd.packagesCount = count;
				    		},0);
				    	}

				    	function stateUpdatedHandler(newState) {
				    		$scope.cfd.mainBtnIcon = buttonIcons[newState];
                $scope.cfd.isUploading = false;

				    		if(newState === 'ready') {
				    			$scope.cfd.title = '';
					    		$scope.cfd.isTitle = false;
				    		}

                if(newState === 'uploading'){
                  $scope.cfd.isUploading = true;
                }

				    	}

              function progressErrorHandler(error){    }

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

                  $scope.cfd.isCreatingNode = true;

				    			var t = ScannLogger
                    .setActiveMeasurement(title)
                      .then(function(){
                        $scope.cfd.isTitle = true;
                        $scope.cfd.isCreatingNode = false;
                      });

                }
				    	}

			    }]

			  }

	};

})();
