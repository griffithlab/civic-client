(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTalkAddComment', evidenceTalkAddComment)
    .controller('EvidenceTalkAddCommentController', EvidenceTalkAddCommentController);

  // @ngInject
  function evidenceTalkAddComment() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceTalkAddComment.tpl.html',
      controller: 'EvidenceTalkAddCommentController',
      link: /* ngInject */ function($scope, Security) {
        console.log("======== evidenceTalkAddComment linked.");
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };
    return directive;
  }

  // @ngInject
  function EvidenceTalkAddCommentController($scope, $stateParams, EvidenceComments, $log) {
    $log.info('EvidenceTalkAddCommentController instantiated.==========');

    $scope.comment = {};

    $scope.formStatus = {
      errors: [],
      messages: []
    };

    $scope.submitComment = function() {
      $log.info('submitComment called. geneId: '+ $stateParams.geneId);
      EvidenceComments.add({
          geneId: $stateParams.geneId,
          variantId: $stateParams.variantId,
          evidenceItemId: $stateParams.evidenceItemId,
          title: "TESTING",
          text: $scope.comment.text
        },
        function(response) { // add comment succeeded
          $log.info('add comment succeeded.');
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          $scope.formStatus.messages.push('Your evidence comment was added.');
          EvidenceComments.query({
            geneId: $scope.gene.entrez_id,
            variantId: $scope.variant.id,
            evidenceItemId: $scope.evidence.id
          }).$promise
            .then(function(response) {
              // TODO: banish all these kludgy $scope.$parent calls!
              $scope.$parent.comments = response;
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
                field: 'Invalid Route',
                errorMsg: 'CIViC client requested a URL that does not exist.'
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
