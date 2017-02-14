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
        url: '/about',
        controller: 'AboutCtrl',
        templateUrl: 'app/pages/about.tpl.html',
        reloadOnSearch: false,
        data: {
          titleExp: '"About"',
          navMode: 'sub'
        }
      })
      .state('participate', {
        url: '/participate',
        controller: 'ParticipateCtrl',
        templateUrl: 'app/pages/participate.tpl.html',
        data: {
          titleExp: '"Participate"',
          navMode: 'sub'
        }
      })
      .state('faq', {
        url: '/faq',
        templateUrl: 'app/pages/faq.tpl.html',
        data: {
          titleExp: '"FAQ"',
          navMode: 'sub'
        }
      })
      .state('meetings', {
        url: '/meetings',
        templateUrl: 'app/pages/meetings.tpl.html',
        data: {
          titleExp: '"Meetings"',
          navMode: 'sub'
        }
      })
      .state('glossary', {
        url: '/glossary',
        templateUrl: 'app/pages/glossary.tpl.html',
        controller: 'GlossaryCtrl',
        data: {
          titleExp: '"Glossary"',
          navMode: 'sub'
        }
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
      .state('api', {
        url: '/api-documentation',
        templateUrl: 'app/pages/apiDocumentation.tpl.html',
        data: {
          titleExp: '"API Documentation"',
          navMode: 'sub'
        }
      })
      .state('graphics', {
        url: '/graphics',
        templateUrl: 'app/pages/graphics.tpl.html',
        data: {
          titleExp: '"Presentation Graphics"',
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
