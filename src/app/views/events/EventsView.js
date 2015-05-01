(function() {
  'use strict';
  angular.module('civic.events.genes', ['ui.router']);
  angular.module('civic.events.variants', ['ui.router']);
  angular.module('civic.events.variantGroups', ['ui.router']);
  angular.module('civic.events.evidence', ['ui.router']);
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
        template: '<ui-view id="events-view"></ui-view>',
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
