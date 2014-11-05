(function(){
  'use strict';
  angular.module('civic.states', ['ui.router'])
    .config(routesConfig);

  // @ngInject
  function routesConfig($stateProvider, $urlRouterProvider, $stickyStateProvider) {
    $stickyStateProvider.enableDebug(true);

    // 404
    $urlRouterProvider.otherwise('home');

    // abstract state redirects
    $urlRouterProvider.when("/events/genes/:geneId", "/events/genes/:geneId/summary");

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
        url: '/summary',
        template: '<gene-summary class="col-xs-12"></gene-summary>',
        deepStateRedirect: true
      })
      .state('events.genes.talk', {
        url: '/talk',
        template: '<gene-talk></gene-talk>'
      })
      .state('events.genes.edit', {
        url: '/edit',
        template: '<gene-edit class="col-xs-12"></gene-edit>'
      })
      .state('events.genes.summary.variants', {
        abtract: true,
        url: '/variants/:variantId',
        controller: 'VariantsViewCtrl',
        templateUrl: '/civic-client/views/events/variants/variantsView.tpl.html',
      })
      .state('events.genes.summary.variants.summary', {
        url: '/summary',
        template: '<variant-summary></variant-summary>',
        // deepStateRedirect: true
      })
      .state('events.genes.summary.variants.talk', {
        url:'/talk',
        template: '<variant-talk></variant-talk>'
      })
      .state('events.genes.summary.variants.edit', {
        url:'/edit',
        template: '<p>Edit Variant {{ variant.name }}</p>'
      })
      .state('events.genes.summary.variants.summary.evidence', {
        abstract: true,
        url: '/evidence/:evidenceId',
        controller: 'EvidenceViewCtrl',
        templateUrl: '/civic-client/views/events/evidence/evidenceView.tpl.html'
      })
      .state('events.genes.summary.variants.summary.evidence.summary',{
        url: '/summary',
        template: '<evidence-summary></evidence-summary>'
      })
      .state('events.genes.summary.variants.summary.evidence.talk', {
        url: '/talk',
        template: '<evidence-talk></evidence-talk>'
      })
      .state('events.genes.summary.variants.summary.evidence.edit', {
        url: '/edit',
        template: '<p>Edit Evidence {{ evidence.id }}</p>'
      });
  }
})();