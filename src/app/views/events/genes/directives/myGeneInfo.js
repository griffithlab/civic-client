(function() {
  'use strict';
  angular.module('civic.events')
    .directive('myGeneInfo', myGeneInfo)
    .controller('MyGeneInfoCtrl', MyGeneInfoCtrl)
    .controller('MyGeneInfoDialogCtrl', MyGeneInfoDialogCtrl);

  // @ngInject
  function myGeneInfo() {
    var directive = {
      restrict: 'E',
      replace: true,
      controller: 'MyGeneInfoCtrl', // controller for the MyGeneInfo dialog box can be found in the same file
      templateUrl: 'app/views/events/genes/directives/myGeneInfo.tpl.html',
    };
    return directive;
  }

  // @ngInject
  function MyGeneInfoCtrl($scope, dialogs) {
    $scope.viewGeneDetails = function() {
      $scope.dlg = dialogs.create(
        'app/views/events/genes/directives/myGeneInfoDialog.tpl.html',
        'MyGeneInfoDialogCtrl',
        $scope.GeneView.geneDetails,
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
