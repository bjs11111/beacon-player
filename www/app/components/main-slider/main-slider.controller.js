;
(function () {
  'use strict';

  angular
    .module('bp.main-slider.controller', ['commons.services.user-state.service', 'commons.services.glue.service', 'd7-services.commons.authentication'])
    .controller('MainSliderController', MainSliderController);

  MainSliderController.$inject = ['$scope', '$ionicSideMenuDelegate', 'UserStateService', 'GlueService', 'AuthenticationService'];
  function MainSliderController($scope, $ionicSideMenuDelegate, UserStateService, GlueService, AuthenticationService) {
    var vm = this;

    vm.options = {
      loop: false,
      effect: 'fade',
      speed: 500
    };

    vm.skipSlider = skipSlider;

    init();

    ///////////////////////

    function init() {
      UserStateService.setFirstVisit(true);

      $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(false);
      });
      $scope.$on('$ionicView.leave', function () {
        $ionicSideMenuDelegate.canDragContent(true);
      })
    }

    function skipSlider() {

      if (!AuthenticationService.getConnectionState()) {

        if (UserStateService.getIsRegistered()) {
          GlueService.goToState('app.register');
        } else {
          GlueService.goToState('app.login');
        }
      } else {
        GlueService.goToState('app.profile');
      }
    }

  }

})();
