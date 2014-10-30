(function(){
  'use strict';
  angular.module('civic.states', ['ui.router'])
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
        templateUrl: '/civic-client/views/events/genes/genesView.tpl.html',
        sticky: true

      })
      .state('events.genes.summary', {
        deepStateRedirect: true,
        url: '',
        template: '<gene-summary class="col-xs-12"></gene-summary>',
        sticky: true
      })
      .state('events.genes.talk', {
        url: '/talk',
        template: '<gene-talk></gene-talk>',
        sticky: true
      })
      .state('events.genes.summary.variants', {
        abstract: true,
        url: '/variants/:variantId',
        controller: 'VariantsViewCtrl',
        templateUrl: '/civic-client/views/events/variants/variantsView.tpl.html'
      })
      .state('events.genes.summary.variants.summary', {
        url: '',
        template: '<variant-summary></variant-summary>',
        sticky: true
      })
      .state('events.genes.summary.variants.talk', {
        url:'/talk',
        template: '<variant-talk></variant-talk>',
        sticky: true
      })
      .state('events.genes.summary.variants.summary.evidence', {
        abstract: true,
        url: '/evidence/:evidenceId',
        controller: 'EvidenceViewCtrl',
        templateUrl: '/civic-client/views/events/evidence/evidenceView.tpl.html'
      })
      .state('events.genes.summary.variants.summary.evidence.summary',{
        url: '',
        template: '<evidence-summary></evidence-summary>',
        sticky: true
      })
      .state('events.genes.summary.variants.summary.evidence.talk', {
        url: '/talk',
        template: '<evidence-talk></evidence-talk>',
        sticky: true
      });




    // event edit
    // editing genes, variants, evidence

    // account, profile
    // viewing & editing user options, profile
    // route to home state if no state supplied
    $urlRouterProvider.otherwise('home');
  }
})();