(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .directive('evidenceTalkRevisionSummary', evidenceTalkRevisionSummary)
    .controller('EvidenceTalkRevisionSummaryController', EvidenceTalkRevisionSummaryController);

  // @ngInject
  function evidenceTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/talk/revisions/evidenceTalkRevisionSummary.tpl.html',
      controller: 'EvidenceTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceTalkRevisionSummaryController($scope,
                                                 $stateParams,
                                                 EvidenceRevisions,
                                                 Security,
                                                 formConfig) {
    var vm = $scope.vm = {};
    vm.isEditor = Security.isEditor;
    vm.isAuthenticated = Security.isAuthenticated;
    vm.evidenceTalkModel = EvidenceRevisions;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    var currentUserId = Security.currentUser.id;
    var submitterId = EvidenceRevisions.data.item.user.id;
    vm.ownerIsCurrentUser = submitterId === currentUserId;

    $scope.acceptRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      EvidenceRevisions.acceptRevision($stateParams.evidenceId, $stateParams.revisionId,$stateParams.variantId)
        .then(function() {
          vm.formMessages.acceptSuccess = true;
        })
        .catch(function(error) {
          console.error('revision accept error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function (){
          console.log('accept revision successful.');
        });
    };

    $scope.rejectRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      EvidenceRevisions.rejectRevision($stateParams.evidenceId, $stateParams.revisionId)
        .then(function() {
          vm.formMessages.rejectSuccess = true;
        })
        .catch(function(error) {
          console.error('revision reject error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function (){
          console.log('reject revision successful.');
        });
    };
  }
})();
