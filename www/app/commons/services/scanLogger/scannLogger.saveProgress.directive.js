;(function() {
    'use strict';

    angular
        .module('services.scannLogger.saveProgress.directive', ['ngProgress','commons.services.scannLogger.channel'])
        .directive('scannLoggerSaveProgress', scannLoggerSaveProgress);


    scannLoggerSaveProgress.$inject = ['ngProgressFactory','ScannLoggerChannel'];
    function scannLoggerSaveProgress(ngProgressFactory, ScannLoggerChannel) {

        return {
            // restrict to an element type.
            restrict: 'A',
            replace: true,
            link : function linkFunction(scope, elem, attrs, ctrl) {

            	var domElem = document.getElementById(attrs.container);
            	scope.container = (domElem)?domElem:elem[0];

            	scope.progressbar = ngProgressFactory.createInstance();
            	scope.progressbar.setParent(scope.container);


            	ScannLoggerChannel.subProgressStart(scope,function(count){ scope.progressbar.set(0); });
            	ScannLoggerChannel.subProgress(scope,function(progress){ scope.progressbar.set(mapProgress(progress)); });
            	ScannLoggerChannel.subProgressComplete(scope,function(count){ scope.progressbar.complete(); });

            	///////////////////////////////

            	function mapProgress(progress) {
            		  return Math.round(progress * 100);
            	}

            }

        };

    };



})();
