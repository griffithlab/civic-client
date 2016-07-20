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
        variants: '=',
        rows: '=',
        context: '=',
        variantGroup: '='
      },
      templateUrl: 'app/views/events/variantGroups/summary/variantGrid.tpl.html',
      controller: 'VariantGridController'
    };
    return directive;
  }

  // @ngInject
  function VariantGridController($scope,
                                 $window,
                                 $stateParams,
                                 $state,
                                 uiGridConstants,
                                 _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};

    ctrl.rowsToShow = $scope.rows === undefined ? 5 : $scope.rows;
    ctrl.variantGridOptions = {
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
        { name: 'variant_group_list',
          displayName: 'Variant Group(s)',
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
          },
          cellTemplate: 'app/views/events/variantGroups/summary/variantGridDescriptionCell.tpl.html'
        }
      ]
    };

    ctrl.variantGridOptions.onRegisterApi = function(gridApi){
      var variants = $scope.variants;
      ctrl.gridApi = gridApi;

      ctrl.context = $scope.context;
      ctrl.variantGroup = $scope.variantGroup;
      ctrl.variantGridOptions.data = prepVariantGroups(variants);

      $scope.$watchCollection('variants', function(variants) {
        ctrl.variantGridOptions.minRowsToShow = variants.length + 1;
        ctrl.variantGridOptions.data = prepVariantGroups(variants);
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        var params = _.merge($stateParams, { variantId: row.entity.id, geneId: row.entity.gene_id });
        if(event.metaKey) {
          // if meta key (alt or command) pressed, generate a state URL and open it in a new tab/window
          // shift would be preferable to meta but ui-grid's selection module appears to be capturing shift-clicks for multi-select feature
          // keep an eye on: https://github.com/angular-ui/ui-grid/issues/4926
          var url = $state.href('events.genes.summary.variants.summary', params, {absolute: true});
          $window.open(url, '_blank');
        } else {
          $state.go('events.genes.summary.variants.summary', params);
        }
      });

      function prepVariantGroups(variants) {
        var vargroups = _.map(variants, function(item){
          if (_.isArray(item.variant_groups) && item.variant_groups.length > 0) {
            item.variant_group_list = item.variant_groups.join(', ');
            return item;
          } else {
            item.variant_group_list = 'N/A';
            return item;
          }
        });
        return vargroups;
      }
    };
  }

})();
