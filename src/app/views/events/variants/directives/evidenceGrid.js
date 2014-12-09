(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceGrid', evidenceGrid)
    .controller('EvidenceGridCtrl', EvidenceGridCtrl)
    .filter('ceil', ceilFilter);

  // @ngInject
  function evidenceGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: false,
      templateUrl: 'app/views/events/variants/directives/evidenceGrid.tpl.html',
      controller: 'EvidenceGridCtrl'
    };
    return directive;
  }

// @ngInject
  function EvidenceGridCtrl($scope, uiGridConstants, uiGridSelectionService, _, $log) {
    $log.info('EvidenceGridCtrl loaded');

    /*jshint camelcase: false */
    $scope.evidenceGridOptions = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      rowTemplate: 'app/views/events/variants/directives/evidenceGridRow.tpl.html',
      columnDefs: [
        { name: 'rating',
          displayName: 'Rating',
          enableFiltering: false,
          sort: { direction: uiGridConstants.ASC }
        },
        { name: 'evidence_level',
          displayName: 'level',
          enableFiltering: true
        },
        { name: 'explanation',
          displayName: 'Explanation',
          enableFiltering: true
        },
        { name: 'disease',
          displayName: 'Disease',
          enableFiltering: true
        },
        { name: 'drug',
          displayName: 'Drug',
          enableFiltering: true
        },
        { name: 'id',
          displayName: 'ID',
          enableFiltering: true
        }
      ],
      minRowsToShow: 10
    };

    $scope.gridInteractions = {
      rowClick: function (row) {
        $state.go('events.genes.summary.variants.summary.evidence.summary', {
          geneId: row.entity.entrez_id,
          variantId: row.entity.variant,
          evidenceId: row.entity.evidenceId
        });
      }
      //,rowHover: function(row) {
      //  row.isSelected ? row.isSelected = false : row.isSelected = true;
      //}
    };

    $scope.variant.$promise.then(function(variant) {
      $scope.evidenceGridOptions.data = variant.evidence_items;
    });


  }

  function ceilFilter() {
    return function(num) {
      return Math.ceil(num);
    };
  }

})();
