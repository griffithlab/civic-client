(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantTalk', variantTalk)
    .controller('VariantTalkController', VariantTalkController);

  // @ngInject
  function variantTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/directives/variantTalk.tpl.html',
      controller: 'VariantTalkController',
      link: /* @ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function VariantTalkController ($scope, $stateParams, VariantsSuggestedChanges, $log) {

    VariantsSuggestedChanges.query({'geneId': $stateParams.geneId, 'variantId': $stateParams.variantId })
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
