(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GeneEditCtrl', GeneEditCtrl);

  // @ngInject
  function GeneEditCtrl($log, $rootScope, $scope, $stateParams, Genes) {
    $log.info("GeneEditCtrl loaded.");
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Edit Gene ' + $stateParams.geneId);

    $scope.geneEdit = Genes.get({'geneId': $stateParams.geneId });

    $scope.formStatus = {
      errors: [],
      messages: []
    };
    $scope.tags = {
      protein_motifs: function(query) {
        return Genes.protein_motifs({ filter: query }).$promise
      },
      gene_categories: function(query) {
        return Genes.gene_categories({ filter: query }).$promise
      },
      gene_pathways: function(query) {
        return Genes.gene_pathways({ filter: query }).$promise
      },
      protein_functions: function(query) {
        return Genes.protein_functions({ filter: query }).$promise
      }
    };

    $scope.submitEdits = function() {
      $log.info('submitEdits called.');
    };

    $scope.discardEdits = function() {
      $log.info('discardEdits called.');
    };

    $scope.applyEdits = function() {
      $scope.geneEdit.$update({
          //entrez_name: $scope.geneEdit.entrez_name,
          description: $scope.geneEdit.description
          //clinical_description: $scope.geneEdit.clinical_description,
//          "gene_categories[]": $scope.geneEdit.details.gene_categories.map(function(item) { return item.text; }),
//          "protein_motifs[]": $scope.geneEdit.details.protein_motifs.map(function(item) { return item.text; }),
//          "gene_pathways[]": $scope.geneEdit.details.gene_pathways.map(function(item) { return item.text; }),
//          "protein_functions[]": $scope.geneEdit.details.protein_functions.map(function(item) { return item.text; })
        },
        function(response) {
          $log.info("update successful.");
          $scope.$parent.gene = Genes.get({'geneId': $stateParams.geneId });
          $scope.formStatus.errors = [];
          $scope.formStatus.messages = [];
          $scope.formStatus.messages.push("Gene " + $scope.geneEdit.entrez_name + " updated successfully.");
        },
        function(response) {
          $log.info("update unsuccessful.");
          $scope.formStatus.messages = [];
          $scope.formStatus.errors = [];
          var handleError = {
            '401': function() {
              $scope.formStatus.errors.push({
                field: 'Unauthrorized',
                errorMsg: 'You must be logged in to edit this gene.'
              });
            },
            '403': function() {
              $scope.formStatus.errors.push({
                field: 'Insufficient Permissions',
                errorMsg: 'You must be an Admin user to perform the requested action.'
              });
            },
            '422': function(response) {
              _.forEach(response.data.errors, function(value, key) {
                $scope.formStatus.errors.push({
                  field: key,
                  errorMsg: value
                });
              });
            }
          };
          handleError[response.status](response);
        });
    }

  }
})();