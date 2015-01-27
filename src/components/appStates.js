(function(){
  'use strict';
  angular.module('civic.states')
    .config(routesConfig);

  // @ngInject
  function routesConfig($stateProvider, $urlRouterProvider) {

    // 404
    $urlRouterProvider.otherwise('home');

    // abstract state redirects
    $urlRouterProvider.when('/events/genes/:geneId', '/events/genes/:geneId/summary');
    $urlRouterProvider.when('/events/genes', '/events'); // if no geneId provided, redirect to /events

    // static frontend pages
    // NOTE: titleExp are angular expressions parsed by the TitleService (/app/components/services/TitleService.js)
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
        templateUrl: 'app/views/events/eventsView.tpl.html',
        data: {
          titleExp: '"Choose Gene"',
          navMode: 'sub'
        },
        resolve: /* ngInject */ {
          Genes: 'Genes',
          geneList: function(Genes) {
            return Genes.queryNames().$promise;
          }
        },
        controller: /* ngInject */ function(geneList, $scope) {
          $scope.genes = geneList;
        },
        onExit: /* ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      })
      .state('events.genes', {
        abstract: true,
        url: '/genes/:geneId',
        templateUrl: 'app/views/events/genes/genesView.tpl.html',
        data: {
          titleExp: '"Event"',
          navMode: 'sub'
        },
        resolve: /* ngInject */ {
          Genes: 'Genes',
          MyGene: 'MyGene',
          gene: function(Genes, $stateParams, $log) {
            $log.info('events.genes - resolving gene');
            return Genes.get({'geneId': $stateParams.geneId }).$promise;
          },
          geneDetails: function(MyGene, $stateParams, $log) {
            $log.info('events.genes - resolving geneDetails');
            return MyGene.getDetails({'geneId': $stateParams.geneId }).$promise;
          },
          Gene: function(Genes, MyGene, $stateParams, $log) {
            return {
              civic: Genes.get({'geneId': $stateParams.geneId }).$promise
              // not returning a promise on the MyGeneInfo query as it can take several seconds
              // and the UI can render fine w/o it.
              // myGene: MyGene.getDetails({'geneId': $stateParams.geneId })
            }
          }
        },
        controller: 'GenesViewCtrl',
        onExit: /* ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      })
      .state('events.genes.summary', {
        url: '/summary',
        template: '<gene-summary class="col-xs-12"></gene-summary>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Summary"',
          navMode: 'sub'
        },
        deepStateRedirect: true
      })
      .state('events.genes.edit', {
        url: '/edit',
        template: '<gene-edit class="col-xs-12"></gene-edit>',
        controller: 'GeneEditCtrl',
        resolve: {
            geneEdit: function(Genes, $stateParams, $log) {
              $log.info('appStates: resolving geneEdit.');
              return Genes.get({'geneId': $stateParams.geneId}).$promise;
          }
        },
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Edit"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk', {
        url: '/talk',
        template: '<gene-talk class="col-xs-12"></gene-talk>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Talk"',
          navMode: 'sub'
        },
        controller: function(gene, $scope) {
          $scope.gene = gene;
        }
      })
      .state('events.genes.talk.comments', {
        url: '/comments',
        template: '<gene-talk-comments></gene-talk-comments>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Talk"',
          navMode: 'sub'
        },
        controller: function(gene, $scope) {
          $scope.gene = gene; // place resolved gene from events.genes in scope
        }
      })
      .state('events.genes.talk.changes', {
        url: '/changes/:suggestedChangeId',
        template: '<gene-talk-change></gene-talk-change>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Changes"',
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
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name  + " Summary"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk', {
        url:'/talk',
        template: '<variant-talk></variant-talk>',
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.edit', {
        url:'/edit',
        template: '<p>Edit Variant {{ variant.name }}</p>',
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " Edit"',
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
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " Summary"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk', {
        url: '/talk',
        template: '<evidence-talk></evidence-talk>',
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.edit', {
        url: '/edit',
        template: '<evidence-edit></evidence-edit>',
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " Edit"',
          navMode: 'sub'
        }
      });
  }
})();
