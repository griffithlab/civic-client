(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTalk', evidenceTalk);

// @ngInject
  function evidenceTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/evidence/directives/evidenceTalk.tpl.html',
      link: function($scope) {
        console.log('evidenceTalk linked.');
      }
    };

    return directive;
  }
})();