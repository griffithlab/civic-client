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

    vm.geneTalkModel = GeneRevisions;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    Security.reloadCurrentUser().then(function(u) {
      vm.currentUser = u;
      vm.isEditor = Security.isEditor();
      vm.isAdmin = Security.isAdmin();
      vm.isAuthenticated = Security.isAuthenticated();

      vm.actionOrg = vm.currentUser.most_recent_organization;
    });

    // determine moderation button visibility
    var currentUserId;
    if(Security.currentUser) { currentUserId = Security.currentUser.id; };
    var submitterId = GeneRevisions.data.item.user.id;
    var ownerIsCurrentUser = vm.ownerIsCurrentUser = submitterId === currentUserId;

    $scope.$watchGroup(
      [ function() { return GeneRevisions.data.item.status; },
        function() { return Security.currentUser ? Security.currentUser.conflict_of_interest.coi_valid : undefined; } ],
      function(statuses) {
        var changeStatus = statuses[0];
        var coiStatus = statuses[1];
        var changeIsNew = changeStatus === 'new';
        var coiValid = coiStatus === 'conflict' || coiStatus === 'valid';
        var isModerator = Security.isEditor() || Security.isAdmin();

        vm.showModeration = changeIsNew && ((isModerator && coiValid) || ownerIsCurrentUser);
        vm.showCoiNotice = changeIsNew && !vm.showModeration && isModerator;
        vm.disabled_text = (Security.isEditor() || Security.isAdmin()) ? 'Contributors may not accept their own suggested revisions.' : 'Suggested revisions must be approved by an editor.' ;
      });

    vm.switchOrg = function(id) {
      vm.actionOrg = _.find(vm.currentUser.organizations, { id: id });
    };

    vm.acceptRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      GeneRevisions.acceptRevision(
        $stateParams.geneId,
        $stateParams.revisionId,
        vm.actionOrg)
        .then(function() {
          vm.formMessages.acceptSuccess = true;
          $rootScope.$broadcast('revisionDecision');
          // reload current user if org changed
          if (vm.actionOrg.id != vm.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
        })
        .catch(function(error) {
          console.error('revision accept error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function () {
          console.log('accept revision successful.');
        });
    };

    vm.rejectRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      GeneRevisions.rejectRevision(
        $stateParams.geneId,
        $stateParams.revisionId,
        vm.actionOrg)
        .then(function() {
          vm.formMessages.rejectSuccess = true;
          $rootScope.$broadcast('revisionDecision');
          // reload current user if org changed
          if (vm.actionOrg.id != vm.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
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
