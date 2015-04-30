(function() {
  'use strict';
  angular.module('civic.events.genes')
    .directive('geneEdit', geneEditDirective);

  // @ngInject
  function geneEditDirective() {
    return {
      restrict: 'E',
      require: '^^entityView',
      scope: {},
      templateUrl: 'app/views/events/genes/edit/geneEdit.tpl.html',
      link: geneEditLink
    }
  }

  // @ngInject
  function geneEditLink(scope, element, attributes, entityView) {
    var geneModel, ctrl;

    ctrl = scope.ctrl = {};
    geneModel= entityView.entityModel

    var config = geneModel.config;

    ctrl.gene = geneModel.data.entity;
    ctrl.geneEdit = angular.copy(ctrl.gene);
    ctrl.geneEdit.comment = { title: 'New Suggested Revision', text:'Comment text.' };
    ctrl.geneModel = geneModel;
    ctrl.myGeneInfo = geneModel.data.myGeneInfo;
    ctrl.variants = geneModel.data.variants;
    ctrl.variantGroups = geneModel.data.variantGroups;

    ctrl.styles = config.styles;

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
    ctrl.submit = function(gene) {
      console.log('submitRevision clicked.');
      gene.geneId = gene.id; // add geneId param for Genes service
      scope.ctrl.geneModel.services.Genes.submitChange(gene);
    };

    ctrl.apply = function(gene) {
      console.log('applyRevision clicked.');
      gene.geneId = gene.id;
      scope.ctrl.geneModel.services.Genes.applyChange(gene);
    };
  }
})();
