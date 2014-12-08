(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTalk', evidenceTalk);

// @ngInject
  function evidenceTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceTalk.tpl.html',
      link: /* ngInject */ function() {
        console.log('evidenceTalk linked.');
      }
    };

    return directive;
  }
})();
