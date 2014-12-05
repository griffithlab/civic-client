(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseCtrl', BrowseCtrl)
    .filter('ceil', ceilFilter);

// @ngInject
  function BrowseCtrl($scope, $rootScope, uiGridConstants, uiGridSelectionService, Browse, $state, _, $log) {
    $log.info('BrowseCtrl loaded');
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Browse Events');

    $scope.events = {};

    $scope.browseGridOptions = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      rowTemplate: '/civic-client/views/browse/browseGridRow.tpl.html',
      columnDefs: [
        { name: 'entrez_gene',
          enableFiltering: true,
          sort: { direction: uiGridConstants.ASC }
        },
        { name: 'entrez_id',
          displayName: 'Entrez ID',
          enableFiltering: true
        },
        { name: 'variant',
          enableFiltering: true
        }
      ],
      minRowsToShow: 20
    };

    $scope.gridInteractions = {
      rowClick: function (row) {
        $state.go('events.genes.summary.variants.summary', {
          geneId: row.entity.entrez_id,
          variantId: row.entity.variant
        });
      },
      rowHover: function(row) {
        // row.isSelected ? row.isSelected = false : row.isSelected = true;
      }
    };

    Browse.get({ count: 100 }, function(data) {
      // categories & protein functions return arrays,
      $scope.browseGridOptions.data = data.result;

    });
  }

  function ceilFilter() {
    return function(num) {
      return Math.ceil(num);
    }
  }

})();
