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
  function VariantMenuController($scope, $state, $stateParams, Genes, Variants, Security, _) {
    $scope.gene = Genes.data.item;
    $scope.variants = Genes.data.variants;
    $scope.stateParams = $stateParams;
    $scope.hasHiddenVariants = false;

    $scope.security = {
      isAuthenticated: Security.isAuthenticated(),
      isEditor: Security.isEditor(),
      isAdmin: Security.isAdmin()
    };

    $scope.$state = $state;

    /*
    $scope.$on('revisionDecision', function(){
      //Genes.get(Genes.data.item.id);
      Genes.update(Genes.data.item.id)
      .then(function(fields){
        console.log(fields); // giving me old value
        //$scope.variants.forEach(function(elem, index, arr){
          //Variants.get(arr[index].id)
          //.then(function(fields){
            //arr[index].name = fields.name; // need to deal with evidence_items and make sure no hiccups with adding variant groups
          //});
        //}); 
      });
    });
    */

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
        $scope.hasHiddenVariants = !_.every(variants, function(variant) {
          return $scope.hasValidEvidenceItems(variant);
        });
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
