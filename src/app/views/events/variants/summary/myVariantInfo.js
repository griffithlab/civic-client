(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('MyVariantInfoController', MyVariantInfoController)
//    .controller('MyVariantInfoDialogController', MyVariantInfoDialogController)
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
    console.log('myVariantInfo controller called.');
  }
})();
