(function () {
  'use strict';
  angular.module('civic.common')
    .directive('subheader', subheader)
    .controller('SubheaderCtrl', SubheaderCtrl);

  // @ngInject
  function subheader() {
    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: 'components/directives/subheader.tpl.html',
      controller: SubheaderCtrl
    };
    return directive;
  }

  // @ngInject
  function SubheaderCtrl($scope, $rootScope, Genes, Variants, _, $log) {
    $scope.view = { };
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams) {
      $log.info('========== $stateChangeSuccess detected. toState: ' + toState);
      $scope.view.params = toParams;
      if(_.has(toParams, 'geneId')) {
        Genes.get({ 'geneId': toParams.geneId })
          .$promise
          .then(function(gene) {
          $scope.view.gene = gene;
        });
      }
      if(_.has(toParams, 'variantId') && _.has(toParams, 'geneId')) {
        Variants.get({'geneId': toParams.geneId, variantId: toParams.variantId })
          .$promise
          .then(function(variant) {
            $scope.view.variant = variant;
        });
      }

      $scope.view.title = $scope.$eval(toState.data.titleExp);

    });
  }
})();
