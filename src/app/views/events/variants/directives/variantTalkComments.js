(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantTalkComments', variantTalkComments)
    .controller('VariantTalkCommentsController', VariantTalkCommentsController);

  // @ngInject
  function variantTalkComments() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/directives/variantTalkComments.tpl.html',
      controller: 'VariantTalkCommentsController'
    };
    return directive;
  }

  // @ngInject
  function VariantTalkCommentsController(Security, $scope, $stateParams, VariantComments, $log) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isAdmin = Security.isAdmin;

    $log.info('VariantTalkCommentsController instantiated.');
    VariantComments.query({geneId: $stateParams.geneId, variantId: $stateParams.variantId })
      .$promise.then(function(response) {
        $scope.comments = response;
      });
  }
})();
