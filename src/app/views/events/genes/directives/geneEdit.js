(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneEdit', geneEdit)
    .controller('GeneEditCtrl', GeneEditCtrl);

// @ngInject
  function geneEdit(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneEdit.tpl.html',
      controller: 'GeneEditCtrl',
      link: /* ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function GeneEditCtrl($log, $parse, $scope, $stateParams, _, Genes, GenesSuggestedChanges) {
    $scope.geneEdit = Genes.get({'geneId': $stateParams.geneId});
    $scope.genesSuggestedChanges = GenesSuggestedChanges.query({'geneId': $stateParams.geneId });
    $scope.newChange = {};

    $scope.formStatus = {
      errors: [],
      messages: []
    };

    $scope.submitEdits = function () {
      $log.info('submitEdits called.');
      GenesSuggestedChanges.add({
          entrez_id: $stateParams.geneId,
          description: $scope.geneEdit.description,
          comment: {
            title: 'Reasons for Edit',
            text: $scope.geneEdit.reason
          }
        },
        function(response) { // request succeeded
          $log.info('Gene SubmitEdits update successful.');
          // refresh gene data
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          var messageExp = '"Your edit suggestions for Gene " + gene.entrez_name + " have been added to the review queue."';
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
      $scope.geneEdit.$update({
          //entrez_name: $scope.geneEdit.entrez_name,
          description: $scope.geneEdit.description
        },
        function () {
          $log.info('update successful.');
          $scope.$parent.gene = Genes.get({'geneId': $stateParams.geneId});
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          $scope.formStatus.messages.push('Gene ' + $scope.geneEdit.entrez_name + ' updated successfully.');
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
