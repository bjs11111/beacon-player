angular.module('commons.offlineBar', ['prioloc.diagnostic'])
  .directive('offlineBar', [ '$ionicPlatform','DiagnosticChannel',
                              function($ionicPlatform, DiagnosticChannel) {
	  return {
	    restrict: 'E',
	    replace:true,
	    scope: {
	    	content		: '@content'
	    },
	    templateUrl: 'app/commons/offline-bar/offline-bar.template.html',
	    link: function($scope, element, attrs) {

        $scope.color =  ($scope.color) ? $scope.color : 'bar-assertive';
        $scope.visible =  !!($scope.visible);

	    	init();

        function init() {
          DiagnosticChannel.subIsOfflineChanged($scope, isOfflineChangedHandler);
        }

        function isOfflineChangedHandler(args) {
          $scope.visible = !!(args);
        }

      }
	  }
}]);
