(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($scope, gene, geneDetails, Genes, GenesSuggestedChanges, _, $log) {
    var geneView = $scope.geneView = {};
    geneView.gene = gene;
    geneView.geneDetails = geneDetails;
    geneView.variantGroupsExist = _.has(geneView.gene, 'variant_groups') && geneView.gene.variant_groups.length > 0;

    // get latest gene & refresh
    geneView.refresh = function() {
      geneView.gene = Genes.get({ geneId: gene.entrez_id } );
    };

    // submit changes for comment/review
    geneView.submitChange = function(geneEdit) {
      $log.info('geneView.submitChange called with geneEdit: ');
      //  $log.info('submitEdits called.');
      //  GenesSuggestedChanges.add({
      //      entrez_id: $stateParams.geneId,
      //      description: $scope.geneEdit.description,
      //      comment: {
      //        title: 'Reasons for Edit',
      //        text: $scope.geneEdit.reason
      //      }
      //    },
      //    function(response) { // request succeeded
      //      $log.info('Gene SubmitEdits update successful.');
      //      // refresh gene data
      //      $scope.formStatus.errors = [];
      //      $scope.formStatus.messages = [];
      //      var messageExp = '"Your edit suggestions for Gene " + gene.entrez_name + " have been added to the review queue."';
      //      $scope.formStatus.messages.push($parse(messageExp)($scope));
      //      $scope.newChange = response.data;
      //    },
      //    function (response) {
      //      $log.info('update unsuccessful.');
      //      $scope.formStatus.messages = [];
      //      $scope.formStatus.errors = [];
      //      var handleError = {
      //        '401': function () {
      //          $scope.formStatus.errors.push({
      //            field: 'Unauthrorized',
      //            errorMsg: 'You must be logged in to perform this action.'
      //          });
      //        },
      //        '403': function () {
      //          $scope.formStatus.errors.push({
      //            field: 'Insufficient Permissions',
      //            errorMsg: 'You must be an Admin user to perform the requested action.'
      //          });
      //        },
      //        '422': function (response) {
      //          _.forEach(response.data.errors, function (value, key) {
      //            $scope.formStatus.errors.push({
      //              field: key,
      //              errorMsg: value
      //            });
      //          });
      //        },
      //        '500': function(response) {
      //          $scope.formStatus.errors.push({
      //            field: 'SERVER ERROR',
      //            errorMsg: response.statusText
      //          });
      //          $log.info(response);
      //        }
      //      };
      //      handleError[response.status](response);
      //    });
    };

    // apply a gene update request (admin only)
    geneView.applyChange = function(geneEdit) {
      $log.info('geneView.applyEdit called.');
      gene = _.merge(gene, geneEdit);
      gene.$update({},
        function(value, responseHeaders) { // success
          $log.info('Gene updated successfully.');
        },
        function(response) { // failure
          $log.warn('Gene update failed.');
      });
    };

    // reject a gene update request (admin only)
    geneView.rejectChange = function() {
      $log.info('geneView.rejectChange called.');
    };

    // discard gene changes and return to gene summary
    geneView.discardChange = function() {
      $log.info('geneView.discardChange called.');
    };


    // add a comment to current gene
    geneView.submitComment = function() {
      $log.info('geneView.submitComment called.');
    };
  }
})();
