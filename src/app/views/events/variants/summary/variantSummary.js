(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('VariantSummaryController', VariantSummaryController)
    .directive('variantSummary', function() {
      return {
        restrict: 'E',
        scope: {
          showEvidenceGrid: '='
        },
        controller: 'VariantSummaryController',
        templateUrl: 'app/views/events/variants/summary/variantSummary.tpl.html'
      };
    });

  //@ngInject
  function VariantSummaryController($scope,
                                    $state,
                                    $stateParams,
                                    _,
                                    Security,
                                    Variants,
                                    VariantsViewOptions) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isEdit = $state.includes('**.edit.**');
    $scope.stateParams = $stateParams;

    $scope.variant = parseVariant(Variants.data.item);
    $scope.evidence = Variants.data.evidence;

    $scope.clinvar_ignore = ['N/A', 'NONE FOUND'];

    // watches any changes to the variant itself, but will also update evidence to pass to grid
    $scope.$watch(function() { return Variants.data.item; }, function(variant) {
      $scope.variant = variant;
      $scope.evidence = variant.evidence_items;
    }, true);

    $scope.$watch(function() { return Variants.data.myVariantInfo;}, function(myVariantInfo) {
      if(!_.isUndefined(myVariantInfo.cosmic)) {
        myVariantInfo.cosmic.cosmic_id_short = _.trim(myVariantInfo.cosmic.cosmic_id, 'COSM');
        myVariantInfo.entrez_id = $scope.variant.name;
      }
      $scope.myVariantInfo = myVariantInfo;
    }, true);

    $scope.VariantsViewOptions = VariantsViewOptions;
    $scope.backgroundColor = VariantsViewOptions.styles.view.backgroundColor;

    $scope.editClick = function() {
      if (Security.isAuthenticated()) {
        $state.go('events.genes.summary.variants.edit.basic', $stateParams);
      }
    };
  }

  function parseVariant(variant) {
    variant.assertions = [
      {
        id: 12345,
        name: 'ASR12345',
        description: 'Nam vestibulum accumsan nisl phasellus at dui in ligula mollis ultricies. Etiam vel tortor sodales tellus ultricies commodo.',
        fda_approved: true,
        fda_approval_information: 'Curabitur vulputate vestibulum lorem.',
        nccn_guideline: 'Gastric Cancer'
      },
      {
        id: 54321,
        name: 'ASR54321',
        description: 'Donec at pede nullam rutrum. In id erat non orci commodo lobortis nunc rutrum turpis sed pede. Donec at pede nullam rutrum. In id erat non orci commodo lobortis nunc rutrum turpis sed pede.',
        fda_approved: true,
        fda_approval_information: 'Nunc porta vulputate tellus.',
        nccn_guideline: 'Cutaneous Melanoma'
      },
      {
        id: 43243,
        name: 'ASR42343',
        description: 'Nam vestibulum accumsan nisl phasellus at dui in ligula mollis ultricies. Etiam vel tortor sodales tellus ultricies commodo.',
        fda_approved: false,
        fda_approval_information: 'Curabitur vulputate vestibulum lorem.',
        nccn_guideline: 'Kidney Cancer'
      },
      {
        id: 1923,
        name: 'ASR1923',
        description: 'Donec at pede nullam rutrum. In id erat non orci commodo lobortis nunc rutrum turpis sed pede. Donec at pede nullam rutrum. In id erat non orci commodo lobortis nunc rutrum turpis sed pede.',
        fda_approved: true,
        fda_approval_information: 'Curabitur vulputate vestibulum lorem.',
        nccn_guideline: 'Neuroendocrine Tumors'
      },
      {
        id: 521,
        name: 'ASR521',
        description: 'Nam vestibulum accumsan nisl phasellus at dui in ligula mollis ultricies. Etiam vel tortor sodales tellus ultricies commodo.',
        fda_approved: false,
        fda_approval_information: 'Curabitur vulputate vestibulum lorem.',
        nccn_guideline: 'Occult Primary'
      },
      {
        id: 543,
        name: 'ASR543',
        description: 'Donec at pede nullam rutrum. In id erat non orci commodo lobortis nunc rutrum turpis sed pede. Donec at pede nullam rutrum. In id erat non orci commodo lobortis nunc rutrum turpis sed pede.',
        fda_approved: false,
        fda_approval_information: 'Curabitur vulputate vestibulum lorem.',
        nccn_guideline: 'Cancer-related Fatigue'
      },
      {
        id: 549,
        name: 'ASR549',
        description: 'Donec at pede nullam rutrum. In id erat non orci commodo lobortis nunc rutrum turpis sed pede. Donec at pede nullam rutrum. In id erat non orci commodo lobortis nunc rutrum turpis sed pede.',
        fda_approved: false,
        fda_approval_information: 'Curabitur vulputate vestibulum lorem.',
        nccn_guideline: 'Soft Tissue Sarcoma'
      },
    ];

    return variant;
  }
})();
