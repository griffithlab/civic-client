(function() {
  'use strict';
  angular.module('civic.events.assertions')
    .directive('assertionTalkRevisionSummary', assertionTalkRevisionSummary)
    .controller('AssertionTalkRevisionSummaryController', AssertionTalkRevisionSummaryController);

  // @ngInject
  function assertionTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/assertions/talk/revisions/assertionTalkRevisionSummary.tpl.html',
      controller: 'AssertionTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function AssertionTalkRevisionSummaryController($scope, $stateParams, AssertionRevisions, Security, formConfig, $rootScope) {
    var vm = $scope.vm = {};
    vm.isEditor = Security.isEditor;
    vm.isAdmin = Security.isAdmin;
    vm.isAuthenticated = Security.isAuthenticated;

    vm.assertionTalkModel = AssertionRevisions;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    if(Security.currentUser) {
      var currentUserId = Security.currentUser.id;
      var submitterId = AssertionRevisions.data.item.user.id;
      vm.ownerIsCurrentUser = submitterId === currentUserId;
    } else {
      vm.ownerIsCurrentUser = false;
    }

    vm.disabled_text = (vm.isEditor() || vm.isAdmin()) ? 'Contributors may not accept their own suggested revisions.' : 'Suggested revisions must be approved by an editor.' ;

    $scope.acceptRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      AssertionRevisions.acceptRevision($stateParams.assertionId, $stateParams.revisionId)
        .then(function() {
          vm.formMessages.acceptSuccess = true;
          $rootScope.$broadcast('revisionDecision');
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
      AssertionRevisions.rejectRevision($stateParams.assertionId, $stateParams.revisionId)
        .then(function() {
          vm.formMessages.rejectSuccess = true;
          $rootScope.$broadcast('revisionDecision');
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
