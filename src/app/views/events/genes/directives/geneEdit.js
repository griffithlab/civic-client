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
  function GeneEditCtrl($scope, _, aaNotify){
    var formAttributes = ['entrez_name', 'entrez_id', 'description', 'clinical_description'];
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
          'ng-minlength': 5,
            required: true
        },
        clinical_description: {
          'ng-minlength': 5,
            required: false
        }
      },
      comment: {
        title: {
          'ng-minlength': 16,
            required: true
        },
        text: {
          'ng-minlength': 5,
            required: true
        }
      }
    };

    $scope.submit = function() {
      formStatus.submitBtn = 'submit';
      $scope.submitChange({
        geneEdit: geneEdit,
        comment: comment
      })
        .then(function(response) { // success
          // TODO: changeUrl should be generated using a ui-router method like $state.go() or by $compiling a template with a ui-sref anchor
          // TODO: required ids for the route (entrez_id) should be included in the response
          // TODO: civic-server will be refactored so that this endpoint doesn't require a geneId
          var changeBtn = '<a class="btn btn-primary btn-xs" href="/#/events/genes/' + geneEdit.entrez_id + '/talk/changes/' + response.data.id  + '">View Change Request</a>';
          aaNotify.success(
            'Your updates were successfully submitted. ' + changeBtn,
            {ttl:0, allowHtml: true});
          $scope.geneEditForm.$aaFormExtensions.$resetChanged();
        },
        function(response) { // failure
          aaNotify.error('Your update failed to to be submitted.<br/><strong>Status: </strong>' + response.status + ' ' + response.statusText, {ttl:0, allowHtml: true });
        });
    };

    $scope.apply = function() {
      formStatus.submitBtn = 'apply';
      $scope.applyChange({
        geneEdit: geneEdit,
        comment: comment
      })
        .then(function(response) { // success
          aaNotify.success('Your updates were successfully applied.', {ttl:0, allowHtml: true});
          $scope.geneEditForm.$aaFormExtensions.$resetChanged();
        },
        function(response) { // failure
          aaNotify.error('Your update failed to to be applied.<br/><strong>Status: </strong>' + response.status + ' ' + response.statusText, {ttl:0, allowHtml: true });
        });
    };

    $scope.reset = function() {
      formStatus.submitBtn = 'reset';
      $scope.geneEditForm.$aaFormExtensions.$reset(function() {
        aaNotify.success('Gene form has been reset.', {ttl: 5000});
      });
    };

    $scope.cancel = function() {

    }
  }
})();
