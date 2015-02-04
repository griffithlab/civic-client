(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantTalkChange', variantTalkChange)
    .controller('VariantTalkChangeController', VariantTalkChangeController);

  // @ngInject
  function variantTalkChange(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/directives/variantTalkChange.tpl.html',
      controller: 'VariantTalkChangeController',
      link: /* ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function VariantTalkChangeController($scope, $stateParams, VariantsSuggestedChanges, VariantsSuggestedChangesComments, Variants, $log) {
    $log.info('Requesting change:' + $stateParams.geneId + 'suggestedChangeId: ' + $stateParams.suggestedChangeId);

    VariantsSuggestedChanges
      .get({
        'geneId': $stateParams.geneId,
        'variantId': $stateParams.variantId,
        'suggestedChangeId': $stateParams.suggestedChangeId
      }).$promise
      .then(function(response) {
        $scope.suggestedChange = response;
      });

    VariantsSuggestedChangesComments
      .query({
        'geneId': $stateParams.geneId,
        'variantId': $stateParams.variantId,
        'suggestedChangeId': $stateParams.suggestedChangeId
      })
      .$promise.then(function(response) {
        $scope.changeComments = response;
      }, function(response) {
        $log.error("FAILED TO LOAD VARIANT CHANGE COMMENTS");
      });

    $scope.commitChange = function() {
      VariantsSuggestedChanges.accept({
        'geneId': $stateParams.geneId,
        'variantId': $stateParams.variantId,
        'suggestedChangeId': $stateParams.suggestedChangeId,
        force: true
      }).$promise
        .then(function(response) { // success
          $log.info("suggested change updated!!");
          Variants.get({
            'geneId': $stateParams.geneId,
            'variantId': $stateParams.variantId
          }).$promise
            .then(function(variant) {
              $scope.$parent.$parent.variant = variant;
            });
        },
        function(response) { // failure
          $log.info("suggested change failed!!");
        })
    };
  }
})();
