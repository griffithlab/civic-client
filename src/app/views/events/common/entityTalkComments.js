(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityTalkCommentsController', EntityTalkCommentsController)
    .directive('entityTalkComments', entityTalkCommentsDirective);

  // @ngInject
  function entityTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {
        entityTalkModel: '='
      },
      link: entityTalkCommentsLink,
      controller: 'EntityTalkCommentsController',
      templateUrl: 'app/views/events/common/entityTalkComments.tpl.html'
    }
  }

  // @ngInject
  function entityTalkCommentsLink(scope, element, attrs) {

  }

  // @ngInject
  function EntityTalkCommentsController($scope) {
    var ctrl = $scope.ctrl = {};
    ctrl.entityTalkModel = $scope.entityTalkModel;

  }

})();
