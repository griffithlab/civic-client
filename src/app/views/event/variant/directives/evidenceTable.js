(function() {
  'use strict';
  angular.module('civic.event')
    .directive('evidenceTable', evidenceTable);

// @ngInject
  function evidenceTable() {
    var directive = {
      restrict: 'E',
      templateUrl: '/civic-client/views/event/variant/directives/evidenceTable.tpl.html',
      controller: 'EventCtrl',
      replace: true,
      scope: true,
      link: function($scope) {
        console.log('evidenceTable linked.');
      }
    };

    return directive;
  }
})();