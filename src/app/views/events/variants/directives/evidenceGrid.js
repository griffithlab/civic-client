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
  function EvidenceGridCtrl($scope, uiGridConstants, uiGridSelectionService, $stateParams, $state, $timeout, $log) {
    $log.info('EvidenceGridCtrl loaded');

    /*jshint camelcase: false */
    $scope.evidenceGridOptions = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      rowTemplate: 'app/views/events/variants/directives/evidenceGridRow.tpl.html',
      columnDefs: [
        { name: 'explanation',
          displayName: 'Supporting Evidence',
          enableFiltering: true,
          allowCellFocus: false,
          width: '50%'
        },
        { name: 'disease',
          displayName: 'Disease',
          allowCellFocus: false,
          enableFiltering: true
        },
        { name: 'drug',
          displayName: 'Drug',
          allowCellFocus: false,
          enableFiltering: true
        },
        { name: 'evidence_level',
          displayName: 'level',
          allowCellFocus: false,
          enableFiltering: false,
          width: '10%'
        },
        { name: 'rating',
          displayName: 'Rating',
          allowCellFocus: false,
          enableFiltering: false,
          sort: { direction: uiGridConstants.ASC },
          width: '10%'
        }
      ],
      maxRowsToShow: 5
    };

    $scope.evidenceGridOptions.onRegisterApi = function(gridApi){

      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        $state.go('events.genes.summary.variants.summary.evidence.summary', {
          geneId: $scope.gene.entrez_id,
          variantId: $scope.variant.name,
          evidenceId: row.entity.id
        });
      });

      // fetch variant data
      $scope.variant.$promise.then(function(variant) {
        $scope.evidenceGridOptions.data = variant.evidence_items;

        // if evidenceId specified in state, scroll to evidence item's row and select it
        if(_.has($stateParams, 'evidenceId')) {
          var rowEntity = _.find(variant.evidence_items, function(item) { return item.id == $stateParams.evidenceId; });
          $timeout(function() { // need timeout here until ui-grid adds a 'data rendered' event
            gridApi.selection.selectRow(rowEntity);
            gridApi.cellNav.scrollTo( gridApi.grid, $scope, rowEntity, $scope.evidenceGridOptions.columnDefs[0]);
          }, 250);
        }

      });

    };



  }

  function ceilFilter() {
    return function(num) {
      return Math.ceil(num);
    };
  }

})();
