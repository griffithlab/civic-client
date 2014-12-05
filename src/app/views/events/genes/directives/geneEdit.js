(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneEdit', geneEdit);

// @ngInject
  function geneEdit(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneEdit.tpl.html',
      controller: 'GeneEditCtrl',
      link: function($scope) {
        console.log('geneEditdirective linked.');
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }
})();
