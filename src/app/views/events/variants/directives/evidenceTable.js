(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTable', evidenceTable);

// @ngInject
  function evidenceTable() {
    var directive = {
      restrict: 'E',
      templateUrl: '/civic-client/views/events/variants/directives/evidenceTable.tpl.html',
      replace: true,
      scope: false,
      link: function($scope) {
        console.log('evidenceTable linked.');
      }
    };

    return directive;
  }
})();