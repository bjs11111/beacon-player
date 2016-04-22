;
(function () {
  'use strict';

  angular
    .module('commons.validation.setValidAfterChange.directive', [])
    .directive('setValidAfterChange', setValidAfterChange);

  //setValidAfterChange.$inject = [''];

  /** @ngInject */
  function setValidAfterChange() {

    return {
      // restrict to an attribute type.
      restrict: 'A',
      // element must have ng-model attribute.
      require: 'ngModel',
      link: function (scope, ele, attrs, ngModelCtrl) {

        var validation = attrs.setValidAfterChange,
            //@TODO save invaid value and set valid only if changed
            invalidValue = '';

        ngModelCtrl.$parsers.unshift(function (value) {

        if (ngModelCtrl.$error[validation]) {
          if (value) {
            ngModelCtrl.$setValidity(validation, true);
          }
        }
        //return the value to the model,
        return value;
        });
      }

    };

  };


})();
