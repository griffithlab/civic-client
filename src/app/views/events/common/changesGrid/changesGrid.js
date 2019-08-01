(function() {
  'use strict';
  angular.module('civic.events')
    .directive('changesGrid', changesGrid)
    .controller('ChangesGridController', ChangesGridController);

  // @ngInject
  function changesGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        changes: '=',
        rows: '=',
        context: '=',
      },
      templateUrl: 'app/views/events/common/changesGrid/changesGrid.tpl.html',
      controller: 'ChangesGridController'
    };
    return directive;
  }

  // @ngInject
  function ChangesGridController($scope,
                              $window,
                              $stateParams,
                              $state,
                              $filter,
                              uiGridExporterConstants,
                              uiGridConstants,
                              _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};

    ctrl.exportPopover = {
      templateUrl: 'app/views/events/common/gridExportPopover.tpl.html',
      title: 'Save CSV',
      include: 'all',
      type: 'csv'
    };

    ctrl.rowsToShow = $scope.rows === undefined ? 5 : $scope.rows;
    ctrl.changesGridOptions = {
      minRowsToShow: ctrl.rowsToShow - 1,
      //enablePaginationControls: true,
      //paginationPageSizes: [8],
      //paginationPageSize: 8,
      enablePaging: false,

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
      columnDefs: [
        { name: 'user',
          displayName: 'User',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          enableSorting: false,
          width: '15%',
          cellTemplate: '<div class="ui-grid-cell-contents"><user-block user="row.entity[col.field]"</div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'created_at',
          displayName: 'Created',
          cellTemplate: '<div class="ui-grid-cell-contents"><span ng-bind="row.entity[col.field]|timeAgo"></span></div>',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'date',
          sort: {direction: uiGridConstants.DESC},
          enableSorting: true,
        },
        { name: 'status',
          displayName: 'Status',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
        },
        {
          name: 'gene',
          field: 'state_params.gene.name',
          displayName: 'Gene',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant',
          field: 'state_params.variant.name',
          displayName: 'Variant',
          type: 'string',
          width: '15%',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant',
          field: 'state_params.variant.name',
          displayName: 'Variant',
          type: 'string',
          width: '15%',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'entity_id',
          displayName: 'Entity',
          type: 'string',
          width: '15%',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },

      ]
    };

    ctrl.changesGridOptions.onRegisterApi = function(gridApi){
      var changes = $scope.changes;
      ctrl.gridApi = gridApi;

      ctrl.context = $scope.context;
      ctrl.variantGroup = $scope.variantGroup;
      ctrl.changesGridOptions.data = prepChangesData(changes);

      $scope.$watchCollection('changes', function(changes) {
        if(changes) {
          ctrl.changesGridOptions.minRowsToShow = changes.length + 1;
          ctrl.changesGridOptions.data = prepChangesData(changes);
        }
      });

      ctrl.exportData = function() {
        ctrl.changesGridOptions.exporterCsvFilename = getFilename($scope.variant);
        var rows = ctrl.exportPopover.include === 'all' ? uiGridExporterConstants.ALL : uiGridExporterConstants.VISIBLE;
        if(ctrl.exportPopover.type === 'csv') {
          gridApi.exporter.csvExport(rows, uiGridExporterConstants.ALL);
        } else {
          gridApi.exporter.pdfExport(rows, uiGridExporterConstants.ALL);
        }
      };

      function getFilename() {
        var dateTime = $filter('date')(new Date(), 'yyyy-MM-ddTHH:MM:ss');
        return 'CIViC_changes_' + dateTime + '.csv';
      }

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event){
        var change = row.entity;
        var subjectStates = {
          Assertion: 'events.assertions',
          Gene: 'events.genes',
          Variant: 'events.genes.summary.variants',
          VariantGroup: 'events.genes.summary.variantGroups',
          EvidenceItem: 'events.genes.summary.variants.summary.evidence',
        };

        var stateExtension = '.talk.revisions.list.summary';

        // generate state params for router
        var stateParams = {};
        _.each(change.state_params, function(obj, entity) {
          var entityId;
          if(entity === 'suggested_change') {
            entityId = 'revisionId';
          } else if (entity === 'evidence_item') {
            entityId = 'evidenceId';
          } else if (entity === 'variant_group') {
            entityId = 'variantGroupId';
          } else if (entity === 'source') {
            entityId = 'sourceId';
          } else {
            entityId = entity + 'Id';
          }
          stateParams[entityId] = obj.id;
        });
        var type = change.moderated_object.type;

        $state.go(subjectStates[type] + '.talk.revisions.list.summary', stateParams);
      });

      function prepChangesData(changes) {
        changes = _.map(changes, function(change){
          var params = change.state_params;
          var entity_id;
          // create new column for assertion or evidence item name
          if (_.has(params, 'evidence_item')) {
            entity_id = params.evidence_item.name;
          }
          if (_.has(params, 'assertion')) {
            entity_id = params.assertion.name;
          }
          change.entity_id = entity_id;
          return change;
        });
        return changes;
      }
    };
  }

})();
