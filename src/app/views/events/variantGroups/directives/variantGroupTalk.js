(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGroupTalk', variantGroupTalk)
    .controller('VariantGroupTalkCtrl', VariantGroupTalkCtrl);

  // @ngInject
  function variantGroupTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variantGroups/directives/variantGroupTalk.tpl.html',
      controller: 'VariantGroupTalkCtrl',
      link: /* @ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function VariantGroupTalkCtrl ($scope, $stateParams, VariantGroupsSuggestedChanges, $log) {

    VariantGroupsSuggestedChanges.query({'variantGroupId': $stateParams.variantGroupId })
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
