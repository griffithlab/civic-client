(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneSummaryController', GeneSummaryController)
    .directive('geneSummary', function() {
      return {
        restrict: 'E',
        scope: {
          showMenu: '='
        },
        controller: 'GeneSummaryController',
        templateUrl: 'app/views/events/genes/summary/geneSummary.tpl.html'
      }
    });

  function GeneSummaryController($scope, Genes, GenesViewOptions) {
    $scope.gene = Genes.data.item;
    $scope.myGeneInfo = Genes.data.myGeneInfo;
    $scope.GenesViewOptions = GenesViewOptions;
    $scope.backgroundColor = GenesViewOptions.styles.view.backgroundColor;
  }
})();
