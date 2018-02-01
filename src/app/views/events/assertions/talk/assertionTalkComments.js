(function() {
  'use strict';
  angular.module('civic.events.assertions')
    .controller('AssertionTalkCommentsController', AssertionTalkCommentsController)
    .directive('assertionTalkComments', assertionTalkCommentsDirective);

  // @ngInject
  function assertionTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'AssertionTalkCommentsController',
      templateUrl: 'app/views/events/assertions/talk/assertionTalkComments.tpl.html'
    };
  }


  // @ngInject
  function AssertionTalkCommentsController($scope, Assertions) {
    var ctrl = $scope.ctrl = {};

    ctrl.assertionTalkModel = Assertions;
  }

})();
