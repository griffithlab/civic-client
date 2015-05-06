(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('VariantEditController', VariantEditController)
    .directive('variantEdit', variantEditDirective);

  // @ngInject
  function variantEditDirective() {
    return {
      restrict: 'E',
      require: '^^entityView',
      scope: false,
      templateUrl: 'app/views/events/variants/edit/variantEditBasic.tpl.html',
      link: variantEditLink,
      controller: 'VariantEditController'
    }
  }

  // @ngInject
  function variantEditLink(scope, element, attributes, entityView) {
    scope.variantModel= entityView.entityModel
  }

  // @ngInject
  function VariantEditController ($scope, Security) {
    var unwatch = $scope.$watch('variantModel', function(variantModel){
      var config = variantModel.config;
      var ctrl = $scope.ctrl;

      ctrl.variant = variantModel.data.entity;
      ctrl.variantEdit = angular.extend({}, ctrl.variant);
      ctrl.variantEdit.comment = { title: 'New Suggested Revision', text:'Comment text.' };
      ctrl.variantModel = variantModel;

      ctrl.styles = config.styles;

      ctrl.user = {};

      ctrl.variantFields = [
        {
          key: 'name',
          type: 'input',
          templateOptions: {
            label: 'Name',
            value: ctrl.variant.name
          }
        },
        {
          key: 'description',
          type: 'textarea',
          templateOptions: {
            rows: 8,
            label: 'Description',
            value: 'ctrl.variant.description'
          }
        },
        {
          template: '<hr/>'
        },
        {
          model: ctrl.variantEdit.comment,
          key: 'title',
          type: 'input',
          templateOptions: {
            label: 'Comment Title',
            value: 'title'
          }
        },
        {
          model: ctrl.variantEdit.comment,
          key: 'text',
          type: 'textarea',
          templateOptions: {
            rows: 5,
            label: 'Comment',
            value: 'text'
          }
        }
      ];

      ctrl.submit = function(variant) {
        console.log('submitRevision clicked.');
        variant.variantId = variant.id; // add variantId param for Variants service
        $scope.ctrl.variantModel.services.Variants.submitChange(variant);
      };

      ctrl.apply = function(variant) {
        console.log('applyRevision clicked.');
        variant.variantId = variant.id;
        $scope.ctrl.variantModel.services.Variants.applyChange(variant);
      };

      ctrl.isAdmin = Security.isAdmin;
      // unbind watcher after first digest
      unwatch();
    }, true);

  }
})();
