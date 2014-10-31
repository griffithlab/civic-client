(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantsMenu', variantsMenu);

// @ngInject
  function variantsMenu() {
    var directive = {
      restrict: 'E',
      templateUrl: '/civic-client/views/events/common/variantsMenu.tpl.html',
      controller: 'GenesViewCtrl',
      replace: true,
      scope: true,
      link: function($scope) {
        console.log('variantsMenu linked.');
      }
    };

    return directive;
  }
})();