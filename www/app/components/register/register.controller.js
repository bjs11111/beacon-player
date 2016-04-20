;
(function () {
  'use strict';

  angular
    .module('bp.register.controller', ['commons.validation.setValidAfterChange.directive', 'commons.services.glue.service', 'ngMessages'])
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['UserResource', 'AuthenticationService', 'GlueService'];

  /** @ngInject */
  function RegisterController(UserResource, AuthenticationService, GlueService) {
    // jshint validthis: true
    var vm = this;

    vm.serverErrors = [];

    //data for vm.registerForm
    vm.registerData = {
      name: '',
      mail: '',
      pass: ''
    };
    vm.registerIsPending = false;

    vm.goToLogin = goToLogin;
    vm.doRegister = doRegister;

    /////////////

    function goToLogin() {
      GlueService.resetForm(vm.registerForm);
      GlueService.goToState('app.login');
    }

    function doRegister() {

      if (vm.registerForm.$valid) {
        vm.registerIsPending = true;
        vm.serverErrors = [];

        UserResource.register(angular.copy(vm.registerData))
          //register
          .then(
          function (data) {
            return AuthenticationService.login({username: vm.registerData.name, password: vm.registerData.pass});
          }
        )
          //login
          .then(
          function (data) {
            vm.registerIsPending = false;
            //reste form
            vm.registerData = {};
            GlueService.resetForm(vm.registerForm);
            GlueService.goToState('app.profile');
          }
        )
          .catch(
          function (errorResult) {

            console.log('errorResult', errorResult);

            if (errorResult.status >= 400 && errorResult.status < 500) {
              //Not found
              if (errorResult.status == 404) {
                vm.serverErrors.push("Service not available!");
              }
              //Not Acceptable
              else if (errorResult.status == 406) {
                //errors for specific fields
                if (angular.isObject(errorResult.data) && 'form_errors' in errorResult.data) {
                  if (errorResult.data.form_errors.name) {
                    vm.registerForm.name.$setValidity('name-taken', false);
                  }
                  if (errorResult.data.form_errors.mail) {
                    vm.registerForm.mail.$setValidity('email-taken', false);
                  }
                }
                //general errors
                else {
                  vm.serverErrors.push(errorResult.statusText);
                }
              }
              //400 - 500 default message
              else {
                vm.serverErrors.push(errorResult.data[0]);
              }

            }

          }
        )
          .finally(function () {
            vm.registerIsPending = false;
          })
      }

    }


  }

})();
