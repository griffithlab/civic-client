(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGrid', variantGrid)
    .controller('VariantGridController', VariantGridController);

  // @ngInject
  function variantGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        variants: '='
      },
      templateUrl: 'app/views/events/variantGroups/summary/variantGrid.tpl.html',
      controller: 'VariantGridController'
    };
    return directive;
  }

  // @ngInject
  function VariantGridController($scope, $stateParams, $state, uiGridConstants, _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};

    ctrl.variantGridOptions = {
      enablePaginationControls: true,
      paginationPageSizes: [8],
      paginationPageSize: 8,
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
      columnDefs: [
        //{ name: 'id',
        //  displayName: 'ID',
        //  enableFiltering: false,
        //  allowCellFocus: false,
        //  width: '5%'
        //},
        { name: 'entrez_name',
          displayName: 'Gene',
          type: 'string',
          enableFiltering: false,
          allowCellFocus: false,
          width: '9%'
        },
        { name: 'name',
          displayName: 'Variant Name',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '20%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'description',
          displayName: 'Description',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ]
    };

    ctrl.variantGridOptions.onRegisterApi = function(gridApi){
      ctrl.gridApi = gridApi;
      // TODO: this watch seems unnecessary, but if it's not present then the grid only loads on a fresh page, fails when loaded by a state change
      // Something to do with directive priorities, maybe?
      $scope.$watch('variants', function(variants){
        ctrl.variants = variants;
        ctrl.variantGridOptions.minRowsToShow = variants.length + 1;
        ctrl.variantGridOptions.data = variants;
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        var params = _.merge($stateParams, { variantId: row.entity.id, geneId: row.entity.gene_id })
        $state.go('events.genes.summary.variants.summary', params);
      });

    };
  }

})();
