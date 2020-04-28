(function() {
  'use strict';
  angular.module('civic.events.assertions')
    .controller('AssertionSummaryController', AssertionSummaryController)
    .directive('assertionSummary', function() {
      return {
        restrict: 'E',
        scope: {},
        controller: 'AssertionSummaryController',
        templateUrl: 'app/views/events/assertions/summary/components/assertionSummaryCmp.tpl.html'
      };
    });

  /* @ngInject */
  function AssertionSummaryController($scope,
                                      $log,
                                      _,
                                      Security,
                                      Assertions,
                                      AssertionsViewOptions) {
    var vm = $scope.vm = {};

    vm.assertion = Assertions.data.item;
    vm.myVariantInfo = Assertions.data.myVariantInfo;

    vm.currentUser = null; // will be updated with requestCurrentUser call later

    Security.reloadCurrentUser().then(function(u) {
      vm.currentUser = u;

      // set org to be sent with reject/accept actions
      vm.actionOrg = vm.currentUser.most_recent_organization;

      // determine moderation button visibility
      var currentUserId;
      if(Security.currentUser) { currentUserId = Security.currentUser.id; };
      var submitterId = _.isUndefined(vm.assertion.lifecycle_actions.submitted) ? null : vm.assertion.lifecycle_actions.submitted.user.id;
      var ownerIsCurrentUser = vm.ownerIsCurrentUser = submitterId === currentUserId;

      $scope.$watchGroup(
        [ function() { return Assertions.data.item.status; },
          function() { return Security.currentUser ? Security.currentUser.conflict_of_interest.coi_valid : undefined; } ],
        function(statuses) {
          var changeStatus = statuses[0];
          var coiStatus = statuses[1];
          var changeIsSubmitted = changeStatus === 'submitted';
          var coiValid = coiStatus === 'conflict' || coiStatus === 'valid';
          var isModerator = Security.isEditor() || Security.isAdmin();

          vm.showModeration = changeIsSubmitted && ((isModerator && coiValid) || ownerIsCurrentUser);
          vm.showCoiNotice = changeIsSubmitted && !vm.showModeration && isModerator;
        });

    });

    vm.switchOrg = function(id) {
      vm.actionOrg = _.find(vm.currentUser.organizations, { id: id });
    };

    vm.AssertionsViewOptions = AssertionsViewOptions;
    vm.backgroundColor = AssertionsViewOptions.styles.view.backgroundColor;

    vm.phenotypesStr = '';

    // TODO: fetch and generate these from config service
    var evidence_levels = {
      A: 'Validated',
      B: 'Clinical',
      C: 'Case Study',
      D: 'Preclinical',
      E: 'Inferential'
    };

    $scope.$watch('vm.assertion', function(assertion) {
      if(assertion.drugs.length > 0) {
        assertion.drugsStr = _.chain(assertion.drugs)
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
        assertion.drugsStr = '--';
      }

      if(assertion.phenotypes.length > 0) {
        assertion.phenotypesStr = _.chain(assertion.phenotypes)
          .sortBy('hpo_class')
          .map(function(item) {
            return '<a href="' + item.url + '" target="_blank">' + item.hpo_class + '</a>';
          })
          .value()
          .join(', ');
      } else {
        assertion.phenotypesStr = '--';
      }

      _.each(assertion.evidence_items, function(item) {
        item.evidence_level_string = item.evidence_level + ' - ' + evidence_levels[item.evidence_level];

        if(item.drugs.length > 0) {
          item.drugsStr = _.chain(item.drugs).map('name').value().join(', ');
        } else {
          item.drugsStr = '--';
        }
        if(item.phenotypes.length > 0) {
          item.phenotypesStr = _.chain(item.phenotypes)
            .sortBy('hpo_class')
            .map(function(item) {
              return '<a href="' + item.url + '" target="_blank">' + item.hpo_class + '</a>';
            })
            .value()
            .join(', ');
        } else {
          item.phenotypesStr = '--';
        }
      });
    }, true);

    vm.acceptItem = function(id) {
      $log.debug('accept item ' + id);
      Assertions.accept(id, vm.actionOrg)
        .then(function(response) {
          $log.debug('Accept success.');
          $log.debug(response);
          // reload current user if org changed
          if (vm.actionOrg.id != vm.currentUser.most_recent_organization.id) {
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

    vm.rejectItem = function(id) {
      $log.debug('reject item ' + id);
      Assertions.reject(id, vm.actionOrg)
        .then(function(response) {
          $log.debug('Reject success.');
          $log.debug(response);
          // reload current user if org changed
          if (vm.actionOrg.id != vm.currentUser.most_recent_organization.id) {
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
