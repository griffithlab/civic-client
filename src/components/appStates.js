(function(){
  'use strict';
  angular.module('civic.states')
    .config(routesConfig);

  // @ngInject
  function routesConfig($locationProvider, $stateProvider, $urlRouterProvider) {

    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);

    // 404
    $urlRouterProvider.otherwise('home');

    // reload page when /links URL requested in order to send req to server
    $urlRouterProvider.when('/links/:entityType/:entityId', function() {
      window.location.reload();
    });

    // abstract state redirects
    $urlRouterProvider.when('/events/genes/:geneId', '/events/genes/:geneId/summary');
    $urlRouterProvider.when('/events/genes', '/browse');
    $urlRouterProvider.when('/events', '/browse');

    // NOTE: data.titleExp in state configs are ng expressions parsed by the TitleService

    // static frontend pages
    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeCtrl',
        templateUrl: 'app/pages/home.tpl.html',
        data: {
          titleExp: '"Home"',
          navMode: 'home'
        }
      })
      .state('about', {
        external: true,
        url: 'https://docs.civicdb.org/en/latest/about.html'
      })
      .state('participate', {
        external: true,
        url: 'https://docs.civicdb.org/en/latest/about/participating.html'
      })
      .state('faq', {
        external: true,
        url: 'https://docs.civicdb.org/en/latest/about/faq.html'
      })
      .state('meetings', {
        external: true,
        url: 'https://docs.civicdb.org/en/latest/about/meetings.html'
      })
      .state('apidocs', {
        external: true,
        url: 'https://docs.civicdb.org/en/latest/api.html'
      })
      .state('graphics', {
        external: true,
        url: 'https://docs.civicdb.org/en/latest/about/figures.html'
      })
      .state('releases', {
        url: '/releases',
        templateUrl: 'app/pages/releases.tpl.html',
        controller: 'ReleasesController',
        controllerAs: 'vm',
        data: {
          titleExp: '"Data Releases"',
          navMode: 'sub'
        }
      })
      .state('acknowledgements', {
        url: '/acknowledgements',
        templateUrl: 'app/pages/acknowledgements.tpl.html',
        data: {
          titleExp: '"Acknowledgements"',
          navMode: 'sub'
        }
      })
      .state('contact', {
        url: '/contact',
        controller: 'ContactCtrl',
        templateUrl: 'app/pages/contact.tpl.html',
        data: {
          titleExp: '"Contact"',
          navMode: 'sub'
        }
      });
  }
})();
