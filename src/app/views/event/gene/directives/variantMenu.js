(function() {
  'use strict';
  angular.module('civic.event')
    .directive('variantMenu', eventMenu);

// @ngInject
  function eventMenu() {
    var directive = {
      restrict: 'E',
      templateUrl: '/civic-client/views/event/gene/directives/variantMenu.tpl.html',
      controller: 'GeneCtrl',
      replace: true,
      scope: true,
      link: function($scope) {
        console.log('variantMenu linked.');
      }
    };

    return directive;
  }
})();