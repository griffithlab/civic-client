(function() {
  'use strict';
  angular.module('civic.events.common')
  .directive('actionBlock', actionBlockDirective)
  .controller('ActionBlockController', ActionBlockController);

  // @ngInject
  function actionBlockDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        users: '='
      },
      controller: 'ActionBlockController',
      templateUrl: 'app/views/events/common/actionBlock.tpl.html'
    };
  }

  // @ngInject
  function ActionBlockController() {
    console.log('action block controller loaded.');
  }
})();
