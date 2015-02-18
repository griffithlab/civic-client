(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalk', geneTalk)
    .controller('GeneTalkController', GeneTalkController);

  // @ngInject
  function geneTalk() {
    var directive = {
      restrict: 'E',
      scope: {
        gene: '=gene',
        addComment: '&addComment',
        acceptChange: '&acceptChange',
        rejectChange: '&rejectChange'
      },
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalk.tpl.html',
      controller: 'GeneTalkController',
      link: /* ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function GeneTalkController ($scope, GenesSuggestedChanges) {
    var gene = $scope.gene;
    GenesSuggestedChanges.query({'geneId': gene.entrez_id })
      .$promise.then(function(response) {
        var statusGroupsOrdered = {};
        var statusOrder = ['active', 'new', 'applied', 'closed'];
        var statusGroups = _.groupBy(_.sortBy(response, 'created_at'), 'status');
        _.each(statusOrder, function(status) {
          if (_.has(statusGroups, status)) {
            statusGroupsOrdered[status] = statusGroups[status];
          }
        });
        //_.each(statusOrder, function(stat) {
        //  if (_.has(statusGroups, stat)) {
        //    _.each(_.sortBy(statusGroups[stat], 'created_at'), function(change) {
        //      suggestedChanges.push(change);
        //    });
        //  }
        //});
        $scope.statusOrder = statusOrder;
        $scope.statusGroups = statusGroupsOrdered;
    });
  }
})();
