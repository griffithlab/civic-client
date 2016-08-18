(function() {
  'use strict';

  angular.module('civic.publications')
    .config(PublicationsConfig);

  // @ngInject
  function PublicationsConfig($stateProvider) {
    $stateProvider
      .state('publications', {
        abstract: true,
        url: '/publications',
        template: '<ui-view id="publications-view"></ui-view>',
        data: {
          titleExp: '"Publications"',
          navMode: 'sub'
        }
      })
      .state('publications.list', {
        url: '/list',
        templateUrl: 'app/views/publications/list/publicationsList.tpl.html',
        controller: 'PublicationsListController',
        data: {
          titleExp: '"Publications List"',
          navMode: 'sub'
        }
      })
      .state('publications.detail', {
        url: '/list',
        templateUrl: 'app/views/publications/detail/publicationsDetail.tpl.html',
        controller: 'PublicationsDetailController',
        data: {
          titleExp: '"Publication Detail"',
          navMode: 'sub'
        }
      });
  }


})();
