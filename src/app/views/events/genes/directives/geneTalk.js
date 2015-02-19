(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalk', geneTalk)
    .controller('GeneTalkController', GeneTalkController);

  // @ngInject
  function geneTalk(Security) {
    var directive = {
      restrict: 'E',
      scope: {
        gene: '=',
        addComment: '&',
        getChanges: '&',
        getChangeComments: '&',
        addChangeComment: '&',
        acceptChange: '&',
        rejectChange: '&'
      },
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalk.tpl.html',
      controller: 'GeneTalkController',
      link: /* @ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };
    return directive;
  }

  // @ngInject
  function GeneTalkController ($scope) {
    $scope.getChanges().then(function(response) {
        var statusGroupsOrdered = {};
        var statusOrder = ['active', 'new', 'applied', 'closed'];
        var statusGroups = _.groupBy(_.sortBy(response, 'created_at'), 'status');
        _.each(statusOrder, function(status) {
          if (_.has(statusGroups, status)) {
            statusGroupsOrdered[status] = statusGroups[status];
          }
        });
        $scope.statusOrder = statusOrder;
        $scope.statusGroups = statusGroupsOrdered;
    });
  }
})();
