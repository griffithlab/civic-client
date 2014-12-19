(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseCtrl', BrowseCtrl)
    .filter('ceil', ceilFilter);

// @ngInject
  function BrowseCtrl($scope, $rootScope, uiGridConstants, uiGridSelectionService, Browse, $state, _, $log) {
    $scope.events = {};

    /*jshint camelcase: false */
    $scope.browseGridOptions = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      rowTemplate: 'app/views/browse/browseGridRow.tpl.html',
      columnDefs: [
        { name: 'entrez_gene',
          sort: { direction: uiGridConstants.ASC },
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'entrez_id',
          displayName: 'Entrez ID',
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'variant',
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ],
      minRowsToShow: 20
    };

    $scope.gridInteractions = {
      rowClick: function (row) {
        $log.info(['geneID:', row.entity.entrez_id, 'variantId:', row.entity.variant_id].join(' '));
        $state.go('events.genes.summary.variants.summary', {
          geneId: row.entity.entrez_id,
          variantId: row.entity.variant_id
        });
      }
    };

    Browse.get({ count: 100 }, function(data) {
      // categories & protein functions return arrays,
      $scope.browseGridOptions.data = data.result;
      $scope.events = data;
    });
  }

  function ceilFilter() {
    return function(num) {
      return Math.ceil(num);
    };
  }

})();
