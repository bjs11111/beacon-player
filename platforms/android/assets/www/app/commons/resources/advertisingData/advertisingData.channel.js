;(function() {
	'use strict';

	/**
	 * AdvertisingData Channel Module
	 */
	angular.module('commons.resources.advertisingData.channel', ['d7-services.commons.baseChannel', 'commons.resources.advertisingData.channelConstant'])
		   .factory('AdvertisingDataChannel', AdvertisingDataChannel);

	/**
	 * Manually identify dependencies for minification-safe code
	 *
	 **/
	AdvertisingDataChannel.$inject = [ 'BaseChannel', 'AdvertisingDataChannelConstant' ];

	/**
	 * Notification channel for advertisingData resource
	**/
	/** @ngInject */
	function AdvertisingDataChannel(BaseChannel, AdvertisingDataChannelConstant) {

		//setup and return service
        var advertisingDataChannelService = {
          pubRetrieveConfirmed 	: pubRetrieveConfirmed,
          subRetrieveConfirmed	: subRetrieveConfirmed,
          pubRetrieveFailed 		: pubRetrieveFailed,
          subRetrieveFailed		: subRetrieveFailed,

          pubCreateConfirmed 		: pubCreateConfirmed,
          subCreateConfirmed		: subCreateConfirmed,
          pubCreateFailed 		: pubCreateFailed,
          subCreateFailed			: subCreateFailed,

        };

        return advertisingDataChannelService;

    //AdvertisingData retrieve request functions

    /**
     * pubRetrieveConfirmed
     *
     * Publish the AdvertisingDataRetrieveConfirmed event with giver args
     *
     * @param 	{Object} args The events arguments
     *
     *
     **/
    function pubRetrieveConfirmed(args) {
      BaseChannel.pubRootEmit(AdvertisingDataChannelConstant.retrieveConfirmed, args);
    };

    /**
     * subRetrieveConfirmed
     *
     * subscribe for the AdvertisingDataRetrieveConfirmed event
     *
     * @param 	{Object} _Scope The scope that calls the channels subRetrieveConfirmed function
     * @param 	{function} scopeHandler The callback handler for AdvertisingDataRetrieveConfirmed event
     *
     * @return 	{function} The unsubscribe function from the $rootScope.on() call
     *
     **/
    function subRetrieveConfirmed(_Scope, scopeHandler) {
      var unsubsSopeHandler = BaseChannel.subRootEmit( AdvertisingDataChannelConstant.retrieveConfirmed, _Scope, scopeHandler);

      return unsubsSopeHandler;
    };

    //###############


    /**
     * pubRetrieveConfirmed
     *
     * Publish the AdvertisingDataRetrieveConfirmed event with giver args
     *
     * @param 	{Object} args The events arguments
     *
     *
     **/
    function pubRetrieveFailed(args) {
      BaseChannel.pubRootEmit(AdvertisingDataChannelConstant.retrieveFailed, args);
    };

    /**
     * subRetrieveFailed
     *
     * subscribe for the AdvertisingDataRetrieveFailed event
     *
     * @param 	{Object} _Scope The scope that calls the channels subRetrieveFailed function
     * @param 	{function} scopeHandler The callback handler for AdvertisingDataRetrieveFailed event
     *
     * @return 	{function} The unsubscribe function from the $rootScope.on() call
     *
     **/
    function subRetrieveFailed(_Scope, scopeHandler) {
      var unsubsSopeHandler = BaseChannel.subRootEmit( AdvertisingDataChannelConstant.retrieveFailed, _Scope, scopeHandler);

      return unsubsSopeHandler;
    };

    //________________________________________________________________________________________________________________________________________

    //AdvertisingData create request functions

    /**
     * pubCreateConfirmed
     *
     * Publish the AdvertisingDataCreateConfirmed event with giver args
     *
     * @param 	{Object} args The events arguments
     *
     *
     **/
    function pubCreateConfirmed(args) {
      BaseChannel.pubRootEmit(AdvertisingDataChannelConstant.createConfirmed, args);
    };

    /**
     * subCreateConfirmed
     *
     * subscribe for the AdvertisingDataCreateConfirmed event
     *
     * @param 	{Object} _Scope The scope that calls the channels subCreateConfirmed function
     * @param 	{function} scopeHandler The callback handler for AdvertisingDataCreateConfirmed event
     *
     * @return 	{function} The unsubscribe function from the $rootScope.on() call
     *
     **/
    function subCreateConfirmed(_Scope, scopeHandler) {
      var unsubsSopeHandler = BaseChannel.subRootEmit( AdvertisingDataChannelConstant.createConfirmed, _Scope, scopeHandler);
      return unsubsSopeHandler;
    };

    //###############


    /**
     * pubCreateConfirmed
     *
     * Publish the AdvertisingDataCreateConfirmed event with giver args
     *
     * @param 	{Object} args The events arguments
     *
     *
     **/
    function pubCreateFailed(args) {
      BaseChannel.pubRootEmit(AdvertisingDataChannelConstant.createFailed, args);
    };

    /**
     * subCreateFailed
     *
     * subscribe for the AdvertisingDataCreateFailed event
     *
     * @param 	{Object} _Scope The scope that calls the channels subCreateFailed function
     * @param 	{function} scopeHandler The callback handler for AdvertisingDataCreateFailed event
     *
     * @return 	{function} The unsubscribe function from the $rootScope.on() call
     *
     **/
    function subCreateFailed(_Scope, scopeHandler) {
      var unsubsSopeHandler = BaseChannel.subRootEmit( AdvertisingDataChannelConstant.createFailed, _Scope, scopeHandler);
      return unsubsSopeHandler;
    };

    //________________________________________________________________________________________________________________________________________

  };

})();
