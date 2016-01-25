;(function() {
  'use strict';

  var	progressChannelConstant =  {
    STATE_UPDATED		: 'STATE_UPDATED',
    COUNT_UPDATED		: 'COUNT_UPDATED',

    PROGRESS_START 	  : 'PROGRESS_START',
    PROGRESS 			    : 'PROGRESS',
    PROGRESS_ERROR 	  : 'PROGRESS_ERROR',
    PROGRESS_COMPLETE 	: 'PROGRESS_COMPLETE'
  };

  angular.module('commons.services.scannLogger.channel', ['commons.baseChannel'])
    .constant("progressChannelConstant", progressChannelConstant)
    .factory('ScannLoggerChannel', ScannLoggerChannel);

  ScannLoggerChannel.$inject = [ 'BaseChannel', 'progressChannelConstant' ];
  function ScannLoggerChannel(BaseChannel, progressChannelConstant) {

    //setup and return service
    var ScannLoggerChannel = {

      subCountUpdated 	: subCountUpdated,
      pubCountUpdated		: pubCountUpdated,

      subStateUpdated 	: subStateUpdated,
      pubStateUpdated		: pubStateUpdated,

      subProgressStart 	: subProgressStart,
      pubProgressStart	: pubProgressStart,

      subProgress 		: subProgress,
      pubProgress			: pubProgress,

     // subProgressError : subProgressError,
     // pubProgressError : pubProgressError,

      subProgressComplete : subProgressComplete,
      pubProgressComplete : pubProgressComplete

    };

    return ScannLoggerChannel;

    ////////////

    function pubCountUpdated(count) {
      console.log('pubCountUpdated count',count);
      BaseChannel.pubRootEmit(progressChannelConstant.COUNT_UPDATED, {count : count});
    };
    function subCountUpdated($scope, scopeHandler) {
      console.log('subCountUpdated');
      return BaseChannel.subRootEmit(progressChannelConstant.COUNT_UPDATED, $scope, scopeHandler, function(args) { return args.count; });
    };


    function pubStateUpdated(state) {
      console.log('pubStateUpdated state',state);
      BaseChannel.pubRootEmit(progressChannelConstant.STATE_UPDATED, {state : state});
    };
    function subStateUpdated($scope, scopeHandler) {
      console.log('subStateUpdated');

      return BaseChannel.subRootEmit(progressChannelConstant.STATE_UPDATED, $scope, scopeHandler, function(args) { return args.state; });
    };


    function pubProgressStart(count) {
      BaseChannel.pubRootEmit(progressChannelConstant.PROGRESS_START, {count : count});
    };
    function subProgressStart($scope, scopeHandler) {
      return BaseChannel.subRootEmit(progressChannelConstant.PROGRESS_START, $scope, scopeHandler, function(args) { return args.count; });
    };


    function pubProgress(count) {
      return BaseChannel.pubRootEmit(progressChannelConstant.PROGRESS, {progress : progress});
    };
    function subProgress($scope, scopeHandler) {
      BaseChannel.subRootEmit(progressChannelConstant.PROGRESS, $scope, scopeHandler, function(args) { return args.progress; });
    };

    /*function pubProgressError(error) {
      BaseChannel.pubRootEmit(progressChannelConstant.PROGRESS_ERROR, {error : error});
    };
    function subProgressError($scope, scopeHandler) {
      return BaseChannel.subRootEmit(progressChannelConstant.PROGRESS_ERROR, $scope, scopeHandler, function(args) { return args.error; });
    };*/

    function pubProgressComplete(count) {
      BaseChannel.pubRootEmit(progressChannelConstant.PROGRESS_COMPLETE, {count : count});
    };
    function subProgressComplete($scope, scopeHandler) {
      return BaseChannel.subRootEmit(progressChannelConstant.PROGRESS_COMPLETE, $scope, scopeHandler, function(args) { return args.count; });
    };

  };

})();
