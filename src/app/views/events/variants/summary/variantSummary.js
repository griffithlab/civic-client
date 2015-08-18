(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('VariantSummaryController', VariantSummaryController)
    .directive('variantSummary', function() {
      return {
        restrict: 'E',
        scope: {
          showEvidenceGrid: '='
        },
        controller: 'VariantSummaryController',
        templateUrl: 'app/views/events/variants/summary/variantSummary.tpl.html'
      };
    });

  //@ngInject
  function VariantSummaryController($scope, $state, $stateParams, Security, Variants, VariantsViewOptions) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isEdit = $state.includes('**.edit.**');
    $scope.stateParams = $stateParams;

    $scope.variant = Variants.data.item;
    $scope.evidence = Variants.data.evidence;
    $scope.VariantsViewOptions = VariantsViewOptions;
    $scope.backgroundColor = VariantsViewOptions.styles.view.backgroundColor;

  }
})();
