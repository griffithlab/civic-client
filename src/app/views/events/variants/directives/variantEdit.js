(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantEdit', variantEdit)
    .controller('VariantEditCtrl', VariantEditCtrl);

// @ngInject
  function variantEdit(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/directives/variantEdit.tpl.html',
      controller: 'VariantEditCtrl as VariantEdit',
      link: /* @ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function VariantEditCtrl($log, $parse, $scope, $stateParams, _, Variants, VariantsSuggestedChanges) {
    $scope.variantEdit = Variants.get({'geneId': $stateParams.geneId, 'variantId': $stateParams.variantId});
    $scope.variantsSuggestedChanges = VariantsSuggestedChanges.query({
      'geneId': $stateParams.geneId,
      'variantId': $stateParams.variantId
    });
    $scope.newChange = {};

    $scope.formStatus = {
      errors: [],
      messages: []
    };

    $scope.submitEdits = function () {
      $log.info('submitEdits called.' +
      'geneId: ' + $stateParams.geneId +
      'variantId: ' + $stateParams.variantId);

      VariantsSuggestedChanges.add({
          geneId: $stateParams.geneId,
          variantId: $stateParams.variantId,
          description: $scope.variantEdit.description,
          comment: {
            title: 'Reasons for Edit',
            text: $scope.variantEdit.reason
          }
        },
        function(response) { // request succeeded
          $log.info('Variant SubmitEdits update successful.');
          // refresh gene data
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          var messageExp = '"Your edit suggestions for Variant " + variant.name + " have been added to the review queue."';
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
            '404': function () {
              $scope.formStatus.errors.push({
                field: 'Route not found',
                errorMsg: 'Service requested invalid URL.'
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
      $scope.variantEdit.$update({
          geneId: $stateParams.geneId,
          variantId: $stateParams.variantId,
          description: $scope.variantEdit.description,
          comment: {
            title: 'Reasons for Edit',
            text: "Admin applied edit reason: " + $scope.variantEdit.reason
          }
        },
        function () {
          $log.info('update successful.');

          $scope.$parent.variant = Variants.get({'geneId': $stateParams.geneId, 'variantId': $stateParams.variantId });
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          $scope.formStatus.messages.push('Variant ' + $scope.variantEdit.name + ' updated successfully.');
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
            '404': function () {
              $scope.formStatus.errors.push({
                field: 'Route not found',
                errorMsg: 'Service requested invalid URL.'
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
