(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .directive('variantGroupTalkRevisionSummary', variantGroupTalkRevisionSummary)
    .controller('VariantGroupTalkRevisionSummaryController', VariantGroupTalkRevisionSummaryController);

  // @ngInject
  function variantGroupTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variantGroups/talk/revisions/variantGroupTalkRevisionSummary.tpl.html',
      controller: 'VariantGroupTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function VariantGroupTalkRevisionSummaryController($scope, $stateParams, VariantGroupRevisions, Security, formConfig, $rootScope) {
    var vm = $scope.vm = {};
    vm.variantGroupTalkModel = VariantGroupRevisions;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    Security.requestCurrentUser().then(function(u) {
      var submitterId = VariantGroupRevisions.data.item.user.id;
      var ownerIsCurrentUser = vm.ownerIsCurrentUser = submitterId === u.id;

      vm.currentUser = u;
      vm.isEditor = Security.isEditor;
      vm.isAdmin = Security.isAdmin;
      vm.isAuthenticated = Security.isAuthenticated;

      vm.disabled_text = (vm.isEditor() || vm.isAdmin()) ? 'Contributors may not accept their own suggested revisions.' : 'Suggested revisions must be approved by an editor.' ;

      vm.disabled_text = (vm.isEditor() || vm.isAdmin()) ? 'Contributors may not accept their own suggested revisions.' : 'Suggested revisions must be approved by an editor.' ;

      // if user has most_recent_org, assign org
      if(!u.most_recent_organization) {
        vm.currentUser.most_recent_organization = u.organizations[0];
      }

      // set org to be sent with reject/accept actions
      vm.actionOrg = vm.currentUser.most_recent_organization;

      $scope.$watchGroup(
        [ function() { return VariantGroupRevisions.data.item.status; },
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
    });



    vm.switchOrg = function(id) {
      vm.actionOrg = _.find(vm.currentUser.organizations, { id: id });
    };

    vm.acceptRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      VariantGroupRevisions
        .acceptRevision($stateParams.variantGroupId, $stateParams.revisionId, vm.actionOrg)
        .then(function() {
          vm.formMessages.acceptSuccess = true;
          // reload current user if org changed
          if (vm.actionOrg.id != vm.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
          $rootScope.$broadcast('revisionDecision');
        })
        .catch(function(error) {
          console.error('revision accept error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function (){
          console.log('accept revision successful.');
        });
    };

    vm.rejectRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      VariantGroupRevisions.rejectRevision($stateParams.variantGroupId, $stateParams.revisionId, vm.actionOrg)
        .then(function() {
          vm.formMessages.rejectSuccess = true;
          // reload current user if org changed
          if (vm.actionOrg.id != vm.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
          $rootScope.$broadcast('revisionDecision');
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
