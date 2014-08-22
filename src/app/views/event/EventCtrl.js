angular.module('civic.event')
  .controller('EventCtrl', EventCtrl)
  .config(eventConfig);

// @ngInject
function EventCtrl() {
  'use strict';

}

// @ngInject
function eventConfig($stateProvider) {
  'use strict';
  $stateProvider
    .state('gene.event', {
      url: '/event/:eventId',
      controller: 'EventCtrl',
      templateUrl: '/civic-client/views/event/event.tpl.html'
    });
}