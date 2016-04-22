;(function () {
  'use strict';

  angular
    .module('commons.services.glue.service', [])
    .service('GlueService', GlueService);

  GlueService.$inject = ['$state'];
  function GlueService($state) {
    var glueService = {
      resetForm: resetForm,
      goToState : goToState
    };
    return glueService;
    ///////

    function resetForm(form) {
      form.$error = {};
      form.$setPristine();
      form.$setUntouched();
    }

    function goToState(state) {
      $state.go(state);
    }
  }
})();
