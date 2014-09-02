angular.module('civic.event')
.directive('eventActionButtons', eventActionButtons);

// @ngInject
function eventActionButtons () {
  var directive = {
    restrict: 'E',
    templateUrl: 'views/event/directives/eventActionButtons.tpl.html',
    controller: 'EventCtrl',
    replace: true,
    scope: true,
    link: function($scope) {
      console.log('eventActionButtons linked.')
    }
  };

  return directive;
}