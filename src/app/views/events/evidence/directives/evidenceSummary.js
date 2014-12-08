(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceSummary', evidenceSummary);

// @ngInject
  function evidenceSummary($log) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceSummary.tpl.html',
      link: /* ngInject */ function() {
        $log.info('evidenceSummary directive linked.');
      }
    };

    return directive;
  }
})();
