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
            GlueService.resetForm(vm.loginForm);
            vm.serverErrors = [];
            GlueService.goToState('app.profile');
          },
          //error
          function (errorResult) {

            if (errorResult.status >= 400 && errorResult.status < 500) {
              vm.serverErrors.push(errorResult.data[0]);
            }
            else {
              vm.serverErrors.push(errorResult.statusText);
            }

          }
        ).finally(function () {
            vm.loginIsPending = false;
          });

      }

    }

  }


})();
