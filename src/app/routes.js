(function(){
  angular.module('civic.routes', ['ui.router'])
    .config(routesConfig);

  // @ngInject
  function routesConfig($stateProvider, $urlRouterProvider) {
    // static frontend pages
    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeCtrl',
        templateUrl: '/civic-client/pages/home.tpl.html'
      })
      .state('collaborate', {
        url: '/collaborate',
        controller: 'CollaborateCtrl',
        templateUrl: '/civic-client/pages/collaborate.tpl.html'
      })
      .state('help', {
        url: '/help',
        controller: 'HelpCtrl',
        templateUrl: '/civic-client/pages/help.tpl.html'
      })
      .state('contact', {
        url: '/contact',
        controller: 'ContactCtrl',
        templateUrl: '/civic-client/pages/contact.tpl.html'
      });

    // browse
    $stateProvider
      .state('browse', {
        url: '/browse',
        controller: 'BrowseCtrl',
        templateUrl: '/civic-client/views/browse/browse.tpl.html'
      });

    // event views
    // gene, variant, evidence & associated activity views
    $stateProvider
      .state('event', {
        url: '/event',
        controller: 'EventCtrl',
        templateUrl: '/civic-client/views/event/event.tpl.html'
      })
      .state('event.gene', {
        sticky: true,
        url:'/gene/:geneId',
        controller: 'GeneCtrl',
        templateUrl: '/civic-client/views/event/gene/gene.tpl.html'
      })
      .state('event.gene.summary', {
        sticky: true,
        views: {
          'geneDetails@event.gene': {
            controller: 'GeneCtrl',
            templateUrl: '/civic-client/views/event/gene/geneSummary.tpl.html'
          }
        }
      })
      .state('event.gene.talk', {
        sticky: true,
        views: {
          'geneDetails@event.gene': {
            controller: 'GeneCtrl',
            templateUrl: '/civic-client/views/event/gene/geneTalk.tpl.html'
          }
        }
      })
      .state('event.gene.variant', {
        sticky: true,
        url: '/variant/:variantId',
        controller: 'VariantCtrl',
        templateUrl: '/civic-client/views/event/variant/variant.tpl.html'
      });


    // event edit
    // editing genes, variants, evidence

    // account, profile
    // viewing & editing user options, profile
    // route to home state if no state supplied
    $urlRouterProvider.otherwise('home');
  }
})();