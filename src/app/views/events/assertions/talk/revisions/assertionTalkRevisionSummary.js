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
  function AssertionTalkRevisionSummaryController($scope,
                                                  $stateParams,
                                                  AssertionRevisions,
                                                  Security,
                                                  formConfig,
                                                  $rootScope) {
    var vm = $scope.vm = {};

    vm.assertionTalkModel = AssertionRevisions;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    Security.reloadCurrentUser().then(function(u) {
      vm.currentUser = u;
      vm.isEditor = Security.isEditor;
      vm.isAdmin = Security.isAdmin;
      vm.isAuthenticated = Security.isAuthenticated;

      // determine moderation button visibility
      var currentUserId;
      if(Security.currentUser) { currentUserId = Security.currentUser.id; };
      var submitterId = AssertionRevisions.data.item.user.id;
      var ownerIsCurrentUser = vm.ownerIsCurrentUser = submitterId === currentUserId;

      // if user no most_recent_org, assign org
      if(!u.most_recent_organization) {
        vm.currentUser.most_recent_organization = u.organizations[0];
      }

      vm.disabled_text = (vm.isEditor() || vm.isAdmin()) ? 'Contributors may not accept their own suggested revisions.' : 'Suggested revisions must be approved by an editor.' ;
      vm.actionOrg = vm.currentUser.most_recent_organization;
    });

    $scope.$watchGroup(
      [ function() { return AssertionRevisions.data.item.status; },
        function() { return Security.currentUser ? Security.currentUser.conflict_of_interest.coi_valid : undefined; } ],
      function(statuses) {
        var changeStatus = statuses[0];
        var coiStatus = statuses[1];
        var changeIsNew = changeStatus === 'new';
        var coiValid = coiStatus === 'conflict' || coiStatus === 'valid';
        var isModerator = Security.isEditor() || Security.isAdmin();

        vm.showModeration = changeIsNew && ((isModerator && coiValid) || ownerIsCurrentUser);
        vm.showCoiNotice = changeIsNew && !vm.showModeration && isModerator;
      });

    vm.switchOrg = function(id) {
      vm.actionOrg = _.find(vm.currentUser.organizations, { id: id });
    };

    vm.acceptRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      AssertionRevisions.acceptRevision($stateParams.assertionId,
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
      AssertionRevisions.rejectRevision($stateParams.assertionId,
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
