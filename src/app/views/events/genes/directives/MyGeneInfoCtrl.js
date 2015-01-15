(function() {
  'use strict';
  angular.module('civic.events')
    .controller('MyGeneInfoCtrl', MyGeneInfoCtrl);

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
})();
