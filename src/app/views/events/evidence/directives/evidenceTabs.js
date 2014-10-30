(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTabs', evidenceTabs);

  // @ngInject
  function evidenceTabs() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/evidence/directives/evidenceTabs.tpl.html',
      link: function($scope) {
        console.log('evidenceTabs directive linked.');
      }
    };

    return directive;
  }
})();