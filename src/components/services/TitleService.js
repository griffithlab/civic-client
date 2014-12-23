(function() {
  'use strict';
  angular.module('civic.services')
    .service('TitleService', TitleService);

  // @ngInject
  function TitleService($rootScope, Genes, Variants, Evidence, _, $q, $parse) {
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams) {
      var title = '';

      var titleScope = {
        gene: {},
        variant: {},
        evidenceItem: {}
      };

      if(_.has(toParams, 'geneId') && titleScope.gene.entrez_id !== toParams.geneId) {
        var genePromise = Genes.get({'geneId': toParams.geneId }).$promise;
      }

      if((_.has(toParams, 'geneId') && _.has(toParams, 'variantId')) && titleScope.variant.id !== toParams.variantId) {
        var variantPromise = Variants.get({'geneId': toParams.geneId, 'variantId': toParams.variantId }).$promise;
      }

      if((_.has(toParams, 'geneId') && _.has(toParams, 'variantId') && _.has(toParams, 'evidenceId')) && titleScope.evidenceItem.id !== toParams.evidenceId) {
        var evidenceItemPromise = Evidence.get({'geneId': toParams.geneId, 'variantId': toParams.variantId, 'evidenceId': toParams.evidenceId }).$promise;
      }

      $q.all({ gene:genePromise, variant: variantPromise, evidenceItem: evidenceItemPromise }).then(function(resolutions) {
        titleScope.gene = resolutions.gene;
        titleScope.variant = resolutions.variant;
        titleScope.evidenceItem = resolutions.evidenceItem;
        title = $parse(toState.data.titleExp)(titleScope);
        $rootScope.$broadcast('title:update', { newTitle: title });
      });
    });
  }

})();
