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
    $scope.security = {
      isAuthenticated: Security.isAuthenticated(),
      isEditor: Security.isEditor(),
      isAdmin: Security.isAdmin()
    };

    $scope.$state = $state;
    $scope.gene = Genes.data.item;
    $scope.stateParams = $stateParams;
    $scope.hasHiddenVariants = false;
    $scope.variants = Genes.data.variants;

    $scope.showAccepted = true;
    $scope.showSubmitted = false;
    $scope.showRejected = false;
    $scope.showOnlySubmitted = false;

    // functions used in ng-show directive on variant buttons
    $scope.hasValidEvidenceItems = function(variant) {
      var statuses = variant.evidence_item_statuses;
      return (statuses.accepted_count + statuses.submitted_count) > 0;
    };

    $scope.hasAcceptedItems = function(variant) {
      var statuses = variant.evidence_item_statuses;
      return (statuses.accepted_count) > 0;
    };

    $scope.hasOnlySubmittedItems = function(variant) {
      var statuses = variant.evidence_item_statuses;
      return (statuses.accepted_count === 0 && statuses.submitted_count > 0);
    };

    $scope.hasOnlyRejectedItems = function(variant) {
      return !$scope.hasValidEvidenceItems(variant);
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
        // _.reduce(collection, [iteratee=_.identity], [accumulator])
        $scope.variantsWithOnlySubmitted = _.reduce(variants, function(v) {

        });
        $scope.variantsWithOnlyRejected = 0;
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
