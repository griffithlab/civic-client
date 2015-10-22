(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HelpCtrl', HelpCtrl);

  // @ngInject
  function HelpCtrl($scope) {
    var vm = $scope.vm = {};
    vm.tabs = {
      main: [
        {
          heading: 'Introduction',
          template: 'app/pages/help_intro.tpl.html',
          active: true
        },
        {
          heading: 'Evidence Items',
          template: 'app/pages/help_evidence_main.tpl.html',
          active: false
        },
        {
          heading: 'Variants',
          template: 'app/pages/help_variants.tpl.html',
          active: false
        },
        {
          heading: 'Genes',
          template: 'app/pages/help_genes.tpl.html',
          active: false
        },
        {
          heading: 'Variant Groups',
          template: 'app/pages/help_variant_groups.tpl.html',
          active: false
        },
        {
          heading: 'Get Help',
          template: 'app/pages/help_get.tpl.html',
          active: false
        },
        {
          heading: 'Report Problem',
          template: 'app/pages/help_report_problem.tpl.html',
          active: false
        }
      ],
      evidence: [
        {
          heading: 'Evidence Item',
          template: 'app/pages/help_evidence_statement.tpl.html',
          active: true
        },
        {
          heading: 'Evidence Types',
          template: 'app/pages/help_evidence_types.tpl.html',
          active: false
        },
        {
          heading: 'Evidence Levels',
          template: 'app/pages/help_evidence_levels.tpl.html',
          active: false
        },
        {
          heading: 'Trust Ratings',
          template: 'app/pages/help_evidence_trust_ratings.tpl.html',
          active: false
        }
      ]
    };
  }
})();
