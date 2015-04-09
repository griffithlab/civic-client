(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneDescriptionController', GeneDescriptionController)
    .directive('geneDescription', function() {
      return {
        restrict: 'E',
        scope: {
          gene: '='
        },
        controller: 'GeneDescriptionController',
        templateUrl: 'app/views/events/genes/geneDescription.tpl.html'
      }
    });

  // @ngInject
  function GeneDescriptionController($scope) {
    var ctrl = $scope.ctrl = {};
    ctrl.gene = $scope.gene;
  }
})();
