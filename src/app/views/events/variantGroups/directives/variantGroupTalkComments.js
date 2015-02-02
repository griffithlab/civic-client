(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGroupTalkComments', variantGroupTalkComments)
    .controller('VariantGroupTalkCommentsController', VariantGroupTalkCommentsController);

// @ngInject
  function variantGroupTalkComments() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variantGroups/directives/variantGroupTalkComments.tpl.html',
      controller: 'VariantGroupTalkCommentsController'
    };
    return directive;
  }

// @ngInject
  function VariantGroupTalkCommentsController(Security, $scope, VariantGroupsComments, $log) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isAdmin = Security.isAdmin;

    $log.info('VariantGroupTalkCommentsController instantiated.');
    VariantGroupsComments.query({ variantGroupId: $scope.variantGroup.id })
      .$promise.then(function(response) {
        $scope.comments = response;
      });
  }
})();
