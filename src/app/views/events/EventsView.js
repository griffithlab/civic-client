(function() {
  'use strict';
  angular.module('civic.events.genes', ['ui.router']);
  angular.module('civic.events.common', []);
  angular.module('civic.events')
    .config(EventsViewConfig)
    .controller('EventsViewController', EventsViewController);

  // @ngInject
  function EventsViewConfig($stateProvider) {
    $stateProvider
      .state('events', {
        abstract: true,
        url: '/events',
        template: '<div ui-view class="EventsView"></div>',
        controller: 'EventsViewController',
        onExit: /* @ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      });
  }

  // @ngInject
  function EventsViewController($log) {
    //console.log('EventsViewController instantiated.');
  }

})();
