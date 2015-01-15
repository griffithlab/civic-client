(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantsMenu', variantsMenu);

  // @ngInject
  function variantsMenu() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/views/events/common/variantsMenu.tpl.html',
      replace: true,
      scope: true
    };

    return directive;
  }
})();
