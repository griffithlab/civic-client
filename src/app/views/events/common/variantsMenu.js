(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantsMenu', variantsMenu)
    .controller('VariantsMenuController', VariantsMenuController);

  // @ngInject
  function variantsMenu() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/views/events/common/variantsMenu.tpl.html',
      replace: true,
      controller: 'VariantsMenuController'

    };

    return directive;
  }

  // @ngInject
  function VariantsMenuController($state, $scope) {
    $scope.$state = $state;
  }
})();
