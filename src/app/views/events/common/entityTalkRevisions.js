(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityTalkRevisionsController', EntityTalkRevisionsController)
    .directive('entityTalkRevisions', entityTalkRevisionsDirective);

  // @ngInject
  function entityTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {
        entityTalkModel: '='
      },
      link: entityTalkRevisionsLink,
      controller: 'EntityTalkRevisionsController',
      templateUrl: 'app/views/events/common/entityTalkRevisions.tpl.html'
    }
  }

  // @ngInject
  function entityTalkRevisionsLink(scope, element, attrs) {

  }

  // @ngInject
  function EntityTalkRevisionsController($scope, $stateParams, $state, uiGridConstants, _) {
    var ctrl = $scope.ctrl = {};
    var entityTalkModel = ctrl.entityTalkModel = $scope.entityTalkModel;

    // merge revisions and suggested changes
    ctrl.revisions= entityTalkModel.data.changes.concat(entityTalkModel.data.revisions);

    ctrl.revisionsGridOptions = {
      minRowsToShow: 9,

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
      // rowTemplate: 'app/views/events/variants/summary/evidenceGridRow.tpl.html',
      columnDefs: [
        { name: 'id',
          displayName: 'RID',
          enableFiltering: false,
          allowCellFocus: false,
          width: '5%'
        },
        { name: '',
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
        { name: 'drug',
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

    ctrl.revisionsGridOptions.onRegisterApi = function(gridApi){
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        $state.go('events.genes.summary.variants.summary.evidence.summary', {
          geneId: $scope.gene.entrez_id,
          variantId: $scope.variant.id,
          evidenceId: row.entity.id
        });
      });

      // TODO: refactor this, do we really need a watcher here?

      ctrl.evidenceGridOptions.minRowsToShow = $scope.evidenceItems.length + 1;
      ctrl.evidenceGridOptions.data = $scope.evidenceItems;
      // if revisionId specified in state, scroll to evidence item's row and select it
      if(_.has($stateParams, 'revisionId')) {
        var rowEntity = _.find($scope.evidenceItems, function(item) {
          return item.id === +$stateParams.evidenceItemId;
        });
        gridApi.core.on.rowsRendered($scope, function() {
          gridApi.selection.selectRow(rowEntity);
          gridApi.cellNav.scrollTo( gridApi.grid, $scope, rowEntity, $scope.evidenceGridOptions.columnDefs[0]);
        });
      }

    };

  }

})();
