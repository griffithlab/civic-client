(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneDescriptionController', GeneDescriptionController)
    .directive('geneDescription', function() {
      return {
        restrict: 'E',
        scope: {
          geneData: '='
        },
        controller: 'GeneDescriptionController',
        templateUrl: 'app/views/events/genes/summary/geneDescription.tpl.html'
      };
    });

  // @ngInject
  function GeneDescriptionController($scope, $state, Security) {
    var vm = $scope.vm = {};
    vm.isAuthenticated = Security.isAuthenticated;
    vm.isEdit = $state.includes('**.edit.**');
  }
})();
