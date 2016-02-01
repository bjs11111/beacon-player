;(function () {
  'use strict';

  /**
   * AdvertisingData Resource Modules
   *
   * see sourcecode in services/resources/system_resource.inc
   *
   **/
  angular.module('commons.resources.advertisingData.resource', ['d7-services.commons.configurations', 'd7-services.commons.baseResource', 'commons.resources.advertisingData.resourceConstant', 'commons.resources.advertisingData.channel'])
    /**
     * AdvertisingDataResource
     *
     * This service mirrors the AdvertisingData resource of the AdvertisingData module.
     *
     **/
    .factory('AdvertisingDataResource', AdvertisingDataResource);

  /**
   * Manually identify dependencies for minification-safe code
   *
   **/
  AdvertisingDataResource.$inject = ['$http', 'DrupalApiConstant', 'BaseResource', 'AdvertisingDataResourceConstant', 'AdvertisingDataChannel'];

  /** @ngInject */
  function AdvertisingDataResource($http, DrupalApiConstant, BaseResource, AdvertisingDataResourceConstant, AdvertisingDataChannel) {

    //setup and return service
    var systemResourceService = {
      retrieve 	: retrieve,
      create 		: create
    };

    return systemResourceService;

    ////////////

    /**
     * retrieve
     *
     * Retrieve the advertising data
     *
     * Method: GET
     * Url: http://drupal_instance/api_endpoint/advertising_data/{NID}
     *
     * @params  {Object} data The requests data
     * 			@key 	{Integer} nid NID of the node to be loaded, required:true, source:path
     *
     * @return 	{Promise} A node object
     *
     **/
    function retrieve(data) {
      var retrievePath = DrupalApiConstant.drupal_instance + DrupalApiConstant.api_endpoint + AdvertisingDataResourceConstant.resourcePath + '/' + data.nid;
      return BaseResource.retrieve( retrievePath,AdvertisingDataChannel.pubRetrieveConfirmed,  AdvertisingDataChannel.pubRetrieveFailed);
    };

    /**
     * create
     *
     * Create a new node.
     * This function uses drupal_form_submit() and as such expects all input to match
     * the submitting form in question.
     *
     * Method: POST
     * Url: http://drupal_instance/api_endpoint/node
     *
     * @params  {Object} data The accout of the node to create, required:true, source:post body
     *
     *  The $account object should contain, at minimum, the following properties:
     *     - {String} name  The node name
     *     - {String} mail  The email address
     *     - {String} pass  The plain text unencrypted password
     *
     *  These properties can be passed but are optional
     *     - {Integer} status Value 0 for blocked, otherwise will be active by default
     *     - {Integer} notify Value 1 to notify node of new account, will not notify by default
     *
     *  Roles can be passed in a roles property which is an associative
     *  array formatted with '<role id>' => '<role id>', not including the authenticated node role, which is given by default.
     *
     * @return 	{Promise} The node object of the newly created node.
     *
     **/
    function create(data) {

      var createPath = DrupalApiConstant.drupal_instance + DrupalApiConstant.api_endpoint + AdvertisingDataResourceConstant.resourcePath + "/" + data.nid;

      delete data.nid;
      var  createData 	= {
          advertising_packages : data.advertising_packages
        };

      return BaseResource.create( createData, createPath, AdvertisingDataChannel.pubCreateConfirmed, AdvertisingDataChannel.pubCreateFailed);

    };

  };

})();
