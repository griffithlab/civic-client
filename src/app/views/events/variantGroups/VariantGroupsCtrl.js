(function() {
  'use strict';
  angular.module('civic.events')
    .controller('VariantGroupsCtrl', VariantGroupsCtrl);

  // @ngInject
  function VariantGroupsCtrl($scope, VariantGroups, variantGroup, $stateParams, $log) {
    $log.info("======= VariantsGroupsCtrl loaded.");
    $scope.variantGroup = variantGroup;

  }
})();
