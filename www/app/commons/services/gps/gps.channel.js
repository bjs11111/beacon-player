;(function() {
	'use strict';

    var	progressChannelConstant =  {
    		 POSITION_UPDATED		  : 'POSITION_UPDATED'
	};

	angular.module('commons.services.gps.channel', ['commons.baseChannel'])
		 	   .constant("progressChannelConstant", progressChannelConstant)
			   .factory('GpsServiceChannel', GpsServiceChannel);

	GpsServiceChannel.$inject = [ 'BaseChannel', 'progressChannelConstant' ];
	function GpsServiceChannel(BaseChannel, progressChannelConstant) {

		//setup and return service
        var GpsServiceChannel = {

          subPositionUpdated 	: subPositionUpdated,
          pubPositionUpdated	: pubPositionUpdated

        };

        return GpsServiceChannel;

        ////////////

        function pubPositionUpdated(position) {
        	BaseChannel.pubRootEmit(progressChannelConstant.POSITION_UPDATED, {position : position});
        };
        function subPositionUpdated($scope, scopeHandler) {
     	   BaseChannel.subRootEmit(progressChannelConstant.POSITION_UPDATED, $scope, scopeHandler, function(args) { return args.position; });
        };


	};

})();
