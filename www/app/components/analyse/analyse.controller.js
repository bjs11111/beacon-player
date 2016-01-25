;(function() {
	'use strict';

	angular.module('bp.analyse.controller', ['commons.directives.analyseConfigForm.directive',  'commons.services.gps.factory'])
		   .controller('AnalyseController', AnalyseController);

	AnalyseController.$inject = ['GpsService'];

	function AnalyseController(   GpsService) {

		var vm = this;

		////////////////

	}

})();
