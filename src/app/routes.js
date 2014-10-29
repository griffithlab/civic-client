(function(){
  angular.module('civic.routes', ['ui.router'])
    .config(routesConfig);

  // @ngInject
  function routesConfig($stateProvider, $urlRouterProvider, $stickyStateProvider) {
    $stickyStateProvider.enableDebug(true);

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

    // EVENT VIEWS
    // gene, variant, evidence & associated activity views
    $stateProvider
      .state('events', {
        url: '/events',
        controller: 'EventsViewCtrl',
        templateUrl: '/civic-client/views/events/eventsView.tpl.html'
      })
      .state('events.genes', {
        abstract: true,
        url: '/genes/:geneId',
        controller: 'GenesViewCtrl',
        templateUrl: '/civic-client/views/events/genes/genesView.tpl.html'
      })
      .state('events.genes.summary', {
        url: '',
        template: '<gene-summary></gene-summary>'
      })
      .state('events.genes.talk', {
        url: '/talk',
        template: '<gene-talk></gene-talk>'
      })
      .state('events.genes.summary.variants', {
        abstract: true,
        url: '/variants/:variantId',
        controller: 'VariantsViewCtrl',
        templateUrl: '/civic-client/views/events/variants/variantsView.tpl.html'
      })
      .state('events.genes.summary.variants.summary', {
        url: '',
        template: '<p>variant-summary directive</p>'
      })
      .state('events.genes.summary.variants.talk', {
        url:'/talk',
        template: '<p>variant-talk directive</p>'
      });




    // event edit
    // editing genes, variants, evidence

    // account, profile
    // viewing & editing user options, profile
    // route to home state if no state supplied
    $urlRouterProvider.otherwise('home');
  }
})();