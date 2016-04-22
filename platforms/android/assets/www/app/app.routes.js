;
(function () {
  'use strict';

  angular.module('bp.routes', [
    'ngStorage',
    'd7-services.commons.configurations',
    'd7-services.commons.authentication',
    'commons.services.user-state.service',
    'bp.app.controller',
    'bp.main-slider.controller',
    'bp.register.controller',
    'bp.login.controller',
    'bp.profile.controller',

    //testing prioloc
    'bp.diagnostic.controller',
    'bp.qrScanner.controller',
    'bp.nfcScanner.controller'
    //'bp.bleDevicesControllers',
    //'bp.analyse.controller',
    //'bp.map2.controller',
    //'commons.services.ble.bleScanners.factory'

  ])
    .config(configFunction)
    .run(runFunction);

  configFunction.$inject = ['$stateProvider', '$urlRouterProvider', 'AuthenticationServiceConstant', '$localStorageProvider'];
  function configFunction($stateProvider, $urlRouterProvider, AuthenticationServiceConstant, $localStorageProvider) {

    //http://angular-ui.github.io/ui-router/site/#/api/ui.router.router.$urlRouterProvider#methods_deferintercept
    // Prevent $urlRouter from automatically intercepting URL changes;
    // this allows you to configure custom behavior in between location changes and route synchronization
    //
    //We use this in the in the modules .run function
    $urlRouterProvider.deferIntercept();

    //set default URL
    //@TODO use UserStateService.getFirstVisit() instead of $localStorageProvider
    if (!$localStorageProvider.get('isRegistered')) {
      $urlRouterProvider.otherwise('app/register');
    }
    else {
      $urlRouterProvider.otherwise('app/login');
    }

    //set states
    $stateProvider

      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "app/app.view.html",
        controller: 'AppController as app'
      })

      .state('app.main-slider', {
        url: '/main-slider',
        views: {
          'menuContent': {
            templateUrl: 'app/components/main-slider/main-slider.view.html?',
            controller: 'MainSliderController as mainSlider'
          }
        },
        data: {
          'access': AuthenticationServiceConstant.accessLevels.anon
        }
      })

      .state('app.register', {
        url: '/register',
        views: {
          'menuContent': {
            templateUrl: 'app/components/register/register.view.html',
            controller: 'RegisterController as register'
          }
        },
        data: {
          'access': AuthenticationServiceConstant.accessLevels.anon
        }
      })

      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'app/components/login/login.view.html',
            controller: 'LoginController as login'
          }
        },
        data: {
          'access': AuthenticationServiceConstant.accessLevels.anon
        }
      })

      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'app/components/profile/profile.view.html',
            controller: 'ProfileController as profile'
          }
        },
        data: {
          'access': AuthenticationServiceConstant.accessLevels.user
        }
      })

      .state('app.diagnostic', {
        url: '/diagnostic',
        views: {
          'menuContent': {
            templateUrl: 'app/components/diagnostic/diagnostic.view.html',
            controller: 'DiagnosticController as diagnostic'
          }
        }
      })

      .state('app.qr-scanner', {
        url: '/qr-scanner',
        views: {
          'menuContent': {
            templateUrl: 'app/components/qr-scanner/qr-scanner.view.html',
            controller: 'QRScannerController as qrScanner'
          }
        }
      })

      .state('app.nfc-scanner', {
        url: '/nfc-scanner',
        views: {
          'menuContent': {
            templateUrl: 'app/components/nfc-scanner/nfc-scanner.view.html',
            controller: 'NFCScannerController as nfcScanner'
          }
        }
      })

      /*
       //@TODO refactor to controller as
       .state('app.list', {
       url : '/ble-devices',
       views : {
       'menuContent' : {
       templateUrl : 'app/components/ble-devices/ble-devices-list.html',
       controller 	: 'bleDevicesListCtrl as deviceList'
       }
       }
       })

       .state('app.map2', {
       url : '/map2',
       views : {
       'menuContent' : {
       templateUrl : 'app/components/map2/map2.view.html',
       controller 	: 'Map2Controller as map2'
       }
       }
       })

       .state('app.analyse', {
       url : '/analyse',
       views : {
       'menuContent' : {
       templateUrl : 'app/components/analyse/analyse.view.html',
       controller 	: 'AnalyseController as analyse'
       }

       })*/

    ;

  }


  runFunction.$inject = ['$rootScope', 'UserStateService', 'AuthenticationService','$state', '$urlRouter', '$ionicLoading'];


  /** @ngInject */
  function runFunction($rootScope, UserStateService, AuthenticationService, $state, $urlRouter, $ionicLoading) {

    $rootScope.$on('loading:show', loadingShowCallback);

    $rootScope.$on('loading:hide', loadingHideCallback);

    //http://angular-ui.github.io/ui-router/site/#/api/ui.router.router.$urlRouterProvider#methods_deferintercept
    //location change logic => before any view is rendered
    $rootScope.$on('$locationChangeStart', locationChangeStartCallback)

    //state change logic
    $rootScope.$on("$stateChangeStart", stateChangeStartCallback);

    ////////////

    // show ionicLoading overlay with args of event
    function loadingShowCallback(event, args) {
      $ionicLoading.show((args && 'loading_settings' in args) ? args.loading_settings : {});
    }

    // hide ionicLoading overlay
    function loadingHideCallback(event, args) {
      $ionicLoading.hide()
    }

    //we need this to have out current auth state before any other thing in router happens
    function locationChangeStartCallback(e) {

      if (AuthenticationService.getLastConnectTime() > 0) {
        //sync the current URL to the router
        $urlRouter.sync();
        return;
      }

      // Prevent $urlRouter's default handler from firing
      e.preventDefault();
      $rootScope.$broadcast('loading:show', {loading_settings: {template: "<p><ion-spinner></ion-spinner><br/>Connect with System...</p>"}});

      // init or refresh Authentication service connection
      AuthenticationService
        .refreshConnection()
        .then(
          function () {
            $rootScope.$broadcast('loading:hide');
            //sync the current URL to the router
            $urlRouter.sync();
          }
        )
        .catch(
          function () {
            $rootScope.$broadcast('loading:hide');
            //sync the current URL to the router
            $urlRouter.sync();
          }
        );


      /*if (serverBeaconStore.isInitialized() === false) {
        // Prevent $urlRouter's default handler from firing
        e.preventDefault();
        $rootScope.$broadcast('loading:show', {loading_settings: {template: "<p><ion-spinner></ion-spinner><br/>Loading...</p>"}});

        // init or refresh Authentication service connection

        serverBeaconStore.updateBeaconList().then(
          function () {
            sitBleScanner.startScanning();
            $rootScope.$broadcast('loading:hide');
            //sync the current URL to the router
            $urlRouter.sync();
          },
          function () {
            $rootScope.$broadcast('loading:hide');
            //sync the current URL to the router
            $urlRouter.sync();
          }
        );

      }*/

      // Configures $urlRouter's listener *after* your custom listener
      $urlRouter.listen();
    }

    function stateChangeStartCallback(event, toState, toParams, fromState, fromParams) {


      // if its the users first visit to the app show the apps tour
      if (toState.name !== 'app.main-slider') {
        if (!UserStateService.getFirstVisit()) {
          event.preventDefault();
          $state.go('app.main-slider');
          return;
        }
      }


      //redirects for logged in user away from login or register and show its profile instead
      if (toState.name == 'app.login' || toState.name == 'app.register') {
        if (AuthenticationService.getConnectionState()) {
          event.preventDefault();
          $state.go('app.profile');
          return;
        }
      }

      //redirect if user is unauthorized
      if (('data' in toState) && ('access' in toState.data) && !AuthenticationService.isAuthorized(toState.data.access)) {
        event.preventDefault();
        if (UserStateService.getIsRegistered()) {
          $state.go('app.login');
        } else {
          $state.go('app.register');
        }
      }

    }

  }


})();
