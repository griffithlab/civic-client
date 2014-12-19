(function() {
  'use strict';
  angular.module('civic.services')
    .factory('TitleService', TitleService);

  // @ngInject
  function TitleService($rootScope, $scope, Genes, Variants) {
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, $log) {
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

      return $scope.$eval(toState.data.titleExp);
    });
  }

})();
