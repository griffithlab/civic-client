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
    $scope.variants = Genes.data.variants;
    $scope.stateParams = $stateParams;
    $scope.security = {
      isAuthenticated: Security.isAuthenticated(),
      isAdmin: Security.isEditor()
    };

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

    $scope.$watchCollection('stateParams', function(stateParams){
      if(_.has(stateParams, 'geneId')) {
        $scope.addVarGroupUrl = addVarGroupUrlBase + '?geneId=' + stateParams.geneId;
      }
    });

    $scope.$watchCollection(
      function() { return Genes.data.variants; },
      function(variants){
        $scope.variants = variants;
      });


    $scope.$watchCollection(
      function() { return Genes.data.variantGroups; },
      function(variantGroups){
        $scope.variantGroups = _.map(variantGroups, function(vg){
          vg.singleGene = _.every(vg.variants, { gene_id: vg.variants[0].gene_id });
          return vg;
        });
      });
  }
})();
