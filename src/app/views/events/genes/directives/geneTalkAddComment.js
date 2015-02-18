(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalkAddComment', geneTalkAddComment)
    .controller('GeneTalkAddCommentController', GeneTalkAddCommentController);

  // @ngInject
  function geneTalkAddComment() {
    var directive = {
      restrict: 'E',
      scope: {
        addComment: '&addComment',
        refreshComments: '&refreshComments'
      },
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalkAddComment.tpl.html',
      controller: 'GeneTalkAddCommentController',
      link: /* @ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };
    return directive;
  }

  // @ngInject
  function GeneTalkAddCommentController($scope, $stateParams, aaNotify, $log) {
    $log.info('GeneTalkAddCommentController instantiated.==========');

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
          'ng-minlength': 32,
          required: true
        }
      }
    };

    $scope.submit = function() {
      $log.info('geneTalkAddComment submit() called.');
      $scope.addComment({
        comment: comment
      }).then(function() { // success
          aaNotify.success('Your comment was added.', {ttl:0, allowHtml: true});
          $scope.refreshComments();
        },
        function() { // failure
          aaNotify.error('Oops! Your comment failed to be added.<br/><strong>Status: </strong>' + response.status + ' ' + response.statusText, {ttl:0, allowHtml: true });
        });
    };

  }
})();
