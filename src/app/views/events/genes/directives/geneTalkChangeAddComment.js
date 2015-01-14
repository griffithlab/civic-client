(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalkChangeAddComment', geneTalkChangeAddComment)
    .controller('GeneTalkChangeAddCommentController', GeneTalkChangeAddCommentController);

  // @ngInject
  function geneTalkChangeAddComment() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalkChangeAddComment.tpl.html',
      controller: 'GeneTalkChangeAddCommentController',
      link: /* ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };
    return directive;
  }

  // @ngInject
  function GeneTalkChangeAddCommentController($scope, $stateParams, GenesSuggestedChangesComments, $log) {
    $log.info('GeneTalkChangeAddCommentController instantiated.==========');

    $scope.comment = {};

    $scope.formStatus = {
      errors: [],
      messages: []
    };

    $scope.submitComment = function() {
      $log.info('submitComment called. geneId: '+ $stateParams.geneId + ' suggestedChangeId: ' + $stateParams.suggestedChangeId);
      GenesSuggestedChangesComments.add({
          entrez_id: $stateParams.geneId,
          suggestedChangeId: $stateParams.suggestedChangeId,
          title: "TESTING",
          text: $scope.comment.text
        },
        function(response) { // add comment succeeded
          $log.info('add comment succeeded.');
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          $scope.comment = '';
          $scope.formStatus.messages.push('Your comment was added.');
          GenesSuggestedChangesComments.query({
            geneId: $scope.gene.entrez_id,
            suggestedChangeId: $scope.suggestedChange.id
          })
            .$promise.then(function(response) {
              $scope.$parent.changeComments = response;
            });
        },
        function(response) { // add comment failed
          $log.info('add comment failed.');
          $scope.formStatus.messages = [];
          $scope.formStatus.errors = [];
          var handleError = {
            '401': function () {
              $scope.formStatus.errors.push({
                field: 'Unauthrorized',
                errorMsg: 'You must be logged in to perform this action.'
              });
            },
            '403': function () {
              $scope.formStatus.errors.push({
                field: 'Insufficient Permissions',
                errorMsg: 'You must be an Admin user to perform the requested action.'
              });
            },
            '422': function (response) {
              _.forEach(response.data.errors, function (value, key) {
                $scope.formStatus.errors.push({
                  field: key,
                  errorMsg: value
                });
              });
            },
            '500': function(response) {
              $scope.formStatus.errors.push({
                field: 'SERVER ERROR',
                errorMsg: response.statusText
              });
              $log.info(response);
            }
          };
          handleError[response.status](response);
        }
      );
    };



  }
})();
