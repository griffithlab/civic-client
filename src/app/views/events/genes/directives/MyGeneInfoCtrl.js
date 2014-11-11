(function() {
  'use strict';
  angular.module('civic.events')
    .controller('MyGeneInfoCtrl', MyGeneInfoCtrl)
    .controller('MyGeneInfoDialogCtrl', MyGeneInfoDialogCtrl);

  // @ngInject
  function MyGeneInfoCtrl($log, $scope, dialogs) {
    $scope.viewGeneDetails = function() {
      $scope.dlg = dialogs.create(
        '/civic-client/views/events/genes/directives/myGeneInfoDialog.tpl.html',
        'MyGeneInfoDialogCtrl',
        $scope.geneDetails,
        'lg'
      );
    }
  }

  // @ngInject
  function MyGeneInfoDialogCtrl($scope, $modalInstance, data) {
      $scope.geneDetails = data;

      $scope.done = function(){
        $modalInstance.close($scope.data);
      };
  }

})();
