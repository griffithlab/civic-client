(function() {
  'use strict';

  angular.module('civic.sources')
    .config(sourcesConfig);

  // @ngInject
  function sourcesConfig($stateProvider) {
    $stateProvider
      .state('suggest', {
        abstract: true,
        url: '/suggest',
        template: '<ui-view id="suggest-view"></ui-view>',
        data: {
          titleExp: '"Suggest"',
          navMode: 'sub'
        }
      })
      .state('suggest.source', {
        url: '/source',
        templateUrl: 'app/views/suggest/source/suggestSource.tpl.html',
        controller: 'SuggestSourceController',
        data: {
          titleExp: '"Suggest Source"',
          navMode: 'sub'
        }
      });
  }

})();
