(function() {
  'use strict';
  angular.module('civic.events')
    .directive('myGeneInfo', myGeneInfo)
    .controller('MyGeneInfoCtrl', MyGeneInfoCtrl);

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
})();
