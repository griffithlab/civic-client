(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(geneTalkRevisionsConfig)
    .factory('GeneTalkRevisionsViewOptions', GeneTalkRevisionsViewOptions)
    .controller('GeneTalkRevisionsController', GeneTalkRevisionsController);

  // @ngInject
  function geneTalkRevisionsConfig($stateProvider) {
    $stateProvider
      .state('events.genes.talk.revisions', {
        abstract: true,
        url: '/revisions',
        templateUrl: 'app/views/events/genes/talk/revisions/GeneTalkRevisionsView.tpl.html',
        controller: 'GeneTalkRevisionsController',
        controllerAs: 'vm',
        resolve: {
          GeneRevisions: 'GeneRevisions',
          GeneHistory: 'GeneHistory',
          initGeneTalkRevisions: function(Genes, GeneRevisions, GeneHistory, $stateParams, $q) {
            var geneId = $stateParams.geneId;
            return $q.all([
              Genes.initComments(geneId),
              GeneRevisions.initRevisions(geneId),
              GeneHistory.initBase(geneId)
            ]);
          }
        },
        deepStateRedirect: [ 'geneId' ],
        data: {
          titleExp: '"Gene " + gene.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.revisions.list', {
        url: '/list/:revisionId',
        template: '<gene-talk-revisions></gene-talk-revisions>',
        data: {
          titleExp: '"Gene " + gene.name + " Revisions"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.revisions.list.summary', {
        url: '/summary',
        template: '<gene-talk-revision-summary></gene-talk-revision-summary>',
        resolve: {
          initRevision: function(GeneRevisions, $stateParams, $q) {
            return $q.all([
              GeneRevisions.get($stateParams.geneId, $stateParams.revisionId),
              GeneRevisions.initComments($stateParams.geneId, $stateParams.revisionId)
            ]);
          }
        },
        data: {
          titleExp: '"Gene " + gene.name + " Revision Summary"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function GeneTalkRevisionsViewOptions($state, $stateParams, Genes) {
    var baseUrl = '';
    var baseState = '';
    var tabData = [];
    var styles = {};

    var gene = Genes.data.item;

    function init() {
      baseState = 'events.genes.talk.revisions';
      baseUrl = $state.href(baseUrl, $stateParams);

      angular.copy({
        view: {
          summaryBackgroundColor: 'pageBackground',
          talkBackgroundColor: 'pageBackground'
        },
        tabs: {
          tabRowBackground: 'pageBackground2Gradient'
        }
      }, styles);
    }

    return {
      init: init,
      state: {
        baseParams: $stateParams,
        baseState: baseState,
        baseUrl: baseUrl
      },
      styles: styles
    };
  }

  // @ngInject
  function GeneTalkRevisionsController(Genes, GeneRevisions, GeneTalkRevisionsRevisionsViewOptions) {
    console.log('GeneTalkRevisionsRevisionsController called.');
    GeneTalkRevisionsRevisionsViewOptions.init();
    this.GeneRevisionsModel = GeneRevisions;
    this.GeneTalkRevisionsViewOptions = GeneTalkRevisionsViewOptions;
  }

})();
