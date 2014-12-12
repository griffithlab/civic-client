(function() {
  'use strict';
  angular.module('civic.events')
    .controller('MyGeneInfoDialogCtrl', MyGeneInfoDialogCtrl);

  // @ngInject
  function MyGeneInfoDialogCtrl($scope, $modalInstance, data) {

    $scope.proteinDomainsGridOptions = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      maxVisibleRowCount: 5,
      columnDefs: [
        { name: 'desc',
          displayName: 'Protein Domains',
          enableFiltering: true,
          width: '50%'
        },
        { name: 'id',
          displayName: 'ID',
          enableFiltering: true,
          width: '15%'
        },
        { name: 'short_desc',
          displayName: 'Identifier',
          enableFiltering: true
        }
      ]
    };

    $scope.proteinDomainsGridOptions.data = data.interpro;

    $scope.pathwaysGridOptions= {
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      maxVisibleRowCount: 5,
      columnDefs: [
        { name: 'name',
          displayName: 'Pathways',
          enableFiltering: true,
          width: '50%'
        },
        { name: 'src',
          displayName: 'Source',
          enableFiltering: true,
          width: '15%'
        },
        { name: 'link',
          displayName: 'Link',
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
