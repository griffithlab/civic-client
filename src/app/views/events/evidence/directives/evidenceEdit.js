(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceEdit', evidenceEdit)
    .controller('EvidenceEditCtrl', EvidenceEditCtrl);

// @ngInject
  function evidenceEdit(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      controller: 'EvidenceEditCtrl',
      templateUrl: 'app/views/events/evidence/directives/evidenceEdit.tpl.html',
      link: /* @ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function EvidenceEditCtrl($scope, $stateParams, Evidence, EvidenceSuggestedChanges, _, $parse, $log) {
    $scope.evidenceEdit = Evidence.get({
      geneId: $stateParams.geneId,
      variantId: $stateParams.variantId,
      evidenceItemId: $stateParams.evidenceItemId
    });

    $scope.formStatus = {
      errors: [],
      messages: []
    };

    $scope.submitEdits = function() {
      $log.info('evidenceEdit.submitEdits called.' +
      'geneId: ' + $stateParams.geneId +
      'variantId: ' + $stateParams.variantId +
      'evidenceItemId: ' + $stateParams.evidenceItemId);

      EvidenceSuggestedChanges.add({
          geneId: $stateParams.geneId,
          variantId: $stateParams.variantId,
          evidenceItemId: $stateParams.evidenceItemId,
          text: $scope.evidenceEdit.text,
          comment: {
            title: 'Reasons for Edit',
            text: $scope.evidenceEdit.reason
          }
        },
        function(response) { // request succeeded
          $log.info('Evidence SubmitEdits update successful.');
          // refresh evidence  data
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          var messageExp = '"Your edit suggestions for Evidence" + evidence.name + " have been added to the review queue."';
          $scope.formStatus.messages.push($parse(messageExp)($scope));
          $scope.newChange = response.data;
        },
        function (response) { // request failed
          $log.info('update unsuccessful.');
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
                field: 'Route not found',
                errorMsg: 'Service requested invalid route URL.'
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
        });
    };

    $scope.discardEdits = function () {
      $log.info('discardEdits() called.')
    };

    $scope.applyEdits = function () {
      $log.info('applyEdits() called. ' +
        ' geneId: ' + $stateParams.geneId +
        ' variantId: ' + $stateParams.variantId +
        ' evidenceItemId: ' + $stateParams.evidenceItemId
      );
      $scope.evidenceEdit.$update({
          geneId: $stateParams.geneId,
          variantId: $stateParams.variantId,
          evidenceItemId: $stateParams.evidenceItemId,
          text: $scope.evidenceEdit.text
        },
        function () {
          $log.info('update successful.');
          $scope.$parent.evidence = Evidence.get({
            geneId: $stateParams.geneId,
            variantId: $stateParams.variantId,
            evidenceItemId: $stateParams.evidenceItemId
          });
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          $scope.formStatus.messages.push('Evidence Item' + $scope.evidence.id + ' updated successfully.');
        },
        function (response) {
          $log.info('update unsuccessful.');
          $scope.formStatus.messages = [];
          $scope.formStatus.errors = [];
          var handleError = {
            '401': function () {
              $scope.formStatus.errors.push({
                field: 'Unauthrorized',
                errorMsg: 'You must be logged in to edit this evidence item.'
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
                field: 'Resource Not Found',
                errorMsg: 'This resource could not be located to be updated.'
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
            '500': function (response) {
              _.forEach(response.data.errors, function (value, key) {
                $scope.formStatus.errors.push({
                  field: key,
                  errorMsg: value
                });
              });
            }
          };
          handleError[response.status](response);
        });
    };

  }
})();
