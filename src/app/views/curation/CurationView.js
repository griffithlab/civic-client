(function() {
  'use strict';
  angular.module('civic.curation')
    .config(CurationView);

  // @ngInject
  function CurationView($stateProvider) {
    $stateProvider
      .state('curation', {
        abstract: true,
        url: '/curation',
        templateUrl: 'app/views/curation/curation.tpl.html',
        data: {
          titleExp: '"Curation"',
          navMode: 'sub'
        }
      })
      .state('curation.flags', {
        url: '/flags',
        templateUrl: 'app/views/curation/flags/flags.tpl.html',
        controller: 'FlagsQueueController',
        resolve: {
          'openFlags': function(Flags) {
            return Flags.queryOpen();
          }
        },
        data: {
          titleExp: '"Curation: Open Flags"',
          navMode: 'sub'
        }
      })
      .state('curation.sources', {
        url: '/sources',
        templateUrl: 'app/views/curation/sources/sourcesQueue.tpl.html',
        controller: 'SourcesQueueController',
        data: {
          titleExp: '"Curation: Sources"',
          navMode: 'sub'
        }
      })
      .state('curation.evidence', {
        url: '/evidence',
        templateUrl: 'app/views/curation/evidence/evidenceQueues.tpl.html',
        data: {
          titleExp: '"Curation: Evidence"',
          navMode: 'sub'
        }
      });
  }

})();
