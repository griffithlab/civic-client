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
  function GeneTalkRevisionSummaryController($scope, $stateParams, GeneRevisions, Security, formConfig, $rootScope) {
    var vm = $scope.vm = {};
    vm.isEditor = Security.isEditor;
    vm.isAdmin = Security.isAdmin;
    vm.isAuthenticated = Security.isAuthenticated;

    vm.geneTalkModel = GeneRevisions;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    // determine moderation button visibility
    var currentUserId = Security.currentUser.id;
    var submitterId = GeneRevisions.data.item.user.id;
    var ownerIsCurrentUser = vm.ownerIsCurrentUser = submitterId === currentUserId;

    $scope.$watchGroup(
      [ function() { return GeneRevisions.data.item.status; },
        function() { return Security.currentUser.conflict_of_interest.coi_valid; } ],
      function(statuses) {
        var changeStatus = statuses[0];
        var coiStatus = statuses[1];
        var changeIsNew = changeStatus === 'new';
        var coiValid = coiStatus === 'conflict' || coiStatus === 'valid';
        var isModerator = Security.isEditor() || Security.isAdmin();

        vm.showModeration = changeIsNew && ((isModerator && coiValid) || ownerIsCurrentUser);
        vm.showCoiNotice = changeIsNew && !vm.showModeration && isModerator;
      });

    vm.disabled_text = (vm.isEditor() || vm.isAdmin()) ? 'Contributors may not accept their own suggested revisions.' : 'Suggested revisions must be approved by an editor.' ;

    $scope.acceptRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      GeneRevisions.acceptRevision($stateParams.geneId, $stateParams.revisionId)
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
      GeneRevisions.rejectRevision($stateParams.geneId, $stateParams.revisionId)
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
