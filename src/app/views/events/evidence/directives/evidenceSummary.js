(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceSummary', evidenceSummary);

// @ngInject
  function evidenceSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceSummary.tpl.html'
    };

    return directive;
  }
})();
