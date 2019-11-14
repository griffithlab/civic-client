(function() {
  'use strict';
  angular.module('civic.common')
    .directive('addDrugForm', addDrugForm);

  // @ngInject
  function addDrugForm() {
    var directive = {
      restrict: 'E',
      template: '<div>{{message}}</div>',
      replace: true,
      scope: true,
      controller: addDrugFormController
    };

    return directive;
  }

  function addDrugFormController($scope, ConfigService) {
    $scope.message = 'This is the addDrugForm directive.';
  }
})();
