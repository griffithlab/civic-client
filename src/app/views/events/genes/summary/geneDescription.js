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
        templateUrl: 'app/views/events/genes/summary/geneDescription.tpl.html'
      }
    });

  // @ngInject
  function GeneDescriptionController($scope) {
    // $scope.gene exists from isolate scope attribute
  }
})();
