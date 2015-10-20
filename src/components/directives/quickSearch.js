(function() {
  'use strict';
  angular.module('civic.common')
    .directive('quickSearch', quickSearch)
    .controller('quickSearchCtrl', quickSearchCtrl);

  // @ngInject
  function quickSearch() {
    var directive = {
      templateUrl: 'components/directives/quickSearch.tpl.html',
      restrict: 'E',
      scope: true,
      controller: quickSearchCtrl
    };

    return directive;
  }

  // @ngInject
  function quickSearchCtrl($scope, $state, $log, TypeAheadResults, _) {
    var topResult = {};
    $scope.getVariants = function (val) {
      return TypeAheadResults.query({ query: val }).$promise
        .then(function (response) {
          var labelLimit = 75;
          return _.map(response.result, function (event, index) {
            var result;
            var label = event.entrez_gene + ' / ' + event.variant;

            if (_.includes(event.terms, 'gene_aliases')) {
              var aliasLabel = event.gene_aliases.length > 1 ? 'Aliases' : 'Alias';
              label = label + ' -- ' + aliasLabel + ': ' + event.gene_aliases.join(', ');
            }

            if (_.includes(event.terms, 'drug_names')) {
              var drugLabel = event.drug_names.length > 1 ? 'Drugs' : 'Drug';
              label = label + ' -- ' + drugLabel + ': ' + event.drug_names.join(', ');
            }

            if (_.includes(event.terms, 'disease_names')) {
              var diseaseLabel = event.disease_names.length > 1 ? 'Diseases' : 'Disease';
              label = label + ' -- ' + diseaseLabel + ': ' + event.disease_names.join(', ');
            }

            if (label.length > labelLimit) { label = _.trunc(label, labelLimit); }

            result = {
              /*jshint camelcase: false */
              gene: event.entrez_name,
              geneId: event.gene_id,
              label: label,
              variant: event.variant,
              variantId: event.variant_id
            };

            if(index === 0) { topResult = result; }

            return result;
          });
        });
    };

    $scope.onSelect = function($item) {
      $state.go('events.genes.summary.variants.summary', {geneId: $item.geneId, variantId: $item.variantId});
      $scope.asyncSelected.model = ''; // clear typeahead
    };

    $scope.onGo = function(scope) {
      // NOTE: typeahead control does not make the currently selected item available outside its
      // scope, so we have no way to know which item the user has highlighted. So the Go button
      // cheats and just sends them to the first item on the list.
      // TODO: figure out how to access typeahead dropdown items and current activeIndex
      $state.go('events.genes.summary.variants.summary', {geneId: topResult.geneId, variantId: topResult.variantId});
    }

  }

})();
