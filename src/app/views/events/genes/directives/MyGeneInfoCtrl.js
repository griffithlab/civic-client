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
  function MyGeneInfoDialogCtrl($log, $scope, $window, $modalInstance, data) {
    $log.info("MyGeneInfoDialogCtrl loaded.");
    $scope.geneDetails = data;
    $scope.myData = [
      {
        "firstName": "Cox",
        "lastName": "Carney",
        "company": "Enormo",
        "employed": true
      },
      {
        "firstName": "Lorraine",
        "lastName": "Wise",
        "company": "Comveyer",
        "employed": false
      },
      {
        "firstName": "Nancy",
        "lastName": "Waters",
        "company": "Fuelton",
        "employed": false
      }
    ];
    // awful kludge to kickstart ui-grid rendering in a previously hidden div, as per
    // https://github.com/angular-ui/ng-grid/issues/50
    $scope.fixGrid = window.setTimeout(function(){
      $window.resize();
      $window.resize();
    }, 1000);

    $scope.done = function(){
      $modalInstance.close($scope.data);
    };
  }

})();
