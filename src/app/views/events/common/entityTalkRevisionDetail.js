(function() {
  'use strict';
  angular.module('civic.events')
    .directive('entityTalkRevisionDetail', entityTalkRevisionDetail)
    .controller('EntityTalkRevisionDetailController', EntityTalkRevisionDetailController);

  // @ngInject
  function entityTalkRevisionDetail() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        revisionData: '='
      },
      templateUrl: 'app/views/events/variants/summary/entityTalkRevisionDetail.tpl.html',
      controller: 'EntityTalkRevisionDetailController'
    };
    return directive;
  }

  // @ngInject
  function EntityTalkRevisionDetailController($scope) {

  }
})();
