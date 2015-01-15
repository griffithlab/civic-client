(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalkChange', geneTalkChange)
    .controller('GeneTalkChangeController', GeneTalkChangeController);

  // @ngInject
  function geneTalkChange() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalkChange.tpl.html',
      controller: 'GeneTalkChangeController'
    };

    return directive;
  }

  // @ngInject
  function GeneTalkChangeController($scope, Security, $stateParams, GenesSuggestedChanges, GenesSuggestedChangesComments, Genes, $log) {
    $scope.auth = {
      isAuthenticated: Security.isAuthenticated,
      isAdmin: Security.isAdmin
    };

    $log.info('Requesting change:' + $stateParams.geneId + 'suggestedChangeId: ' + $stateParams.suggestedChangeId);

    GenesSuggestedChanges.get({'geneId': $stateParams.geneId, 'suggestedChangeId': $stateParams.suggestedChangeId })
      .$promise.then(function(response) {
        $scope.suggestedChange = response;
      });

    GenesSuggestedChangesComments.query({'geneId': $stateParams.geneId, 'suggestedChangeId': $stateParams.suggestedChangeId })
      .$promise.then(function(response) {
        $scope.changeComments = response;
      });

    $scope.commitChange = function() {
      GenesSuggestedChanges.accept({'geneId': $stateParams.geneId, 'suggestedChangeId': $stateParams.suggestedChangeId, force: true })
        .$promise.then(function(response) { // success
          $log.info("suggested change updated!!");
          Genes.get({'geneId': $stateParams.geneId})
            .$promise.then(function(gene) {
              $scope.$parent.$parent.gene = gene;
            });
        },
        function(response) { // failure
          $log.info("suggested change failed!!");
        })
    };
  }
})();
