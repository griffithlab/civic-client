(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('VariantMenuController', VariantMenuController)
    .directive('variantMenu', function() {
      return {
        restrict: 'E',
        scope: {
          options: '='
        },
        controller: 'VariantMenuController',
        templateUrl: 'app/views/events/genes/summary/variantMenu.tpl.html'
      };
    });

  //@ngInject
  function VariantMenuController($scope, $state, $stateParams, Genes, Security, _) {
    $scope.gene = Genes.data.item;
    $scope.stateParams = $stateParams;
    $scope.hasHiddenVariants = false;
    $scope.variants = Genes.data.variants;

    $scope.security = {
      isAuthenticated: Security.isAuthenticated(),
      isEditor: Security.isEditor(),
      isAdmin: Security.isAdmin()
    };

    $scope.$state = $state;

    $scope.hasValidEvidenceItems = function(variant) {
      var statuses = variant.evidence_item_statuses;
      return (statuses.accepted_count + statuses.submitted_count) > 0;
    };

    $scope.hasAcceptedEvidenceItems = function(variant) {
      var statuses = variant.evidence_item_statuses;
      return (statuses.accepted_count) > 0;
    };

    var addVarGroupUrlBase = $scope.addVarGroupUrl = 'add/variantGroup';

    $scope.$watchCollection('stateParams', function(stateParams){
      if(_.has(stateParams, 'geneId')) {
        $scope.addVarGroupUrl = addVarGroupUrlBase + '?geneId=' + stateParams.geneId;
      }
    });

    $scope.$watchCollection(
      function() { return Genes.data.variantsStatus.variants; },
      function(variants){
        $scope.hasHiddenVariants = !_.every(variants, function(variant) {
          return $scope.hasValidEvidenceItems(variant);
        });
        $scope.variants = variants;
      });

    $scope.$watch(
      function() { return Genes.data.variantsStatus.variant_groups; },
      function(variant_groups){

        $scope.variantGroups = _.map(variant_groups, function(vg){
          // determine if all variants in this variant group are from a single gene
          // (if so, template will show gene names in variant tags)
          var multiGeneGroup = !_.every(vg.variants, { gene_id: vg.variants[0].gene_id });
          vg.variants = _.map(vg.variants, function(variant) {
            variant.multiGeneGroup = multiGeneGroup;
            return variant;
          });
          return vg;
        });
      }, true);
  }
})();
