(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGroupTalkChangeAddComment', variantGroupTalkChangeAddComment)
    .controller('VariantGroupTalkChangeAddCommentController', VariantGroupTalkChangeAddCommentController);

  // @ngInject
  function variantGroupTalkChangeAddComment() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variantGroups/directives/variantGroupTalkChangeAddComment.tpl.html',
      controller: 'VariantGroupTalkChangeAddCommentController',
      link: /* @ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };
    return directive;
  }

  // @ngInject
  function VariantGroupTalkChangeAddCommentController($scope, $stateParams, VariantGroupsSuggestedChangesComments, $log) {
    $log.info('VariantGroupTalkChangeAddCommentController instantiated.==========');

    $scope.comment = {};

    $scope.formStatus = {
      errors: [],
      messages: []
    };

    $scope.submitComment = function() {
      $log.info('submitComment called. geneId: '+ $stateParams.geneId + ' suggestedChangeId: ' + $stateParams.suggestedChangeId);
      VariantGroupsSuggestedChangesComments.add({
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
          VariantGroupsSuggestedChangesComments.query({
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
                field: 'Unauthorized',
                errorMsg: 'You must be logged in to perform this action.'
              });
            },
            '403': function () {
              $scope.formStatus.errors.push({
                field: 'Insufficient Permissions',
                errorMsg: 'You must be an Admin user to perform the requested action.'
              });
            },
            '404': function () {
              $scope.formStatus.errors.push({
                field: 'Route not found.',
                errorMsg: 'VariantGroupsSuggestedChangesComments service requested an invalid URL.'
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
