;(function() {
	
	 angular
	 .module('drupalionicDemo.Analyse.service', ['ngDrupal7Services-3_x.commons.configurations','ngDrupal7Services-3_x.commons.helperService', 
	                                             'ngDrupal7Services-3_x.resources.user.resource', 'ngDrupal7Services-3_x.commons.authentication.service'])
	.factory('AnalyseService', AnalyseService);
	 
	AnalyseService.inject = ['$q','$filter','$rootScope','DrupalApiConstant','DrupalHelperService','UserResource','AuthenticationService','AuthenticationChannel' ]
    
	function AnalyseService ( $q,  $filter,  $rootScope,  DrupalApiConstant,  DrupalHelperService,  UserResource,  AuthenticationService,  AuthenticationChannel  ) {


		
		 /////////////////////////////////////////////////////////////

		
			
		
	}
	
	
})();
