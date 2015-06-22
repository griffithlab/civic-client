(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .controller('VariantGroupSummaryController', VariantGroupSummaryController)
    .directive('variantGroupSummary', function() {
      return {
        restrict: 'E',
        scope: {
          showVariantGrid: '='
        },
        controller: 'VariantGroupSummaryController',
        templateUrl: 'app/views/events/variantGroups/summary/variantGroupSummary.tpl.html'
      };
    });

  function VariantGroupSummaryController($scope, VariantGroups, VariantGroupsViewOptions) {
    $scope.variantGroup = VariantGroups.data.item;
    $scope.variants = VariantGroups.data.variants;
    $scope.VariantGroupsViewOptions = VariantGroupsViewOptions;
    $scope.backgroundColor = VariantGroupsViewOptions.styles.view.backgroundColor;
  }
})();
