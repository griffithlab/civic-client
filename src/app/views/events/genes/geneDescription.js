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
        link: function() {
          console.log('GeneDescriptionController linking function called.');
        },
        controller: 'GeneDescriptionController',
        templateUrl: 'app/views/events/genes/geneDescription.tpl.html'
      }
    });

  // @ngInject
  function GeneDescriptionController($scope) {
    var ctrl = $scope.ctrl = {};
    ctrl.gene = $scope.gene;

    console.log('------- GeneDescriptionController created.');
  }
})();
