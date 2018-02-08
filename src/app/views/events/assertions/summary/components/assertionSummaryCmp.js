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

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();

    vm.assertion = Assertions.data.item;
    vm.myVariantInfo = Assertions.data.myVariantInfo;

    vm.AssertionsViewOptions = AssertionsViewOptions;
    vm.backgroundColor = AssertionsViewOptions.styles.view.backgroundColor;

    // TODO: fetch and generate these from config service
    var evidence_levels = {
      A: 'Validated',
      B: 'Clinical',
      C: 'Case Study',
      D: 'Preclinical',
      E: 'Inferential'
    };

    $scope.$watchCollection('vm.assertion', function(assertion) {
      if(assertion.phenotypes.length > 0) {
        vm.phenotypesStr = _.chain(assertion.phenotypes).map('hpo_class').value().join(', ');
      } else {
        vm.phenotypesStr = 'N/A';
      }
      _.each(assertion.evidence_items, function(item) {
        item.evidence_level_string = item.evidence_level + ' - ' + evidence_levels[item.evidence_level];
        if(item.drugs.length > 0) {
          item.drugsStr = _.chain(item.drugs).map('name').value().join(', ');
        } else {
          item.drugsStr = 'N/A';
        }

        if(item.drugs.length > 0) {
          item.drugsStr = _.chain(item.drugs).map('name').value().join(', ');
        } else {
          item.drugsStr = 'N/A';
        }
        if(item.phenotypes.length > 0) {
          vm.phenotypesStr = _.chain(item.phenotypes).map('hpo_class').value().join(', ');
        } else {
          vm.phenotypesStr = 'N/A';
        }
      });

    });
    if(Security.currentUser) {
      var currentUserId = Security.currentUser.id;
      var submitterId = _.isUndefined(vm.assertion.lifecycle_actions.submitted) ? null : vm.assertion.lifecycle_actions.submitted.user.id;
      vm.ownerIsCurrentUser = submitterId === currentUserId;
    } else {
      vm.ownerIsCurrentUser = false;
    }

    $scope.acceptItem = function(id) {
      $log.debug('accept item ' + id);
      Assertions.accept(id)
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
      Assertions.reject(id)
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
