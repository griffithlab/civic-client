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

  function AssertionSummaryController($scope, Assertions, AssertionsViewOptions) {
    var vm = $scope.vm = {};

    vm.assertion = Assertions.data.item;
    vm.AssertionsViewOptions = AssertionsViewOptions;
    vm.backgroundColor = AssertionsViewOptions.styles.view.backgroundColor;
  }
})();
