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
  function EvidenceGridCtrl($scope, uiGridConstants, uiGridSelectionService, $state, $log) {
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
          width: '50%'
        },
        { name: 'disease',
          displayName: 'Disease',
          enableFiltering: true
        },
        { name: 'drug',
          displayName: 'Drug',
          enableFiltering: true
        },
        { name: 'evidence_level',
          displayName: 'level',
          enableFiltering: false,
          width: '10%'
        },
        { name: 'rating',
          displayName: 'Rating',
          enableFiltering: false,
          sort: { direction: uiGridConstants.ASC },
          width: '10%'
        }
      ],
      minRowsToShow: 8
    };

    $scope.evidenceGridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'row selected ' + row;
        $log.info(msg);
        $state.go('events.genes.summary.variants.summary.evidence.summary', {
          geneId: $scope.gene.entrez_id,
          variantId: $scope.variant.name,
          evidenceId: row.entity.id
        });
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        var msg = 'rows changed ' + rows.length;
        $log.info(msg);
      });
    };

    $scope.gridInteractions = {
      rowClick: function (row) {
        $log.info("Row " + row.entity.id + " clicked.");

        $state.go('events.genes.summary.variants.summary.evidence.summary', {
          geneId: $scope.gene.entrez_id,
          variantId: $scope.variant.name,
          evidenceId: row.entity.id
        });
      }
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
