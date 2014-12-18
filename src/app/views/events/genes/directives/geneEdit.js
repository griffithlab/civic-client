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
      link: function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function GeneEditCtrl($log, $rootScope, $scope, $stateParams, Genes, _) {
    $scope.geneEdit = Genes.get({'geneId': $stateParams.geneId});

    $scope.formStatus = {
      errors: [],
      messages: []
    };

    $scope.submitEdits = function () {
      $log.info('submitEdits called.');
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
            }
          };
          handleError[response.status](response);
        });
    };
  }
})();
