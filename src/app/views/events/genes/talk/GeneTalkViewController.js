(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(geneTalkViewConfig)
    .controller('GeneTalkViewController', GeneTalkViewController);

  // @ngInject
  function geneTalkViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes.talk', {
        abstract: true,
        url: '/talk',
        templateUrl: 'app/views/events/genes/talk/GeneTalkView.tpl.html',
        controller: 'GeneTalkViewController',
        resolve: {
          comments: function(Genes, gene) {
            return Genes.getComments(gene.entrez_id);
          },
          changes: function(Genes, gene) {
            return Genes.getChanges(gene.entrez_id);
          },
          revisions: function(Genes, gene) {
            return Genes.getRevisions(gene.entrez_id);
          },
          lastRevision: function(Genes, gene) {
            return Genes.getLastRevision(gene.entrez_id);
          }
        },
        deepStateRedirect: true,
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.log', {
        url: '', // transition to events.genes.talk abstract state defaults to this state
        template: '<entity-talk-log entity-talk-model="ctrl.geneTalkModel"></entity-talk-log>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.comments', {
        url: '/comments',
        template: '<entity-talk-comments entity-talk-model="ctrl.geneTalkModel"></entity-talk-comments>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Comments"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.revisions', {
        url: '/revisions',
        template: '<entity-talk-revisions entity-talk-model="ctrl.geneTalkModel"></entity-talk-revisions>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Revisions"',
          navMode: 'sub'
        }
      })
  }

  // @ngInject
  function GeneTalkViewController($scope,
                                  $state,
                                  // resolved resources
                                  comments,
                                  changes,
                                  revisions,
                                  lastRevision,
                                  // inherited resolved resources
                                  Genes,
                                  gene,
                                  variants,
                                  variantGroups,
                                  myGeneInfo) {
    console.log('GenesTalkController called.');
    var ctrl = $scope.ctrl = {};

    // gene-description and my-gene-info directives expect these on scope
    ctrl.gene = gene;
    ctrl.myGeneInfo = myGeneInfo;

    var geneTalkModel = ctrl.geneTalkModel = {};

    geneTalkModel.config = {
      type: 'gene',
      name: gene.entrez_name,
      state: {
        baseState: 'events.genes.talk',
        baseUrl: $state.href('events.genes.talk', { geneId: gene.entrez_id })
      },
      styles: {
        view: {
          summaryBackgroundColor: 'pageBackground2',
          talkBackgroundColor: 'pageBackground'
        },
        tabs: {
          tabRowBackground: 'pageBackground2Gradient'
        }
      },
      tabData: [
        {
          heading: gene.entrez_name + ' Log',
          route: 'events.genes.talk.log',
          params: { geneId: gene.entrez_id }
        },
        {
          heading: gene.entrez_name + ' Comments',
          route: 'events.genes.talk.comments',
          params: { geneId: gene.entrez_id }
        },
        {
          heading: gene.entrez_name + ' Revisions',
          route: 'events.genes.talk.revisions',
          params: { geneId: gene.entrez_id }
        }
      ]
    };

    geneTalkModel.services = {
      Genes: Genes
    };

    geneTalkModel.data = {
      entity: gene,
      id: gene.entrez_id,
      parent: null,
      parentId: null,
      comments: comments,
      changes: changes,
      revisions: revisions,
      lastRevision: lastRevision,
      variants: variants,
      variantGroups: variantGroups,
      myGeneInfo: myGeneInfo
    };
  }

})();
