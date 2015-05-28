(function() {
  'use strict';
  angular.module('civic.events.genes')
    .directive('geneTalkRevisionSummary', geneTalkRevisionSummary)
    .controller('GeneTalkRevisionSummaryController', GeneTalkRevisionSummaryController);

  // @ngInject
  function geneTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/talk/revisions/geneTalkRevisionSummary.tpl.html',
      controller: 'GeneTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function GeneTalkRevisionSummaryController($scope, $stateParams, GeneRevisions, Security, formConfig) {
    var vm = $scope.vm = {};
    vm.isAdmin = Security.isAdmin;
    vm.isAuthenticated = Security.isAuthenticated;
    vm.geneTalkModel = GeneRevisions;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    $scope.acceptRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      GeneRevisions.acceptRevision($stateParams.geneId, $stateParams.revisionId)
        .then(function(response) {
          vm.formMessages['acceptSuccess'] = true;
        })
        .catch(function(error) {
          console.error('revision accept error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function () {
          console.log('accept revision successful.');
        });
    };

    $scope.rejectRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      GeneRevisions.rejectRevision($stateParams.geneId, $stateParams.revisionId)
        .then(function(response) {
          vm.formMessages['rejectSuccess'] = true;
        })
        .catch(function(error) {
          console.error('revision reject error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function () {
          console.log('reject revision successful.');
        });
    };
  }
})();
