;(function () {
  'use strict';

  angular
    .module('commons.services.user-state.service', ['ngStorage','d7-services.resources.user', 'd7-services.commons.authentication'])
    .factory('UserStateService', UserStateService);

  UserStateService.$inject = ['$rootScope','$localStorage','UserChannel'];
  function UserStateService($rootScope, $localStorage, UserChannel) {

    var fakeScope = $rootScope.$new(),
        userService = {
          init : init,
          setFirstVisit : setFirstVisit,
          getFirstVisit : getFirstVisit,
          setIsRegistered : setIsRegistered,
          getIsRegistered : getIsRegistered
        };

    return userService;

    ///////

    function init() {

      UserChannel.subRegisterConfirmed(fakeScope, function(args) {
        $localStorage.isRegistered = true;
      });

    }

    function setFirstVisit(value) {
      $localStorage.isFirstVisite = value;
    }

    function getFirstVisit() {
      return $localStorage.isFirstVisite;
    }

    function setIsRegistered(value) {
      $localStorage.isRegistered = value;
    }

    function getIsRegistered() {
      console.log('getIsRegistered', $localStorage.isRegistered);
      return $localStorage.isRegistered;
    }

  }
})();
