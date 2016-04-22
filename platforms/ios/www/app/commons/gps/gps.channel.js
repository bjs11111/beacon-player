;(function() {
	'use strict';

    var	gpsChannelConstant =  {
    		 POSITION_UPDATED		  : 'POSITION_UPDATED'
	};

	angular.module('commons.services.gps.channel', ['commons.baseChannel'])
		 	   .constant("gpsChannelConstant", gpsChannelConstant)
			   .factory('GpsServiceChannel', GpsServiceChannel);

	GpsServiceChannel.$inject = [ 'BaseChannel', 'gpsChannelConstant' ];
	function GpsServiceChannel(BaseChannel, gpsChannelConstant) {

		//setup and return service
        var GpsServiceChannel = {

          subPositionUpdated 	: subPositionUpdated,
          pubPositionUpdated	: pubPositionUpdated

        };

        return GpsServiceChannel;

        ////////////

        function pubPositionUpdated(position) {
        	BaseChannel.pubRootEmit(gpsChannelConstant.POSITION_UPDATED, {position : position});
        };
        function subPositionUpdated($scope, scopeHandler) {
     	   BaseChannel.subRootEmit(gpsChannelConstant.POSITION_UPDATED, $scope, scopeHandler, function(args) { return args.position; });
        };

	};

})();
