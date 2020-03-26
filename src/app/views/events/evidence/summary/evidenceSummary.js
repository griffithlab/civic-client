(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .controller('EvidenceSummaryController', EvidenceSummaryController)
    .directive('evidenceSummary', function() {
      return {
        restrict: 'E',
        scope: {},
        controller: 'EvidenceSummaryController',
        templateUrl: 'app/views/events/evidence/summary/evidenceSummary.tpl.html'
      };
    });

  //@ngInject
  function EvidenceSummaryController($scope,
                                     $log,
                                     $stateParams,
                                     Evidence,
                                     Security,
                                     EvidenceViewOptions,
                                     _,
                                     ConfigService) {
    $scope.evidence = Evidence.data.item;
    $scope.tipText = ConfigService.evidenceAttributeDescriptions;
    $scope.supportsAssertions = [];

    $scope.currentUser = null; // will be updated with requestCurrentUser call later


    Security.requestCurrentUser().then(function(u) {
      $scope.currentUser = u;

      // if user has most_recent_org, assign org
      if(!u.most_recent_organization) {
        $scope.currentUser.most_recent_organization = u.organizations[0];
      }

      // set org to be sent with reject/accept actions
      $scope.actionOrg = $scope.currentUser.most_recent_organization;

      // determine moderation button visibility
      var currentUserId;
      if(Security.currentUser) { currentUserId = Security.currentUser.id; };
      var submitterId = _.isUndefined($scope.evidence.lifecycle_actions.submitted) ? null : $scope.evidence.lifecycle_actions.submitted.user.id;
      var ownerIsCurrentUser = $scope.ownerIsCurrentUser = submitterId === currentUserId;

      $scope.$watchGroup(
        [ function() { return Evidence.data.item.status; },
          function() { return Security.currentUser ? Security.currentUser.conflict_of_interest.coi_valid : undefined; } ],
        function(statuses) {
          var changeStatus = statuses[0];
          var coiStatus = statuses[1];
          var changeIsSubmitted = changeStatus === 'submitted';
          var coiValid = coiStatus === 'conflict' || coiStatus === 'valid';
          var isModerator = Security.isEditor() || Security.isAdmin();

          $scope.showModeration = changeIsSubmitted && ((isModerator && coiValid) || ownerIsCurrentUser);
          $scope.showCoiNotice = changeIsSubmitted && !$scope.showModeration && isModerator;
        });
    });

    $scope.switchOrg = function(id) {
      $scope.actionOrg = _.find($scope.currentUser.organizations, { id: id });
    };

    // TODO: fetch and generate these from config service
    var evidence_levels = {
      A: 'Validated',
      B: 'Clinical',
      C: 'Case Study',
      D: 'Preclinical',
      E: 'Inferential'
    };
    $scope.$watchCollection('evidence', function() {
      $scope.evidence.evidence_level_string = $scope.evidence.evidence_level + ' - ' + evidence_levels[$scope.evidence.evidence_level];
      if($scope.evidence.drugs.length > 0) {
        $scope.evidence.drugsStr = _.chain($scope.evidence.drugs)
          .map(function(item) {
            if(item.ncit_id) {
              return '<a href="https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&ns=ncit&code=' + item.ncit_id + '" target="_blank">' + item.name + '</a>';
            }
            else {
              return item.name;
            }
          })
          .value()
          .join(', ');
      } else {
        $scope.evidence.drugsStr = '--';
      }
      if($scope.evidence.phenotypes.length > 0) {
        $scope.evidence.phenotypesStr = _.chain($scope.evidence.phenotypes)
          .sortBy('hpo_class')
          .map(function(item) {
            return '<a href="' + item.url + '" target="_blank">' + item.hpo_class + '</a>';
          })
          .value()
          .join(', ');
      } else {
        $scope.evidence.phenotypesStr = '--';
      }

      if($scope.evidence.assertions.length > 0) {
        $scope.supportsAssertions = _.filter(
          $scope.evidence.assertions,
          function(a) { return a.status !== 'rejected'; });
      }
    });

    $scope.EvidenceViewOptions = EvidenceViewOptions;
    $scope.backgroundColor = EvidenceViewOptions.styles.view.backgroundColor;

    $scope.acceptItem = function(id) {
      $log.debug('accept item ' + id);
      Evidence.accept(id, $stateParams.variantId, $scope.actionOrg)
        .then(function(response) {
          $log.debug('Accept success.');
          $log.debug(response);
          // reload current user if org changed
          if ($scope.actionOrg.id != $scope.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
        })
        .catch(function(response) {
          $log.error('Ooops! There was an error accepting this evidence item.');
          $log.error(response);
        })
        .finally(function() {
          $log.debug('Accept Item done.');
        });
    };

    $scope.rejectItem = function(id) {
      $log.debug('reject item ' + id);
      Evidence.reject(id, $stateParams.variantId, $scope.actionOrg)
        .then(function(response) {
          $log.debug('Reject success.');
          $log.debug(response);
          // reload current user if org changed
          if ($scope.actionOrg.id != $scope.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
        })
        .catch(function(response) {
          $log.error('Ooops! There was an error rejecting this evidence item.');
          $log.error(response);
        })
        .finally(function() {
          $log.debug('Reject Item done.');
        });
    };
  }
})();
