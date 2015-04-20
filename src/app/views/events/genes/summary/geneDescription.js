(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneDescriptionController', GeneDescriptionController)
    .directive('geneDescription', function() {
      return {
        restrict: 'E',
        controller: 'GeneDescriptionController',
        link: geneDescriptionLink,
        templateUrl: 'app/views/events/genes/summary/geneDescription.tpl.html'
      }
    });

  // @ngInject
  function geneDescriptionLink(scope, element, attrs) {

  }

  // @ngInject
  function GeneDescriptionController($scope) {
    // geneDescription template uses ctrl from geneSummary
  }
})();
