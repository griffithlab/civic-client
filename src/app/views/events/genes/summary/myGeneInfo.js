(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('MyGeneInfoController', MyGeneInfoController)
    .controller('MyGeneInfoDialogCtrl', MyGeneInfoDialogCtrl)
    .directive('myGeneInfo', function() {
      return {
        restrict: 'E',
        scope: {
          geneInfo: '='
        },
        controller: 'MyGeneInfoController',
        templateUrl: 'app/views/events/genes/summary/myGeneInfo.tpl.html'
      }
    });

  // @ngInject
  function MyGeneInfoController($scope, dialogs) {
    var ctrl = $scope.ctrl = {};
    ctrl.geneInfo = $scope.geneInfo;

    ctrl.viewGeneDetails = function() {
      $scope.dlg = dialogs.create(
        'app/views/events/genes/summary/myGeneInfoDialog.tpl.html',
        'MyGeneInfoDialogCtrl',
        $scope.geneDetails,
        'lg'
      );
    };
  }

  // @ngInject
  function MyGeneInfoDialogCtrl($scope, uiGridConstants, $modalInstance, data) {
    $scope.proteinDomainsGridOptions = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      minRowsToShow: 7,
      columnDefs: [
        { name: 'desc',
          displayName: 'Protein Domains',
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '50%'
        },
        { name: 'id',
          displayName: 'ID',
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '15%'
        },
        { name: 'short_desc',
          displayName: 'Identifier',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          enableFiltering: true
        }
      ]
    };

    $scope.proteinDomainsGridOptions.data = data.interpro;

    $scope.pathwaysGridOptions= {
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      minRowsToShow: 7,
      filter: {
        condition: uiGridConstants.filter.CONTAINS
      },
      columnDefs: [
        { name: 'name',
          displayName: 'Pathways',
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '50%'
        },
        { name: 'src',
          displayName: 'Source',
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '15%'
        },
        { name: 'link',
          displayName: 'Link',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          enableFiltering: true
        }
      ]
    };

    $scope.pathwaysGridOptions.data = data.pathway;

    $scope.geneDetails = data;
    $scope.done = function(){
      $modalInstance.close($scope.data);
    };
  }
})();
