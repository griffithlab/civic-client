(function(){
  'use strict';
  angular.module('civic.states', ['ui.router'])
    .config(routesConfig);

  // @ngInject
  function routesConfig($stateProvider, $urlRouterProvider) {

    // 404
    $urlRouterProvider.otherwise('home');

    // abstract state redirects
    $urlRouterProvider.when('/events/genes/:geneId', '/events/genes/:geneId/summary');

    // static frontend pages
    // titleExp are parsed in subheader directive's SubheaderCtrl on $stateChangeSuccess
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
      .state('collaborate', {
        url: '/collaborate',
        controller: 'CollaborateCtrl',
        templateUrl: 'app/pages/collaborate.tpl.html',
        data: {
          titleExp: '"Collaborate"',
          navMode: 'sub'
        }
      })
      .state('help', {
        url: '/help',
        controller: 'HelpCtrl',
        templateUrl: 'app/pages/help.tpl.html',
        data: {
          titleExp: '"Help"',
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

    // browse
    $stateProvider
      .state('browse', {
        url: '/browse',
        controller: 'BrowseCtrl',
        templateUrl: 'app/views/browse/browse.tpl.html',
        data: {
          titleExp: '"Browse"',
          navMode: 'sub'
        }
      });

    // EVENT VIEWS
    // gene, variant, evidence & associated activity views
    $stateProvider
      .state('events', {
        url: '/events',
        controller: 'EventsViewCtrl',
        templateUrl: 'app/views/events/eventsView.tpl.html',
        data: {
          titleExp: '"Choose Gene"',
          navMode: 'sub'
        },
        onExit: /* ngInject */ function($deepStateRedirect) {
          console.log('resetting deep state ============');
          $deepStateRedirect.reset();
        }
      })
      .state('events.genes', {
        abstract: true,
        url: '/genes/:geneId',
        controller: 'GenesViewCtrl',
        templateUrl: 'app/views/events/genes/genesView.tpl.html',
        data: {
          titleExp: '"Event"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary', {
        url: '/summary',
        template: '<gene-summary class="col-xs-12"></gene-summary>',
        data: {
          titleExp: '"Gene " + view.gene.entrez_name + " Summary"',
          navMode: 'sub'
        },
        deepStateRedirect: true
      })
      .state('events.genes.talk', {
        url: '/talk',
        template: '<gene-talk></gene-talk>',
        data: {
          titleExp: '"Gene " + view.gene.entrez_name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.edit', {
        url: '/edit',
        template: '<gene-edit class="col-xs-12"></gene-edit>',
        controller: 'GeneEditCtrl',
        data: {
          titleExp: '"Gene " + view.gene.entrez_name + " Edit"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants', {
        abtract: true,
        url: '/variants/:variantId',
        controller: 'VariantsViewCtrl',
        templateUrl: 'app/views/events/variants/variantsView.tpl.html'
      })
      .state('events.genes.summary.variants.summary', {
        url: '/summary',
        template: '<variant-summary></variant-summary>',
        data: {
          titleExp: '"Event " + view.gene.entrez_name + " / " + view.variant.name  + " Summary"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk', {
        url:'/talk',
        template: '<variant-talk></variant-talk>',
        data: {
          titleExp: '"Event " + view.gene.entrez_name + " / " + view.variant.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.edit', {
        url:'/edit',
        template: '<p>Edit Variant {{ variant.name }}</p>',
        data: {
          titleExp: '"Event " + view.gene.entrez_name + " / " + view.variant.name + " Edit"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence', {
        abstract: true,
        url: '/evidence/:evidenceId',
        controller: 'EvidenceViewCtrl',
        templateUrl: 'app/views/events/evidence/evidenceView.tpl.html'
      })
      .state('events.genes.summary.variants.summary.evidence.summary',{
        url: '/summary',
        template: '<evidence-summary></evidence-summary>',
        data: {
          titleExp: '"Event " + view.gene.entrez_name + " / " + view.variant.name+ " / " + view.params.evidenceId + " Summary"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk', {
        url: '/talk',
        template: '<evidence-talk></evidence-talk>',
        data: {
          titleExp: '"Event " + view.params.geneId + " / " + view.variant.name + " / " + view.params.evidenceId + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.edit', {
        url: '/edit',
        template: '<p>Edit Evidence {{ evidence.id }}</p>',
        data: {
          titleExp: '"Event " + view.params.geneId + " / " + view.variant.name + " / " + view.params.evidenceId + " Edit"',
          navMode: 'sub'
        }
      });
  }
})();
