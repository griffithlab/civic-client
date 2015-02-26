(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGroupEdit', variantGroupEdit)
    .controller('VariantGroupEditCtrl', VariantGroupEditCtrl);

// @ngInject
  function variantGroupEdit(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variantGroups/directives/variantGroupEdit.tpl.html',
      controller: 'VariantGroupEditCtrl as VariantGroupEdit',
      link: /* @ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function VariantGroupEditCtrl($log, $parse, $scope, $stateParams, _, VariantGroups, VariantGroupsSuggestedChanges) {
    $log.info('----- VariantGroupEditCtrl loaded.');
    $scope.variantGroupEdit = VariantGroups.get({'variantGroupId': $stateParams.variantGroupId});
    $scope.genesSuggestedChanges = VariantGroupsSuggestedChanges.query({'variantGroupId': $stateParams.variantGroupId});
    $scope.newChange = {};

    $scope.formStatus = {
      errors: [],
      messages: []
    };

    $scope.submitEdits = function () {
      $log.info('VariantGroups submitEdits called.');
      VariantGroupsSuggestedChanges.add({
          entrez_id: $stateParams.variantGroupId,
          description: $scope.variantGroupEdit.description,
          comment: {
            title: 'Reasons for Edit',
            text: $scope.variantGroupEdit.reason
          }
        },
        function(response) { // request succeeded
          $log.info('VariantGroups SubmitEdits update successful.');
          // refresh gene data
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          var messageExp = '"Your edit suggestions for VariantGroup " + variantGroup.name + " have been added to the review queue."';
          $scope.formStatus.messages.push($parse(messageExp)($scope));
          $scope.newChange = response.data;
        },
        function (response) {
          $log.info('update unsuccessful.');
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
        });
    };

    $scope.discardEdits = function () {
      $log.info('discardEdits called.');
    };

    $scope.applyEdits = function () {
      $scope.variantGroupEdit.$update({
          // entrez_id: $stateParams.geneID,
          description: $scope.variantGroupEdit.description,
          comment: {
            title: 'Reasons for Edit',
            text: "Admin applied edit reason: " + $scope.variantGroupEdit.reason
          }
        },
        function () {
          $log.info('update successful.');

          $scope.$parent.gene = VariantGroups.get({ 'variantGroupId': $stateParams.variantGroupId });
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          $scope.formStatus.messages.push('Gene ' + $scope.variantGroupEdit.entrez_name + ' updated successfully.');
        },
        function (response) {
          $log.info('update unsuccessful.');
          $scope.formStatus.messages = [];
          $scope.formStatus.errors = [];
          var handleError = {
            '401': function () {
              $scope.formStatus.errors.push({
                field: 'Unauthrorized',
                errorMsg: 'You must be logged in to edit this gene.'
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
                errorMsg: 'There was a server error.'
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
