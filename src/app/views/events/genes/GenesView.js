(function() {
  'use strict';
  angular.module('civic.events.genes', ['ui.router'])
    .config(GenesViewConfig)
    .controller('GenesViewController', GenesViewController);

  // @ngInject
  function GenesViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes', {
        abstract: true,
        url: '/genes/:geneId',
        templateUrl: 'app/views/events/genes/GenesView.tpl.html',
        resolve: /* @ngInject */ {
          Genes: 'Genes',
          MyGeneInfo: 'MyGeneInfo',
          gene: function(Genes, $stateParams) {
            return Genes.get({ 'geneId': $stateParams.geneId });
          },
          myGeneInfo: function(MyGeneInfo, gene) {
            return MyGeneInfo.getDetails({ 'geneId': gene.entrez_id });
          }
        },
        //controller: 'GenesViewController',
        controller: function() {
          console.log('GenesViewController instantiated.');
        },
        onExit: /* @ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      });
    // additional events.genes states here
  }

  // @ngInject
  function GenesViewController($scope, Genes, MyGeneInfo, gene, myGeneInfo) {
    console.log('GenesViewController instantiated.');
    var ctrl = $scope;
    var geneView = ctrl.geneView = {};

    geneView.config = {
      name: 'gene',
      state: 'events.genes',
      data: {
        gene: gene,
        myGene: myGeneInfo
      },
      services: {
        Genes: Genes,
        MyGeneInfo: MyGeneInfo
      }
    };

    geneView.actions = {

    };
  }

})();
