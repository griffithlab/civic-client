(function() {
  'use strict';
  angular.module('civic.events.genes', ['ui.router']);
  angular.module('civic.events.assertions', ['ui.router']);
  angular.module('civic.events.variants', ['ui.router']);
  angular.module('civic.events.variantGroups', ['ui.router']);
  angular.module('civic.events.evidence', ['ui.router']);
  angular.module('civic.events.common', []);
  angular.module('civic.events')
    .config(EventsViewConfig);

  // @ngInject
  function EventsViewConfig($stateProvider) {
    $stateProvider
      .state('events', {
        abstract: true,
        url: '/events',
        template: '<ui-view id="events-view"></ui-view>',
        onExit: /* @ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      });

  }

})();
