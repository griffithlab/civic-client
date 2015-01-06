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
      link: /* ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function EvidenceEditCtrl($scope, $stateParams, Evidence, _, $log) {
    $scope.evidenceEdit = Evidence.get({
      geneId: $stateParams.geneId,
      variantId: $stateParams.variantId,
      evidenceId: $stateParams.evidenceId
    });

    $scope.formStatus = {
      errors: [],
      messages: []
    };

    $scope.submitEdits = function() {
      $log.info('submitEdits() called.');
    };

    $scope.discardEdits = function () {
      $log.info('discardEdits() called.')
    };

    $scope.applyEdits = function () {
      $log.info('applyEdits() called.')
      $scope.evidenceEdit.$update({
          explanation: $scope.evidenceEdit.explanation
        },
        function () {
          $log.info('update successful.');
          $scope.$parent.evidence = Evidence.get({
            geneId: $stateParams.geneId,
            variantId: $stateParams.variantId,
            evidenceId: $stateParams.evidenceId
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
            }
          };
          handleError[response.status](response);
        });
    };

  }
})();
