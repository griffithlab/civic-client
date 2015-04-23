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
        deepStateRedirect: [ 'geneId' ],
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
      service: Genes,
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

    geneTalkModel.actions = {
      getComments: function() {
        return Genes.getComments(gene.entrez_id)
          .then(function(response) {
            geneTalkModel.data.comments = response;
            return response;
          });
      },

      getComment: function(commentId) {
        return Genes.getComment(gene.entrez_id, commentId);
      },

      submitComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.submitComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      updateComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.updateComment(reqObj)
          .then(function(response){
            return response;
          });
      },

      deleteComment: function(commentId) {
        return Genes.deleteComment({ geneId: gene.entrez_id, commentId: commentId })
          .then(function(response) {
            return response;
          });
      },

      getChanges: function() {
        return Genes.getChanges(gene.entrez_id)
          .then(function(response) {
            geneTalkModel.data.changes = response;
            return response;
          });
      },

      getChange: function(changeId) {
        return Genes.getChange({ geneId: gene.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      submitChange: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.submitChange(reqObj)
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(changeId) {
        return Genes.acceptChange({ geneId: gene.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      rejectChange: function(changeId) {
        return Genes.rejectChange({ geneId: gene.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      submitChangeComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.submitChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      updateChangeComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.updateChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      getChangeComments: function(changeId) {
        return Genes.getChangeComments({geneId: gene.entrez_id, changeId: changeId})
          .then(function(response) {
            return response;
          })
      },

      getChangeComment: function(changeId, commentId) {
        return Genes.getChangeComment({
          geneId: gene.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      deleteChangeComment: function(changeId, commentId) {
        return Genes.deleteChangeComment({
          geneId: gene.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      getRevisions: function() {
        return Genes.getRevisions(gene.entrez_id)
          .then(function(response) {
            geneTalkModel.data.revisions = response;
            return response;
          });
      },

      getRevision: function(revisionId) {
        return Genes.getRevision({ geneId: gene.entrez_id, revisionId: revisionId })
          .then(function(response) {
            return response;
          });
      },

      getLastRevision: function() {
        return Genes.getLastRevision(gene.entrez_id)
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
