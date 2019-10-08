(function() {
  'use strict';
  angular.module('civic.search')
    .controller('SearchController', SearchController);

  // @ngInject
  function SearchController($scope) {

    var vm = $scope.vm = {};

    vm.fields = $scope.$parent.fields; // see SearchViewController for field config

    vm.suggestedSearch = {};

    vm.setSearch = function(search) {
      $scope.$broadcast('setSearch', search);
    };

    vm.suggestedSearches = {
      'assertions': [
        {
          name: 'Predictive EGFR Assertions',
          tooltip: 'Predictive Assertions involving the gene EGFR',
          search: {"operator":"AND","queries":[{"field":"gene_name","condition":{"name":"contains","parameters":["EGFR"]}},{"field":"assertion_type","condition":{"name":"is_equal_to","parameters":["Predictive"]}}]}
        },
        {
          name: 'Crizotinib Assertions',
          tooltip: 'Assertions involving the drug Crizotinib',
          search: {"operator":"AND","queries":[{"field":"drug_name","condition":{"name":"contains","parameters":["Crizotinib"]}}]}
        },

      ],
      'evidence': [
        {
          name: 'High Quality ALK Evidence',
          tooltip: 'Evidence pertaining to ALK variants with high Evidence Levels and Ratings',
          search: {'operator':'AND','queries':[{'field':'gene_name','condition':{'name':'contains','parameters':['ALK']}},{'field':'rating','condition':{'name':'is_greater_than_or_equal_to','parameters':[4]}},{'field':'evidence_level','condition':{'name':'is_above','parameters':['C']}}]}
        },
        {
          name: 'High Quality Predictive Evidence',
          tooltip: 'Predictive Evidence with high Evidence Levels and Ratings',
          search: {'operator':'AND','queries':[{'field':'evidence_type','condition':{'name':'is_equal_to','parameters':['Predictive']}},{'field':'evidence_level','condition':{'name':'is_above','parameters':['B']}},{'field':'rating','condition':{'name':'is_greater_than_or_equal_to','parameters':[4]}}]}
        },
        {
          name: 'High Quality Drug Predictions',
          tooltip: 'Highly rated drug predictive evidence indicating successful outcomes',
          search: {'operator':'AND','queries':[{'field':'evidence_type','condition':{'name':'is_equal_to','parameters':['Predictive']}},{'field':'evidence_direction','condition':{'name':'is_equal_to','parameters':['Supports']}},{'field':'evidence_level','condition':{'name':'is_above','parameters':['C']}},{'field':'rating','condition':{'name':'is_greater_than_or_equal_to','parameters':[3]}}],'entity':'evidence_items','save':true}
        },
        {
          name: 'Alectinib Evidence',
          tooltip: 'Evidence associated with the drug Alectinib',
          search: {'operator':'AND','queries':[{'field':'drug_name','condition':{'name':'contains','parameters':['Alectinib']}}],'entity':'evidence_items','save':true}
        }
      ],
      'genes': [
        {
          name: 'Related to Leukemia',
          tooltip: 'Genes mentioning "leukemia" in their descriptions',
          search: {'operator':'AND','queries':[{'field':'description','condition':{'name':'contains','parameters':['leukemia']}}]}
        }
      ],
      'variants': [
        {
          name: 'CHR1 Chromosome is 2',
          tooltip: 'Variants with a primary chromosome of 2',
          search: {'operator':'AND','queries':[{'field':'chromosome','condition':{'name':'is_equal_to','parameters':['2']}}]}
        },
        {
          name: 'CHR1 Start between 16 and 60K',
          tooltip: 'Variants with a variant starting between 16 and 60K in its primary chromosome',
          search: {'operator':'AND','queries':[{'field':'start','condition':{'name':'is_in_the_range','parameters':['16000000','60000000']}}]}
        },
        {
          name: 'Variant type contains frameshift',
          tooltip: 'Variants with a variant type that contains the world frameshift',
          search: {'operator':'AND','queries':[{'field':'variant_types','condition':{'name':'contains','parameters':['frameshift']}}]}
        }
      ],
      'sources': [
        {
          name: 'Name contains "New England"',
          tooltip: 'Sources likely from the New England Journal of Medicine',
          search: {'operator':'AND','queries':[{'field':'journal','condition':{'name':'contains','parameters':['New England']}}]}
        },
        {
          name: 'Publication Year between 2014 and 2016',
          tooltip: 'Source publication year between 2014 and 2016',
          search: {'operator':'AND','queries':[{'field':'publication_year','condition':{'name':'is_in_the_range','parameters':['2014','2016']}}]}
        }
      ],
      'suggested_changes': [
      ],
    };
  }
})();
