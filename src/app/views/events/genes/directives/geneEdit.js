(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneEdit', geneEdit)
    .controller('GeneEditCtrl', GeneEditCtrl);

// @ngInject
  function geneEdit(Security) {
    var directive = {
      restrict: 'E',
      scope: {
        gene: '=gene',
        submitChange: '&submitChange',
        applyChange: '&applyChange',
        discardChange: '&discardChange'
      },
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneEdit.tpl.html',
      controller: 'GeneEditCtrl',
      link: /* ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function GeneEditCtrl($scope, _, aaNotify, $log){
    var formAttributes = ['entrez_name', 'description', 'clinical_description'];
    var geneEdit = $scope.geneEdit = _.pick($scope.gene, formAttributes);

    var formConfig = $scope.formConfig = {};

    var comment = $scope.comment = {
      title: "Gene Change Request",
      text: ""
    };

    var formStatus = $scope.formStatus = {};

    formConfig.validations = {
      geneEdit: {
        entrez_name: {
          'ng-minlength': 2,
            required: true
        },
        description: {
          'ng-minlength': 32,
            required: true
        },
        clinical_description: {
          'ng-minlength': 32,
            required: false
        }
      },
      comment: {
        title: {
          'ng-minlength': 16,
            required: true
        },
        text: {
          'ng-minlength': 32,
            required: true
        }
      }
    };

    $scope.submit = function() {
      aaNotify.success('Submit Changes Clicked.');
      formStatus.submitBtn = 'submit';
      $scope.submitChange({
        gene: geneEdit
      });
    };

    $scope.apply = function(clickEvent) {
      aaNotify.success('Apply Changes Clicked.');
      formStatus.submitBtn = 'apply';
      $scope.clickEvent = clickEvent;
      $scope.applyChange({
        geneEdit: geneEdit,
        comment: comment
      });
    };

    $scope.discard = function() {
      formStatus.submitBtn = 'discard';
      $scope.geneEditForm.$aaFormExtensions.$reset(function() {
        aaNotify.success('Form Reset.');
      });
    };
  }
})();
