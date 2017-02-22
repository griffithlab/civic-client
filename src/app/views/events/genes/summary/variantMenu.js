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
      var non_rejected_count = _.reduce(variant.evidence_items, function(acc, val, key) {
        if(key !== 'rejected_count') {
          return acc + val;
        } else {
          return acc;
        }
      });
      return non_rejected_count > 0;
    };

    var addVarGroupUrlBase = $scope.addVarGroupUrl = '#/add/variantGroup';

    function mapVariantStatuses(variants, statuses) {
      return _.map(variants, function(variant) {
        variant.statuses = _.chain(statuses)
          .find({id:variant.id})
          .pick(['has_pending_fields', 'has_pending_evidence'])
          .value();
        return variant;
      });
    }

    $scope.$watchCollection('stateParams', function(stateParams){
      if(_.has(stateParams, 'geneId')) {
        $scope.addVarGroupUrl = addVarGroupUrlBase + '?geneId=' + stateParams.geneId;
      }
    });

    $scope.$watchCollection(
      function() { return Genes.data.variantStatuses; },
      function(variantStatuses) {

        $scope.variants = mapVariantStatuses(Genes.data.variants, variantStatuses);
        // _.map(Genes.data.variants, function(variant) {
        //   variant.statuses = _.chain(variantStatuses)
        //     .find({id:variant.id})
        //     .pick(['has_pending_fields', 'has_pending_evidence'])
        //     .value();
        //   return variant;
        // });
      });

    $scope.$watchCollection(
      function() { return Genes.data.variants; },
      function(variants){
        $scope.hasHiddenVariants = !_.every(variants, function(variant) {
          return $scope.hasValidEvidenceItems(variant);
        });
        $scope.variants = variants;
      });


    $scope.$watchCollection(
      function() { return Genes.data.variantGroups; },
      function(variantGroups){
        $scope.variantGroups = _.map(variantGroups, function(vg){
          // determine if all variants in this variant group are from a single gene
          // (if so, template will show gene names in variant tags)
          var singleGene = _.every(vg.variants, { gene_id: vg.variants[0].gene_id });
          vg.variants = _.map(vg.variants, function(variant) {
            variant.singleGene = singleGene;
            return variant;
          });
          mapVariantStatuses(vg.variants, Genes.data.variantStatuses);
          return vg;
        });
      });
  }
})();
