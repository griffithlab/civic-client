(function() {
  'use strict';
  angular.module('civic.services')
    .service('TitleService', TitleService);

  // @ngInject
  // Titles are constructed by parsing the state's data.titleExp string within a scope constructed
  // of the relevant CIViC entities (gene, variant, evidenceItem, variantGroup)
  function TitleService($rootScope, Genes, Variants, Evidence, VariantGroups, Users, _, $q, $parse) {
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams) {
      var title = '';

      var titleScope = {
        gene: {},
        variant: {},
        evidence: {},
        variantGroup: {},
        user: {}
      };

      var genePromise, variantPromise, variantGroupsPromise, evidencePromise, usersPromise;

      // TODO: get needed entity resources by querying $state.$current.globals
      // note: requires that all resources necessary for parsing a state's titleExp must be resolved by ui-router state config

      // construct promises for relevant entities
      if(_.has(toParams, 'geneId') && titleScope.gene.entrez_id !== toParams.geneId) {
        genePromise = Genes.get(toParams.geneId);
      }

      if(_.has(toParams, 'variantId') && titleScope.variant.id !== toParams.variantId) {
        variantPromise = Variants.get(toParams.variantId);
      }

      if(_.has(toParams, 'variantGroupId') && titleScope.variantGroup.id !== toParams.variantGroupId) {
        variantGroupsPromise = VariantGroups.get(toParams.variantGroupId);
      }

      if(_.has(toParams, 'evidenceId') && titleScope.evidence.id !== toParams.evidenceId) {
        evidencePromise = Evidence.get(toParams.evidenceId);
      }

      if(_.has(toParams, 'userId') && titleScope.user.id !== toParams.userId) {
        usersPromise = Users.get(toParams.userId);
      }

      // resolve promises, apply $parse with constructed title scope
      $q.all({
        gene: genePromise,
        variant: variantPromise,
        evidence: evidencePromise,
        variantGroup: variantGroupsPromise,
        user: usersPromise})
        .then(function(resolutions) {
          titleScope.gene = resolutions.gene;
          titleScope.variant = resolutions.variant;
          titleScope.evidence = resolutions.evidence;
          titleScope.variantGroup = resolutions.variantGroup;
          titleScope.user = resolutions.user;

          title = $parse(toState.data.titleExp)(titleScope);

          $rootScope.$broadcast('title:update', { newTitle: title });
        });
    });
  }

})();
