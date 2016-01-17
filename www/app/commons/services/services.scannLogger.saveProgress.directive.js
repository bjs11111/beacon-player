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
           
  
            link : function linkFunction(scope, ele, attrs, ctrl) {

            	scope.container = document.getElementById(attrs.container);
            
            	scope.progressbar = ngProgressFactory.createInstance();
           
            	if(scope.container){
            		scope.progressbar.setParent(scope.container);
            	}
            	
            	
            	ScannLoggerChannel.subProgressStart(scope,function(count){ console.log('start count', count); scope.progressbar.start(); });
            	ScannLoggerChannel.subProgress(scope,function(progress){ console.log('progress', progress); scope.progressbar.set(mapProgress(progress)); });
            	ScannLoggerChannel.subProgressComplete(scope,function(count){ console.log('complete count', count); scope.progressbar.complete(); });
                
            	///////////////////////////////
            	
            	function mapProgress(progress) {
            		console.log(Math.round(progress * 100));
            		  return Math.round(progress * 100);
            	}
            }
           
            
        };

    };
    


})();
	