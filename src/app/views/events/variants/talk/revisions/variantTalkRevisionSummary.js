(function() {
  'use strict';
  angular.module('civic.events.variants')
    .directive('variantTalkRevisionSummary', variantTalkRevisionSummary)
    .controller('VariantTalkRevisionSummaryController', VariantTalkRevisionSummaryController);

  // @ngInject
  function variantTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/talk/revisions/variantTalkRevisionSummary.tpl.html',
      controller: 'VariantTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function VariantTalkRevisionSummaryController($scope,
                                                $stateParams,
                                                VariantRevisions,
                                                Security,
                                                formConfig,
                                                $rootScope) {
    var vm = $scope.vm = {};
    vm.isEditor = Security.isEditor;
    vm.isAdmin= Security.isAdmin;
    vm.isAuthenticated = Security.isAuthenticated;
    vm.variantTalkModel = VariantRevisions;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    // determine moderation button visibility
    var currentUserId = Security.currentUser.id;
    var submitterId = VariantRevisions.data.item.user.id;
    var ownerIsCurrentUser = vm.ownerIsCurrentUser = submitterId === currentUserId;

    $scope.$watchGroup(
      [ function() { return VariantRevisions.data.item.status; },
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

    vm.disabled_text = (vm.isEditor() || vm.isAdmin()) ? 'Contributors may not accept their own suggested revisions.' : 'Suggested revisions must be approved by an editor.';

    $scope.acceptRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      VariantRevisions.acceptRevision($stateParams.variantId, $stateParams.revisionId)
        .then(function() {
          vm.formMessages.acceptSuccess = true;
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

    $scope.rejectRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      VariantRevisions.rejectRevision($stateParams.variantId, $stateParams.revisionId)
        .then(function() {
          vm.formMessages.rejectSuccess = true;
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
