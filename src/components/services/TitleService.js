(function() {
  'use strict';
  angular.module('civic.services')
    .service('TitleService', TitleService);

  // @ngInject
  // Titles are constructed by parsing the state's data.titleExp string within a scope constructed
  // of the relevant CIViC entities (gene, variant, evidenceItem, variantGroup)
  function TitleService($rootScope, Genes, Variants, Evidence, VariantGroups, _, $q, $parse) {
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams) {
      var title = '';

      var titleScope = {
        gene: {},
        variant: {},
        evidenceItem: {},
        variantGroup: {}
      };

      // construct promises for relevant entities
      if(_.has(toParams, 'geneId') && titleScope.gene.entrez_id !== toParams.geneId) {
        var genePromise = Genes.get({'geneId': toParams.geneId }).$promise;
      }

      if((_.has(toParams, 'geneId') && _.has(toParams, 'variantId')) && titleScope.variant.id !== toParams.variantId) {
        var variantPromise = Variants.get({'geneId': toParams.geneId, 'variantId': toParams.variantId }).$promise;
      }

      if((_.has(toParams, 'variantGroupId')) && titleScope.variantGroup.id !== toParams.variantGroupId) {
        var variantGroupsPromise = VariantGroups.get({'variantGroupId': toParams.variantGroupId }).$promise;
      }

      if((_.has(toParams, 'geneId') && _.has(toParams, 'variantId') && _.has(toParams, 'evidenceItemId')) && titleScope.evidenceItem.id !== toParams.evidenceItemId) {
        var evidenceItemPromise = Evidence.get({'geneId': toParams.geneId, 'variantId': toParams.variantId, 'evidenceItemId': toParams.evidenceItemId }).$promise;
      }

      // resolve promises, apply $parse with constructed title scope
      $q.all({ gene: genePromise, variant: variantPromise, evidenceItem: evidenceItemPromise, variantGroup: variantGroupsPromise }).then(function(resolutions) {
        titleScope.gene = resolutions.gene;
        titleScope.variant = resolutions.variant;
        titleScope.evidenceItem = resolutions.evidenceItem;
        titleScope.variantGroup = resolutions.variantGroup;
        title = $parse(toState.data.titleExp)(titleScope);
        $rootScope.$broadcast('title:update', { newTitle: title });
      });
    });
  }

})();
