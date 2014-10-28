angular.module('civic.event')
  .controller('VariantCtrl', VariantCtrl);

// @ngInject
function VariantCtrl($rootScope, $scope, $stateParams, $resource, $state, $stickyState, $log) {
  'use strict';
  $rootScope.setNavMode('sub');
  $rootScope.setTitle('Event ' + $stateParams.geneId + ' / ' + $stateParams.variantId);

  $scope.variant = {
    name: $stateParams.variantId
  };

}
