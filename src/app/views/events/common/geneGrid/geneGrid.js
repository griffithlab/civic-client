(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneGrid', geneGrid)
    .controller('GeneGridController', GeneGridController);

  // @ngInject
  function geneGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        genes: '=',
        rows: '=',
        context: '=',
        variantGroup: '='
      },
      templateUrl: 'app/views/events/common/geneGrid/geneGrid.tpl.html',
      controller: 'GeneGridController'
    };
    return directive;
  }

  // @ngInject
  function GeneGridController($scope, $stateParams, $state, uiGridConstants, _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};

    ctrl.rowsToShow = $scope.rows === undefined ? 5 : $scope.rows;
    ctrl.geneGridOptions = {
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
          displayName: 'Entrez Name',
          type: 'string',
          enableFiltering: false,
          allowCellFocus: false,
          width: '9%'
        },
        { name: 'variants',
          displayName: 'Variants',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '30%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'variant_count',
          displayName: 'Variant Count',
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

    ctrl.geneGridOptions.onRegisterApi = function(gridApi){
      var genes = $scope.genes;
      ctrl.gridApi = gridApi;

      ctrl.context = $scope.context;
      ctrl.variantGroup = $scope.variantGroup;
      ctrl.geneGridOptions.data = prepGeneData(genes);

      $scope.$watchCollection('genes', function(genes) {
        ctrl.geneGridOptions.minRowsToShow = genes.length + 1;
        ctrl.geneGridOptions.data = prepGeneData(genes);
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        var params = _.merge($stateParams, { variantId: row.entity.id, geneId: row.entity.gene_id });
        $state.go('events.genes.summary.genes.summary', params);
      });

      function prepGeneData(genes) {
        var genes = _.map(genes, function(item){
          if (_.isArray(item.variants) && item.variants.length > 0) {
            item.variant_list = _.map(item.variants, 'name').join(', ');
            return item;
          } else {
            item.variants = 'N/A';
            return item;
          }
        });
        return genes;
      }
    };
  }

})();
