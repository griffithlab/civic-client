(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(geneEditConfig)
    .factory('GeneEditViewOptions', GeneEditViewOptions)
    .controller('GeneEditController', GeneEditController);

  // @ngInject
  function geneEditConfig($stateProvider) {
    $stateProvider
      .state('events.genes.edit', {
        abstract: true,
        url: '/edit',
        templateUrl: 'app/views/events/genes/edit/GeneEditView.tpl.html',
        controller: 'GeneEditController',
        controllerAs: 'vm',
        resolve: {
          GeneRevisions: 'GeneRevisions',
          initGeneEdit: function(Genes, GeneRevisions, GeneHistory, $stateParams, $q) {
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
          titleExp: '"Gene " + gene.name + " Edit"',
          navMode: 'sub'
        }
      })
      .state('events.genes.edit.basic', {
        url: '/basic',
        template: '<gene-edit-basic></gene-edit-basic>',
        data: {
          titleExp: '"Gene " + gene.name + " Edit"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function GeneEditViewOptions($state, $stateParams) {
    var baseUrl = '';
    var baseState = '';
    var styles = {};

    function init() {
      baseState = 'events.genes.talk';
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
  function GeneEditController(Genes, GeneRevisions, GeneEditViewOptions) {
    console.log('GeneEditController called.');
    GeneEditViewOptions.init();
    this.GeneEditViewModel = Genes; // we're re-using the Genes model here but could in the future have a GeneEdit model if warranted
    this.GeneRevisionsModel = GeneRevisions;
    this.GeneEditViewOptions = GeneEditViewOptions;
  }

})();
