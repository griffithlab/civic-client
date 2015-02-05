(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTalk', evidenceTalk)
    .controller('EvidenceTalkController', EvidenceTalkController);

  // @ngInject
  function evidenceTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceTalk.tpl.html',
      controller: 'EvidenceTalkController',
      link: /* ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function EvidenceTalkController ($scope, $stateParams, EvidenceSuggestedChanges) {
    EvidenceSuggestedChanges.query({
      geneId: $stateParams.geneId,
      variantId: $stateParams.variantId,
      evidenceItemId: $stateParams.evidenceItemId
    }).$promise
      .then(function(response) {
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
