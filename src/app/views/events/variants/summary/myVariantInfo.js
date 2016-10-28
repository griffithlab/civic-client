(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('MyVariantInfoController', MyVariantInfoController)
   .controller('MyVariantInfoDialogController', MyVariantInfoDialogController)
    .directive('myVariantInfo', function () {
      return {
        restrict: 'E',
        scope: {
          variantInfo: '='
        },
        controller: 'MyVariantInfoController',
        templateUrl: 'app/views/events/variants/summary/myVariantInfo.tpl.html'
      };
    });

  // @ngInject
  function MyVariantInfoController($scope, ngDialog, _) {
    var ctrl = $scope.ctrl = {};

    ctrl.popupOptions = {
      template: 'app/views/events/variants/summary/myVariantInfoDialog.tpl.html',
      controller: 'MyVariantInfoDialogController',
      scope: $scope
    };

    ctrl.openDialog = function() {
      if(_.has(ctrl.dialog, 'id')) {
        ctrl.closeDialog().then(function() {
          ctrl.dialog = ngDialog.open(ctrl.popupOptions);
        });
      } else {
        ctrl.dialog = ngDialog.open(ctrl.popupOptions);
      }
      return ctrl.dialog;
    };

    ctrl.closeDialog = function() {
      ctrl.dialog.close();
      return ctrl.dialog.closePromise.then(function() { _.omit(ctrl, 'dialog'); } );
    };
  }

  // @ngInject
  function MyVariantInfoDialogController($scope) {
    var ctrl = $scope.$parent.ctrl;
  }
})();
