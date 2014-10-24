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
        url:'/gene/:geneId',
        controller: 'GeneCtrl',
        templateUrl: '/civic-client/views/event/gene/gene.tpl.html'
      })
      .state('event.gene.summary', {
        views: {
          'geneDetails': {
            controller: 'GeneCtrl',
            templateUrl: '/civic-client/views/event/gene/geneSummary.tpl.html'
          }
        }
      })
      .state('event.gene.talk', {
        views: {
          'geneDetails': {
            controller: 'GeneCtrl',
            templateUrl: '/civic-client/views/event/gene/geneTalk.tpl.html'
          }
        }
      })
      .state('event.gene.variant',{
        controller: 'VariantCtrl'
      });


    // event edit
    // editing genes, variants, evidence

    // account, profile
    // viewing & editing user options, profile
    // route to home state if no state supplied
    $urlRouterProvider.otherwise('home');
  }
})();