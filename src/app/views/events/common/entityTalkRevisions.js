(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityTalkRevisionsController', EntityTalkRevisionsController)
    .directive('entityTalkRevisions', entityTalkRevisionsDirective);

  // @ngInject
  function entityTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {
        entityTalkModel: '='
      },
      link: entityTalkRevisionsLink,
      controller: 'EntityTalkRevisionsController',
      templateUrl: 'app/views/events/common/entityTalkRevisions.tpl.html'
    }
  }

  // @ngInject
  function entityTalkRevisionsLink(scope, element, attrs) {

  }

  // @ngInject
  function EntityTalkRevisionsController() {

  }

})();
