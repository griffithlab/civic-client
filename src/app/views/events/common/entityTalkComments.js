(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityTalkCommentsController', EntityTalkCommentsController)
    .directive('entityTalkComments', entityTalkCommentsDirective);

  // @ngInject
  function entityTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {},
      require: '^^entityTalkView',
      link: entityTalkCommentsLink,
      controller: 'EntityTalkCommentsController',
      templateUrl: 'app/views/events/common/entityTalkComments.tpl.html'
    }
  }

  // @ngInject
  function entityTalkCommentsLink(scope, element, attrs, entityTalkView) {
    scope.ctrl.entityTalkModel = entityTalkView.entityTalkModel;
  }

  // @ngInject
  function EntityTalkCommentsController($scope) {
    var ctrl = $scope.ctrl = {};
  }

})();
