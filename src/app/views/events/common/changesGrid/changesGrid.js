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
        { name: 'created_at',
          displayName: 'Created',
          width: '15%',
          cellTemplate: '<div class="ui-grid-cell-contents"><span ng-bind="row.entity[col.field]|timeAgo"></span></div>',
          enableFiltering: false,
          allowCellFocus: false,
          type: 'date',
          sort: {direction: uiGridConstants.DESC},
          enableSorting: true,
        },
        { name: 'user',
          displayName: 'Created by',
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
        {
          name: 'status',
          displayName: 'Status',
          type: 'string',
          width: '10%',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true,
          cellTemplate: 'app/views/events/common/changesGrid/entityStatusCell.tpl.html',
          filter: {
            type: uiGridConstants.filter.SELECT,
            condition: uiGridConstants.filter.EXACT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'new', label: 'new'},
              { value: 'applied', label: 'applied'},
              { value: 'closed', label: 'closed'},
              { value: 'rejected', label: 'rejected'},
            ]
          },
        },
        {
          name: 'type',
          displayName: 'Type',
          type: 'string',
          width: '15%',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'Assertion', label: 'Assertion'},
              { value: 'Evidence Item', label: 'Evidence Item'},
              { value: 'Gene', label: 'Gene'},
              { value: 'Variant', label: 'Variant'},
              { value: 'Variant Group', label: 'Variant Group'},
            ]
          },
        },
        {
          name: 'full_name',
          displayName: 'Name',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'fields',
          displayName: 'Fields',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true,
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
          // workarount for inexact select options matching
          // https://github.com/angular-ui/ui-grid/issues/5830
          gridApi.grid.columns[3].filters[0].condition = uiGridConstants.filter.EXACT;

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

        if (change.unlinkable === false) {
          $state.go(subjectStates[type] + '.talk.revisions.list.summary', stateParams);
        }
      });

      function prepChangesData(changes) {
        changes = _.map(changes, function(change){
          var params = change.state_params;

          // create subject type column
          change.type = _.startCase(change.moderated_object.type);

          // create full name column
          var types = ['gene', 'variant', 'variant_group', 'evidence_item', 'assertion'];
          var names = [];
          _.each(types, function(type) {
            if(_.has(params, type)) { names.push(params[type].name); }
          });
          change.full_name = names.join(' / ');

          // create col for field modification summary
          change.fields = _.keys(change.suggested_changes).join(', ');

          return change;
        });
        return changes;
      }
    };
  }

})();
