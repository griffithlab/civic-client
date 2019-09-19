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
    $scope.isEditor = Security.isEditor;
    $scope.isAdmin = Security.isAdmin;
    $scope.isCurator = Security.isCurator;
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.evidence = Evidence.data.item;
    $scope.tipText = ConfigService.evidenceAttributeDescriptions;

    // determine moderation button visibility
    var currentUserId = Security.currentUser.id;
    var submitterId = _.isUndefined($scope.evidence.lifecycle_actions.submitted) ? null : $scope.evidence.lifecycle_actions.submitted.user.id;
    var ownerIsCurrentUser = $scope.ownerIsCurrentUser = submitterId === currentUserId;

    $scope.$watchGroup(
      [ function() { return Evidence.data.item.status; },
        function() { return Security.currentUser.conflict_of_interest.coi_valid; } ],
      function(statuses) {
        var changeStatus = statuses[0];
        var coiStatus = statuses[1];
        var changeIsSubmitted = changeStatus === 'submitted';
        var coiValid = coiStatus === 'conflict' || coiStatus === 'valid';
        var isModerator = Security.isEditor() || Security.isAdmin();

        $scope.showModeration = changeIsSubmitted && ((isModerator && coiValid) || ownerIsCurrentUser);
        $scope.showCoiNotice = changeIsSubmitted && !$scope.showModeration && isModerator;
      });

    // if(Security.currentUser) {
    //   var currentUserId = Security.currentUser.id;
    //   var submitterId = _.isUndefined($scope.evidence.lifecycle_actions.submitted) ? null : $scope.evidence.lifecycle_actions.submitted.user.id;
    //   $scope.ownerIsCurrentUser = submitterId === currentUserId;
    // } else {
    //   $scope.ownerIsCurrentUser = false;
    // }

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
    });

    $scope.EvidenceViewOptions = EvidenceViewOptions;
    $scope.backgroundColor = EvidenceViewOptions.styles.view.backgroundColor;

    $scope.acceptItem = function(id) {
      $log.debug('accept item ' + id);
      Evidence.accept(id, $stateParams.variantId)
        .then(function(response) {
          $log.debug('Accept success.');
          $log.debug(response);
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
      Evidence.reject(id, $stateParams.variantId)
        .then(function(response) {
          $log.debug('Reject success.');
          $log.debug(response);
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
