(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityTalkLogController', EntityTalkLogController)
    .directive('entityTalkLog', entityTalkLogDirective);

  // @ngInject
  function entityTalkLogDirective() {
    return {
      restrict: 'E',
      scope: {
        entityTalkModel: '='
      },
      link: entityTalkLogLink,
      controller: 'EntityTalkLogController',
      templateUrl: 'app/views/events/common/entityTalkLog.tpl.html'
    }
  }

  // @ngInject
  function entityTalkLogLink(scope, element, attrs) {

  }

  // @ngInject
  function EntityTalkLogController($scope) {

  }


})();
