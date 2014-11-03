(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneEdit', geneEdit);

// @ngInject
  function geneEdit() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/genes/directives/geneEdit.tpl.html',
      link: function($scope) {
        console.log('geneEditdirective linked.');
      }
    };

    return directive;
  }
})();