(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGrid', variantGrid)
    .controller('VariantGridCtrl', VariantGridCtrl);

  // @ngInject
  function variantGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: false,
      templateUrl: 'app/views/events/variantGroups/directives/variantGrid.tpl.html',
      controller: 'VariantGridCtrl'
    };
    return directive;
  }

  // @ngInject
  function VariantGridCtrl($scope, uiGridConstants, $stateParams, $state, $timeout, $log, _) {

  }
})();
