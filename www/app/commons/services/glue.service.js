;
(function () {
    'use strict';
    /**
     * @ngdoc service
     * @name mcTaxi.commons.sertvices.glue.service:GlueService
     * @description
     * This service holds general functions to help
     */
    angular
        .module('mcTaxi.commons.services.glue.service', [])
        .service('GlueService', GlueService);
    GlueService.$inject = [];
    function GlueService() {
        var glueService = {
            resetForm: resetForm
        };
        return glueService;
        ///////
        /**
         * @ngdoc method
         * @name resetForm
         * @methodOf mcTaxi.commons.sertvices.glue.service:GlueService
         * @description
         * Resets the given form
         *
         * @param form - The form to be reset
         */
        function resetForm(form) {
            console.log(form);
            form.$error = {};
            form.$setPristine();
            form.$setUntouched();
        }
    }
})();
