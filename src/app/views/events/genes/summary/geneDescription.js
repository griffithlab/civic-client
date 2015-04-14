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
    // note that 'gene' exists on scope from DDO.scope
  }
})();
