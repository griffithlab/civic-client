(function() {
  'use strict';
  angular.module('civic.event')
    .directive('geneTabs', geneTabs);

// @ngInject
  function geneTabs() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: false,
      templateUrl: '/civic-client/views/event/gene/directives/geneTabs.tpl.html',
      link: function($scope, $element, $attrs) {
        console.log('geneTabs linked.');
      }
    };

    return directive;
  }
})();