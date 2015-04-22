(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('EditGeneController', EditGeneController)
    .directive('editGene', editGeneDirective);

  // @ngInject
  function editGeneDirective() {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'app/views/events/genes/edit/editGene.tpl.html',
      controller: 'EditGeneController'
    }
  }

  // @ngInject
  function EditGeneController ($scope) {
    var ctrl = $scope.ctrl = {};

    ctrl.message = "hello";
  }
})();
