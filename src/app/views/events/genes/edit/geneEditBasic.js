(function() {
  'use strict';
  angular.module('civic.events.genes')
    .directive('geneEditBasic', geneEditBasicDirective)
    .controller('GeneEditBasicController', GeneEditBasicController);

  // @ngInject
  function geneEditBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'GeneEditBasicController',
      templateUrl: 'app/views/events/genes/edit/geneEditBasic.tpl.html',
    }
  }

  // @ngInject
  function GeneEditBasicController($scope, GeneRevisions, Genes, GeneHistory, GenesViewOptions) {
    var geneModel, ctrl;

    ctrl = $scope.ctrl = {};
    geneModel = ctrl.geneModel = Genes;


    ctrl.gene = Genes.data.item;
    ctrl.geneRevisions = GeneRevisions;
    ctrl.geneHistory = GeneHistory;
    ctrl.geneEdit = angular.copy(ctrl.gene);
    ctrl.geneEdit.comment = { title: 'New Suggested Revision', text:'Comment text.' };
    ctrl.myGeneInfo = geneModel.data.myGeneInfo;
    ctrl.variants = geneModel.data.variants;
    ctrl.variantGroups = geneModel.data.variantGroups;

    ctrl.styles = GenesViewOptions.styles;

    ctrl.user = {};

    ctrl.geneFields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
          value: ctrl.gene.name
        }
      },
      {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          rows: 8,
          label: 'Description',
          value: 'ctrl.gene.description'
        }
      },
      {
        template: '<hr/>'
      },
      {
        model: ctrl.geneEdit.comment,
        key: 'title',
        type: 'input',
        templateOptions: {
          label: 'Comment Title',
          value: 'title'
        }
      },
      {
        model: ctrl.geneEdit.comment,
        key: 'text',
        type: 'textarea',
        templateOptions: {
          rows: 5,
          label: 'Comment',
          value: 'text'
        }
      }
    ];

    ctrl.submit = function(geneEdit) {
      geneEdit.geneId = geneEdit.id;
      GeneRevisions.submitRevision(geneEdit);
    };

    ctrl.accept = function(geneEdit) {
      geneEdit.geneId = geneEdit.id;
      GeneRevisions.acceptRevision(geneEdit);
    };
  }
})();
