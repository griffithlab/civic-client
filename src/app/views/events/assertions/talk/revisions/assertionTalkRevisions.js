(function() {
  'use strict';
  angular.module('civic.events.assertions')
    .controller('AssertionTalkRevisionsController', AssertionTalkRevisionsController)
    .directive('assertionTalkRevisions', assertionTalkRevisionsDirective);

  // @ngInject
  function assertionTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'AssertionTalkRevisionsController',
      templateUrl: 'app/views/events/assertions/talk/revisions/assertionTalkRevisions.tpl.html'
    };
  }

  // @ngInject
  function AssertionTalkRevisionsController($scope, AssertionRevisions, AssertionsTalkViewOptions) {
    $scope.assertionRevisions = AssertionRevisions;
    $scope.viewOptions = AssertionsTalkViewOptions;
  }

})();
