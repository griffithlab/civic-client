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
  function GeneTalkChangeController($scope, $stateParams, aaNotify, $log) {
    var suggestedChangeId = $stateParams.suggestedChangeId;

    var comment = $scope.comment = {
      title: "",
      text: ""
    };

    var formConfig = $scope.formConfig = {};

    formConfig.validations = {
      comment: {
        title: {
          'ng-minlength': 5,
          required: false
        },
        text: {
          'ng-minlength': 32,
          required: true
        }
      }
    };

    $scope.refreshComments = function() {
      $scope.getChangeComments({suggestedChangeId: suggestedChangeId})
        .then(function (response) { // success
          $scope.changeComments = response;
        }, function (response) { // fail
          $log.error("Could not fetch change comments for suggested change #" + suggestedChangeId);
        }
      );
    };

    $scope.refreshComments();

    $scope.refreshChanges = function() {
      $scope.getChanges({suggestedChangeId: suggestedChangeId})
        .then(function (response) { // success
          $scope.suggestedChange = response;
        }, function (response) { // fail
          $log.error("Could not fetch changes for suggested change #" + suggestedChangeId);
        }
      );
    };

    $scope.refreshChanges();

    $scope.addComment = function(geneChangeCommentForm) {
      $scope.addChangeComment({
        suggestedChangeId: suggestedChangeId,
        comment: comment
      })
        .then(function() { // success
          aaNotify.success('Your comment was added.', {ttl:0, allowHtml: true});
          geneChangeCommentForm.$aaFormExtensions.$resetChanged();
          $scope.refreshComments();
        },
        function() { // failure
          aaNotify.error('Oops! Your comment failed to be added.<br/><strong>Status: </strong>' + response.status + ' ' + response.statusText, {ttl:0, allowHtml: true });
        });
    };

    $scope.accept = function() {
      $scope.acceptChange({ suggestedChangeId: suggestedChangeId })
        .then(function(response) { // success
          $log.info("suggested change updated.");
          // TODO: cache should automatically handle refreshing current gene data
          // but it doesn't, so we do so manually
          $scope.refreshEntity();
          $scope.refreshChanges();
          // also refresh changes

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
