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
    $urlRouterProvider.when('/events/genes/:geneId', '/events/genes/:geneId/summary');

    // static frontend pages
    // titles are parsed in SubheaderCtrl on $stateChangeSuccess
    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeCtrl',
        templateUrl: 'app/pages/home.tpl.html',
        data: {
          titleExp: '"Home"'
        }
      })
      .state('collaborate', {
        url: '/collaborate',
        controller: 'CollaborateCtrl',
        templateUrl: 'app/pages/collaborate.tpl.html',
        data: {
          titleExp: '"Collaborate"'
        }
      })
      .state('help', {
        url: '/help',
        controller: 'HelpCtrl',
        templateUrl: 'app/pages/help.tpl.html',
        data: {
          titleExp: '"Help"'
        }
      })
      .state('contact', {
        url: '/contact',
        controller: 'ContactCtrl',
        templateUrl: 'app/pages/contact.tpl.html',
        data: {
          titleExp: '"Contact"'
        }
      });

    // browse
    $stateProvider
      .state('browse', {
        url: '/browse',
        controller: 'BrowseCtrl',
        templateUrl: 'app/views/browse/browse.tpl.html',
        data: {
          titleExp: '"Browse"'
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
          titleExp: '"Choose Gene"'
        }
      })
      .state('events.genes', {
        abstract: true,
        url: '/genes/:geneId',
        controller: 'GenesViewCtrl',
        templateUrl: 'app/views/events/genes/genesView.tpl.html',
        data: {
          titleExp: '"Event"'
        }
      })
      .state('events.genes.summary', {
        url: '/summary',
        template: '<gene-summary class="col-xs-12"></gene-summary>',
        data: {
          titleExp: '"Gene " + view.gene.entrez_name + " Summary"'
        },
        sticky: true,
        deepStateRedirect: true
      })
      .state('events.genes.talk', {
        url: '/talk',
        template: '<gene-talk></gene-talk>',
        data: {
          titleExp: '"Gene " + view.params.geneId + " Talk"'
        }
      })
      .state('events.genes.edit', {
        url: '/edit',
        template: '<gene-edit class="col-xs-12"></gene-edit>',
        controller: 'GeneEditCtrl',
        data: {
          titleExp: '"Gene " + view.params.geneId + " Edit"'
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
          titleExp: '"Event " + view.gene.geneId + " / " + view.params.variantId + " Summary"'
        }
      })
      .state('events.genes.summary.variants.talk', {
        url:'/talk',
        template: '<variant-talk></variant-talk>',
        data: {
          titleExp: '"Event " + view.gene.entrez_name + " / " + view.params.variantId + " Talk"'
        }
      })
      .state('events.genes.summary.variants.edit', {
        url:'/edit',
        template: '<p>Edit Variant {{ variant.name }}</p>',
        data: {
          titleExp: '"Event " + view.params.geneId + " / " + view.params.variantId + " Edit'
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
          titleExp: '"Event " + view.params.geneId + " / " + view.params.variantId + " / " + view.params.evidenceId + " Summary"'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk', {
        url: '/talk',
        template: '<evidence-talk></evidence-talk>',
        data: {
          titleExp: '"Event " + view.params.geneId + " / " + view.params.variantId + " / " + view.params.evidenceId + " Talk"'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.edit', {
        url: '/edit',
        template: '<p>Edit Evidence {{ evidence.id }}</p>',
        data: {
          titleExp: '"Event " + view.params.geneId + " / " + view.params.variantId + " / " + view.params.evidenceId + " Edit"'
        }
      });
  }
})();
