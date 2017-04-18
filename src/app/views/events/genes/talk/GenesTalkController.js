(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(geneTalkConfig)
    .factory('GenesTalkViewOptions', GenesTalkViewOptions)
    .controller('GeneTalkController', GeneTalkController);

  // @ngInject
  function geneTalkConfig($stateProvider) {
    $stateProvider
      .state('events.genes.talk', {
        abstract: true,
        url: '/talk',
        templateUrl: 'app/views/events/genes/talk/GeneTalkView.tpl.html',
        controller: 'GeneTalkController',
        controllerAs: 'vm',
        resolve: {
          GeneRevisions: 'GeneRevisions',
          GeneHistory: 'GeneHistory',
          initGeneTalk: function(Genes, GeneRevisions, GeneHistory, $stateParams, $cacheFactory, $q) {
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
      .state('events.genes.talk.log', {
        url: '/log',
        template: '<gene-talk-log></gene-talk-log>',
        data: {
          titleExp: '"Gene " + gene.name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.comments', {
        url: '/comments',
        template: '<gene-talk-comments></gene-talk-comments>',
        data: {
          titleExp: '"Gene " + gene.name + " Comments"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function GenesTalkViewOptions($state, $stateParams, Genes) {
    var baseUrl = '';
    var baseState = '';
    var tabData = [];
    var styles = {};

    var gene = Genes.data.item;

    function init() {
      baseState = 'events.genes.talk';
      baseUrl = $state.href(baseUrl, $stateParams);

      angular.copy([
        {
          heading: gene.name + ' Revisions',
          route: baseState + '.revisions.list',
          params: { geneId: gene.id }
        },
        {
          heading: gene.name  + ' Comments',
          route: baseState + '.comments',
          params: { geneId: gene.id }
        },
        {
          heading: gene.name + ' Log',
          route: baseState + '.log',
          params: { geneId: gene.id }
        }
      ], tabData);

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
      tabData: tabData,
      styles: styles
    };
  }

  // @ngInject
  function GeneTalkController($scope, Genes, GeneRevisions, GenesTalkViewOptions) {
    var self = this;
    console.log('GenesTalkController called.');
    GenesTalkViewOptions.init();
    this.GenesTalkViewModel = Genes; // we're re-using the Genes model here but could in the future have a GenesTalk model if warranted
    this.GeneRevisionsModel = GeneRevisions;
    this.GenesTalkViewOptions = GenesTalkViewOptions;

    $scope.$watch(
      function() { return self.GenesTalkViewModel.data.item.name; },
      function(newName) {
        _.each(self.GenesTalkViewOptions.tabData, function(tab) {
          var type = tab.heading.split(' ')[1];
          tab.heading = newName + ' ' + type;
        });
      }
    );
  }

})();
