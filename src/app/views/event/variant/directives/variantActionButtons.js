angular.module('civic.event')
.directive('variantActionButtons', eventActionButtons);

// @ngInject
function eventActionButtons () {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: '/civic-client/views/event/variant/directives/variantActionButtons.tpl.html',
    controller: 'EventCtrl',
    replace: true,
    scope: true,
    link: function($scope) {
      console.log('eventActionButtons linked.')
    }
  };

  return directive;
}