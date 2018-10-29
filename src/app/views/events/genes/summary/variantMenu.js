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


    // functions used in ng-show directive on variant buttons
    $scope.hasValidEvidenceItems = function(variant) { // has accepted and/or submitted items
      var statuses = variant.evidence_item_statuses;
      return (statuses.accepted_count + statuses.submitted_count) > 0;
    };

    $scope.hasAcceptedItems = function(variant) {
      var statuses = variant.evidence_item_statuses;
      return (statuses.accepted_count) > 0;
    };

    $scope.hasSubmittedItems = function(variant) {
      var statuses = variant.evidence_item_statuses;
      return (statuses.submitted_count) > 0;
    };

    $scope.hasRejectedItems = function(variant) {
      var statuses = variant.evidence_item_statuses;
      return (statuses.submitted_count) > 0;
    };

    $scope.hasNoItems = function(variant) { // is orphan
      var statuses = variant.evidence_item_statuses;
      return statuses.accepted_count === 0 && statuses.submitted_count === 0 && statuses.rejected_count === 0;
    };

    var addVarGroupUrlBase = $scope.addVarGroupUrl = 'add/variantGroup';

    $scope.order = {
      field: 'name',
      reverse: false
    };

    $scope.sortOptions = [
      { value: true, label: 'descending' },
      { value: false, label: 'ascending' }
    ];

    $scope.variantMenuOrderBy = function(variant) {
      var order = 0;
      switch ($scope.order.field) {
      case 'name':
        order = variant.name;
        break;
      case 'position':
        order = variant.coordinates.start;
        break;
      default:
        order = variant.name;
      }
      return order;
    };

    $scope.$watchCollection('stateParams', function(stateParams){
      if(_.has(stateParams, 'geneId')) {
        $scope.addVarGroupUrl = addVarGroupUrlBase + '?geneId=' + stateParams.geneId;
      }
    });
    $scope.evidence_category_counts = {
      accepted: 0, // variants with accepted evidence
      submitted: 0, // variants with submitted evidence
      rejected: 0,
      orphaned: 0 // variants with rejected evidence
    };

    $scope.options_filter = 'accepted';
    $scope.query = '';
    $scope.variantFilterFn = function(variant) {
      return  ( $scope.options_filter === 'accepted' && $scope.hasAcceptedItems(variant) )
        || ( $scope.options_filter === 'accepted_submitted' && ($scope.hasAcceptedItems(variant) || $scope.hasSubmittedItems(variant)) )
        || ( $scope.options_filter === 'submitted' && $scope.hasSubmittedItems(variant) )
        || ( variant.id === $scope.stateParams.variantId )
        || ( $scope.options_filter === 'all' ) ;
    };

    $scope.$watchCollection(
      function() { return Genes.data.variantsStatus.variants; },
      function(variants){
        $scope.nullCoordVars = [];
        _.forEach(variants, function(variant) {
          var counts = variant.evidence_item_statuses;
          var hasAccepted = false;
          var hasSubmitted = false;
          if (counts.accepted_count > 0) { $scope.evidence_category_counts.accepted++; hasAccepted = true; }
          if (counts.submitted_count > 0) { $scope.evidence_category_counts.submitted++; hasSubmitted = true; }
          if (counts.rejected_count > 0) { $scope.evidence_category_counts.rejected++;}
          if (counts.accepted_count === 0 && counts.submitted_count === 0 && counts.rejected_count === 0) { $scope.evidence_category_counts.orphaned++;}
          // if variant has no start coords, add to nullCoordVars list, to be displayed in display options sort menu
          if (!variant.coordinates.start && (hasAccepted || hasSubmitted)) { $scope.nullCoordVars.push(variant.name); }
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
