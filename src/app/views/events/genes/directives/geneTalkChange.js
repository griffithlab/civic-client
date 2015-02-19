(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalkChange', geneTalkChange)
    .controller('GeneTalkChangeController', GeneTalkChangeController);

  // @ngInject
  function geneTalkChange(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalkChange.tpl.html',
      controller: 'GeneTalkChangeController',
      link: /* @ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin
      }
    };

    return directive;
  }

  // @ngInject
  function GeneTalkChangeController($scope, $stateParams, $log) {
    var suggestedChangeId = $stateParams.suggestedChangeId;
    $scope.getChanges({ suggestedChangeId: suggestedChangeId })
      .then(function(response) { // success
        $scope.suggestedChange = response;
      }, function(response) { // fail
        $log.error("Could not fetch changes for suggested change #" + suggestedChangeId);
      }
    );

    $scope.getChangeComments({ suggestedChangeId: suggestedChangeId })
      .then(function(response) { // success
        $scope.changeGeneComments = response;
      }, function(response) { // fail
        $log.error("Could not fetch change comments for suggested change #" + suggestedChangeId);
      }
    );

    $scope.accept = function() {
      $scope.acceptChange({ suggestedChangeId: suggestedChangeId })
        .then(function(response) { // success
          $log.info("suggested change updated.");
          // TODO: cache should automatically handle refreshing current gene data
          //Genes.get({'geneId': $stateParams.geneId})
          //  .$promise.then(function(gene) {
          //    $scope.$parent.$parent.gene = gene;
          //  });
        }, function(response) { // fail
          $log.info("suggested change failed.");
        }
      );
    };

    $scope.reject = function() {
      $scope.rejectChange({ suggestedChangeId: suggestedChangeId })
        .then(function(response) { // success
          $log.info("Successfully rejected change #" + suggestedChangeId);
        }, function(response) { // fail
          $log.error("Could not reject change #" + suggestedChangeId);
        });
    }
  }
})();
