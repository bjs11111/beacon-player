;(function() {
	'use strict';
	
    var	progressChannelConstant =  {
    		 PROGRESS_START 	: 'PROGRESS_START',
    		 PROGRESS 			: 'PROGRESS',
    		 PROGRESS_COMPLETE 	: 'PROGRESS_COMPLETE' 
	};
    
	angular.module('commons.services.scannLogger.channel', ['commons.baseChannel'])
		 	   .constant("progressChannelConstant", progressChannelConstant)
			   .factory('ScannLoggerChannel', ScannLoggerChannel);

	ScannLoggerChannel.$inject = [ 'BaseChannel', 'progressChannelConstant' ];
	function ScannLoggerChannel(BaseChannel, progressChannelConstant) {
	
		//setup and return service            	
        var ScannLoggerChannel = {
        		
        	   subProgressStart 	: subProgressStart,
        	   pubProgressStart		: pubProgressStart,
          	   
        	   subProgress 			: subProgress,
        	   pubProgress			: pubProgress,
          	   
        	   subProgressComplete 	: subProgressComplete,
        	   pubProgressComplete 	: pubProgressComplete

        };
        
        return ScannLoggerChannel;

        ////////////
        function pubProgressStart(count) {
        	BaseChannel.pubRootEmit(progressChannelConstant.PROGRESS_START, {count : count});
        };
        function subProgressStart($scope, scopeHandler) {
     	   BaseChannel.subRootEmit(progressChannelConstant.PROGRESS_START, $scope, scopeHandler, function(args) { return args.count; });
        };
        
        
        function pubProgress(progress) {
        	BaseChannel.pubRootEmit(progressChannelConstant.PROGRESS, {progress : progress});
        };
        function subProgress($scope, scopeHandler) {
     	   BaseChannel.subRootEmit(progressChannelConstant.PROGRESS, $scope, scopeHandler, function(args) { return args.progress; });
        };
        
        function pubProgressComplete(count) {
        	BaseChannel.pubRootEmit(progressChannelConstant.PROGRESS_COMPLETE, {count : count});
        };
        function subProgressComplete($scope, scopeHandler) {
     	   BaseChannel.subRootEmit(progressChannelConstant.PROGRESS_COMPLETE, $scope, scopeHandler, function(args) { return args.count; });
        };
      
	};

})();