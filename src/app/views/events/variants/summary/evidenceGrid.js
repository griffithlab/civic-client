(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceGrid', evidenceGrid)
    .controller('EvidenceGridController', EvidenceGridController);

  // @ngInject
  function evidenceGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        evidence: '='
      },
      templateUrl: 'app/views/events/variants/summary/evidenceGrid.tpl.html',
      controller: 'EvidenceGridController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceGridController($scope, $stateParams, $state, uiGridConstants, _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};

    ctrl.evidenceGridOptions = {
      enablePaginationControls: true,
      paginationPageSizes: [4],
      paginationPageSize: 4,
      minRowsToShow: 5,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      rowTemplate: 'app/views/events/variants/summary/evidenceGridRow.tpl.html',
      columnDefs: [
        { name: 'id',
          displayName: 'EID',
          enableFiltering: false,
          allowCellFocus: false,
          width: '5%'
        },
        { name: 'description',
          displayName: 'Supporting Evidence',
          enableFiltering: true,
          allowCellFocus: false,
          width: '45%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridEvidenceCell.tpl.html'
        },
        { name: 'disease',
          displayName: 'Disease',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDiseaseCell.tpl.html'
        },
        { name: 'drugs',
          displayName: 'Drug',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDrugCell.tpl.html'
        },
        { name: 'evidence_level',
          displayName: 'Level',
          allowCellFocus: false,
          enableFiltering: true,
          sort: { direction: uiGridConstants.ASC },
          width: '8%',
          cellTemplate: 'app/views/events/variants/summary/evidenceGridLevelCell.tpl.html'
        },
        { name: 'rating',
          displayName: 'Rating',
          allowCellFocus: false,
          enableFiltering: false,
          sort: { direction: uiGridConstants.DESC },
          width: '15%',
          cellTemplate: 'app/views/events/variants/summary/evidenceGridRatingCell.tpl.html'
          //cellTemplate: '<div>{{row.entity[col.field]}}</div>'
        }
      ]
    };

    ctrl.evidenceGridOptions.onRegisterApi = function(gridApi){
      // TODO: this watch seems unnecessary, but if it's not present then the grid only loads on a fresh page, fails when loaded by a state change
      // Something to do with directive priorities, maybe?
      $scope.$watch('evidence', function(evidence) {
        ctrl.gridApi = gridApi;
        ctrl.evidenceGridOptions.minRowsToShow = evidence.length + 1;
        evidence = _.map(evidence, function(item) { item.drugs = _.chain(item.drugs).pluck('name').value().join(", "); return item; })
        ctrl.evidenceGridOptions.data = evidence;

        gridApi.selection.on.rowSelectionChanged($scope, function(row){
          var params = _.merge($stateParams, { evidenceId: row.entity.id })
          $state.go('events.genes.summary.variants.summary.evidence.summary', params);
        });

      });
    };
  }

})();
