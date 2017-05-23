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
        actions: '='
      },
      controller: 'ActionBlockController',
      templateUrl: 'app/views/events/common/actionBlock.tpl.html'
    };
  }

  // @ngInject
  function ActionBlockController() {}
})();
