;
(function () {
  'use strict';

  angular
    .module('bp.login.controller', ['ngMessages', 'commons.validation.setValidAfterChange.directive', 'commons.services.glue.service'])
    .controller('LoginController', LoginController)

  LoginController.$inject = ['$scope', 'AuthenticationService', 'GlueService'];
  function LoginController($scope, AuthenticationService, GlueService) {

    // jshint validthis: true
    var vm = this;

    vm.serverErrors = [];

    //data for vm.loginForm
    vm.loginData = {
      username: '',
      password: ''
    };


    vm.loginIsPending = false;

    vm.doLogin = doLogin;
    vm.goToRegister = goToRegister;

    ///////////////

    function goToRegister() {
      GlueService.resetForm(vm.loginForm);
      GlueService.goToState('app.register');
    }

    function doLogin() {
      if (vm.loginForm.$valid) {
        vm.serverErrors = [];
        vm.loginIsPending = true;

        AuthenticationService.login(vm.loginData)
          .then(
          function (data) {
            vm.loginIsPending = false;
            GlueService.resetForm(vm.loginForm);
            vm.serverErrors = [];
            GlueService.goToState('app.profile');
          },
          //error
          function (errorResult) {
            vm.loginIsPending = false;
            console.log(errorResult);

            if (errorResult.status >= 400 && errorResult.status < 500) {
              vm.serverErrors.push(errorResult.statusText);
            }

            //vm.loginForm.username.$setValidity('inactive-or-blocked', false);
          }
        );

      }

    };

  };


})();
