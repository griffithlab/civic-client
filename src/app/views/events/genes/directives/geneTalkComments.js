(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalkComments', geneTalkComments)
    .controller('GeneTalkCommentsController', GeneTalkCommentsController);

  // @ngInject
  function geneTalkComments() {
    var directive = {
      restrict: 'E',
      scope: false,
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalkComments.tpl.html',
      // TODO: figure out why setting up Security here is failing in the link function
      // (but works if added in the controller)

      //link: /* @ngInject */ function($scope, Security) {
      //  $scope.isAuthenticated = Security.isAuthenticated;
      //  $scope.isAdmin = Security.isAdmin;
      //},
      controller: 'GeneTalkCommentsController'
    };
    return directive;
  }

  // @ngInject
  function GeneTalkCommentsController($scope, GeneComments, Security, aaNotify, $log) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isAdmin = Security.isAdmin;
    var gene = $scope.gene;
    $scope.refreshComments = function() {
      GeneComments.query({geneId: gene.entrez_id})
        .$promise.then(function (response) {
          $scope.comments = response;
        });
    };
    $scope.refreshComments();

    var formConfig = $scope.formConfig = {};

    var comment = $scope.comment = {
      title: "",
      text: ""
    };

    formConfig.validations = {
      comment: {
        title: {
          'ng-minlength': 5,
          required: false
        },
        text: {
          'ng-minlength': 5,
          required: true
        }
      }
    };

    $scope.submit = function(geneCommentForm) {
      $log.info('geneTalkComments submit() called.');
      $scope.addComment({
        comment: comment
      }).then(function() { // success
          aaNotify.success('Your comment was added.', {ttl:0, allowHtml: true});
          geneCommentForm.$aaFormExtensions.$resetChanged();
          $scope.refreshComments();
        },
        function() { // failure
          aaNotify.error('Oops! Your comment failed to be added.<br/><strong>Status: </strong>' + response.status + ' ' + response.statusText, {ttl:0, allowHtml: true });
        });
    };
  }
})();
