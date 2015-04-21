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
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.log', {
        url: '/log',
        template: '<entity-talk-log></entity-talk-log>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.comments', {
        url: '/comments',
        template: '<entity-talk-comments></entity-talk-comments>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Comments"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.revisions', {
        url: '/revisions',
        template: '<entity-talk-revisions></entity-talk-revisions>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Revisions"',
          navMode: 'sub'
        }
      })
  }

  // @ngInject
  function GeneTalkViewController($scope,
                               $state,
                               // inherited resources
                               Genes,
                               gene) {
    console.log('GenesTalkController called.');
    var ctrl = $scope.ctrl = {};

    var geneTalk = ctrl.geneTalk = {};

    geneTalk.config = {
      type: 'gene',
      name: gene.entrez_name,
      state: {
        baseState: 'events.genes.talk',
        baseUrl: $state.href('events.genes.talk', { geneId: gene.entrez_id })
      },
      tabData: [
        {
          heading: 'Log',
          route: 'events.genes.talk.log',
          params: { geneId: gene.entrez_id }
        },
        {
          heading: 'Comments',
          route: 'events.genes.talk.comments',
          params: { geneId: gene.entrez_id }
        },
        {
          heading: 'Revisions',
          route: 'events.genes.talk.revisions',
          params: { geneId: gene.entrez_id }
        }
      ],
      styles: {
        backgroundColor: 'pageBackground2'
      }
    }
  }

})();
