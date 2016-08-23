(function() {
  'use strict';

  angular.module('civic.sources')
    .config(sourcesConfig);

  // @ngInject
  function sourcesConfig($stateProvider) {
    $stateProvider
      .state('sources', {
        abstract: true,
        url: '/sources/:sourceId',
        template: '<ui-view id="sources-view"></ui-view>',
        data: {
          titleExp: '"Sources"',
          navMode: 'sub'
        }
      })
      .state('sources.summary', {
        url: '/summary',
        templateUrl: 'app/views/sources/summary/sourcesSummary.tpl.html',
        controller: 'SourcesSummaryController',
        data: {
          titleExp: '"Source Summary"',
          navMode: 'sub'
        },
        resolve: {
          source: function($stateParams, Sources) {
            return Sources.get($stateParams.sourceId);
          }
        }
      });
  }

})();
