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
        abstract: true,
        url: '/events',
        templateUrl: 'app/views/events/eventsView.tpl.html',
        data: {
          titleExp: '"Choose Gene"',
          navMode: 'sub'
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
            return Genes.get({
              'geneId': $stateParams.geneId
            }).$promise;
          },
          geneDetails: function(MyGene, gene) {

            return MyGene.getDetails({'geneId': gene.entrez_id });
          }
        },
        controller: 'GenesViewCtrl',
        onExit: /* ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      })
      .state('events.genes.summary', {
        url: '/summary',
        template: '<gene-summary gene="geneView.gene" gene-details="geneView.geneDetails"></gene-summary>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Summary"',
          navMode: 'sub'
        },
        deepStateRedirect: true
      })
      .state('events.genes.edit', {
        url: '/edit',
        template: '<gene-edit gene="geneView.gene" submit-change="geneView.submitChange(geneEdit, comment)" apply-change="geneView.applyChange(geneEdit, comment)"></gene-edit>',
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
      .state('events.genes.summary.variantGroups', {
        abstract: true,
        url: '/variant-groups/:variantGroupId',
        templateUrl: 'app/views/events/variantGroups/variantGroupsView.tpl.html',
        data: {
          titleExp: '"Variant Group"',
          navMode: 'sub'
        },
        resolve: /* ngInject */ {
          VariantGroups: 'VariantGroups',
          variantGroup: function(VariantGroups, $stateParams) {
            return VariantGroups.get({ variantGroupId: $stateParams.variantGroupId }).$promise;
          }
        },
        controller: 'VariantGroupsCtrl'
      })
      .state('events.genes.summary.variantGroups.summary', {
        url: '/summary',
        template: '<variant-group-summary></variant-group-summary>',
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Summary"',
          navMode: 'sub'
        },
        deepStateRedirect: { params: ['variantGroupId'] }
      })
      .state('events.genes.summary.variantGroups.edit',{
        url: '/edit',
        template: '<variant-group-edit></variant-group-edit>',
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Edit"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variantGroups.talk',{
        url: '/talk',
        template: '<variant-group-talk></variant-group-talk>',
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Talk"',
          navMode: 'sub'
        },
        controller: function(variantGroup, $scope) {
          $scope.variantGroup = variantGroup;
        }
      })
      .state('events.genes.summary.variantGroups.talk.comments',{
        url: '/comments',
        template: '<variant-group-talk-comments></variant-group-talk-comments>',
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Comments"',
          navMode: 'sub'
        },
        controller: function(variantGroup, $scope) {
          $scope.variantGroup = variantGroup;
        }
      })
      .state('events.genes.summary.variants', {
        abtract: true,
        url: '/variants/:variantId',
        controller: 'VariantsViewCtrl',
        templateUrl: 'app/views/events/variants/variantsView.tpl.html',
        resolve: /* ngInject */ {
          Variants: 'Variants',
          variant: function(Variants, $stateParams, $log) {
            $log.info('events.variants - resolving variant');
            return Variants.get({'geneId': $stateParams.geneId, 'variantId': $stateParams.variantId }).$promise;
          }
        }
      })
      .state('events.genes.summary.variants.summary', {
        url: '/summary',
        template: '<variant-summary></variant-summary>',
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name  + " Summary"',
          navMode: 'sub'
        },
        deepStateRedirect: { params: ['variantId'] }
      })
      .state('events.genes.summary.variants.edit', {
        url:'/edit',
        template: '<variant-edit></variant-edit>',
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " Edit"',
          navMode: 'sub'
        },
        resolve: {
          variantEdit: function(Variants, $stateParams, $log) {
            $log.info('appStates: resolving variantEdit.');
            return Variants.get({'geneId': $stateParams.geneId, 'variantId': $stateParams.variantId}).$promise;
          }
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
      .state('events.genes.summary.variants.talk.comments', {
        url: '/comments',
        template: '<variant-talk-comments></variant-talk-comments>',
        data: {
          titleExp: '"Variant " + variant.name + " Talk"',
          navMode: 'sub'
        },
        controller: function(variant, $scope) {
          $scope.variant = variant;
        }
      })
      .state('events.genes.summary.variants.talk.changes', {
        url: '/changes/:suggestedChangeId',
        template: '<variant-talk-change></variant-talk-change>',
        data: {
          titleExp: '"Variant " + variant.name + " Changes"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence', {
        abstract: true,
        url: '/evidence/:evidenceItemId',
        controller: 'EvidenceViewCtrl',
        templateUrl: 'app/views/events/evidence/evidenceView.tpl.html',
        resolve: /* ngInject */ {
          Evidence: 'Evidence',
          evidence: function(Evidence, $stateParams, $log) {
            $log.info('events.evidence- resolving evidence');
            return Evidence.get({
              'geneId': $stateParams.geneId,
              'variantId': $stateParams.variantId,
              'evidenceItemId': $stateParams.evidenceItemId
            }).$promise;
          }
        }
      })
      .state('events.genes.summary.variants.summary.evidence.summary',{
        url: '/summary',
        template: '<evidence-summary></evidence-summary>',
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " Summary"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.edit', {
        url: '/edit',
        template: '<evidence-edit></evidence-edit>',
        resolve: {
          evidenceEdit: function(Evidence, $stateParams, $log) {
            $log.info('appStates: resolving evidenceEdit.');
            return Evidence.get({'geneId': $stateParams.geneId, 'variantId': $stateParams.variantId, 'evidenceItemId': $stateParams.evidenceItemId }).$promise;
          }
        },
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " / " + evidence.id + " Edit"',
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
      .state('events.genes.summary.variants.summary.evidence.talk.comments', {
        url: '/comments',
        template: '<evidence-talk-comments></evidence-talk-comments>',
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " Talk"',
          navMode: 'sub'
        },
        controller: function(evidence, $scope) {
          $scope.evidence = evidence;
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.changes', {
        url: '/changes/:suggestedChangeId',
        template: '<evidence-talk-change></evidence-talk-change>',
        data: {
          titleExp: '"Event " + gene.entrez_name + " / " + variant.name + " Changes"',
          navMode: 'sub'
        },
        controller: function(evidence, $scope) {
          $scope.evidence = evidence;
        }
      });
  }
})();
