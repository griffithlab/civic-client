(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HelpViewController', HelpViewController)
    .config(helpViewConfig);

  // @ngInject
  function helpViewConfig($stateProvider) {
    $stateProvider
      .state('help', {
        url: '/help',
        abstract: true,
        controller: 'HelpViewController',
        templateUrl: 'app/pages/help.tpl.html',
        data: {
          titleExp: '"Help"',
          navMode: 'sub'
        }
      })
      .state('help.introduction', {
        url: '/introduction',
        templateUrl: 'app/pages/help_intro.tpl.html',
        data: {
          titleExp: '"Help: Introduction"',
          navMode: 'sub'
        }
      })
      .state('help.getting-started', {
        url: '/getting-started',
        abstract: true,
        templateUrl: 'app/pages/help_getting_started_main.tpl.html',
        data: {
          titleExp: '"Help: Getting Started"',
          navMode: 'sub'
        }
      })
      .state('help.getting-started.introductory-materials', {
        url: '/introductory-materials',
        templateUrl: 'app/pages/help_started_introductory_materials.tpl.html',
        data: {
          titleExp: '"Help: Introductory Materials"',
          navMode: 'sub'
        }
      })
      .state('help.getting-started.example-activities', {
        url: '/example-activities',
        templateUrl: 'app/pages/help_started_example.tpl.html',
        data: {
          titleExp: '"Help: Example Activities"',
          navMode: 'sub'
        }
      })
      .state('help.getting-started.source-ideas', {
        url: '/source-ideas',
        templateUrl: 'app/pages/help_started_source.tpl.html',
        data: {
          titleExp: '"Help: Source Ideas"',
          navMode: 'sub'
        }
      })
      .state('help.getting-started.monitoring', {
        url: '/monitoring',
        templateUrl: 'app/pages/help_started_monitoring.tpl.html',
        data: {
          titleExp: '"Help: Monitoring"',
          navMode: 'sub'
        }
      })
      .state('help.evidence', {
        abstract: true,
        url: '/evidence',
        templateUrl: 'app/pages/help_evidence_main.tpl.html',
        data: {
          titleExp: '"Help: Evidence"',
          navMode: 'sub'
        }
      })
      .state('help.evidence.overview', {
        url: '/overview',
        templateUrl: 'app/pages/help_evidence_overview.tpl.html',
        data:{
          titleExp: '"Help: Evidence Overview"',
          navMode: 'sub'
        }
      })
      .state('help.evidence.variant-origin', {
        url: '/variant-origin',
        templateUrl: 'app/pages/help_evidence_variant_origin.tpl.html',
        data:{
          titleExp: '"Help: Variant Origin"',
          navMode: 'sub'
        }
      })
      .state('help.evidence.evidence-types', {
        url: '/evidence-types',
        templateUrl: 'app/pages/help_evidence_types.tpl.html',
        data:{
          titleExp: '"Help: Evidence Types"',
          navMode: 'sub'
        }
      })
      .state('help.evidence.evidence-levels', {
        url: '/evidence-levels',
        templateUrl: 'app/pages/help_evidence_levels.tpl.html',
        data:{
          titleExp: '"Help: Evidence Levels"',
          navMode: 'sub'
        }
      })
      .state('help.evidence.trust-ratings', {
        url: '/trust-ratings',
        templateUrl: 'app/pages/help_evidence_trust_ratings.tpl.html',
        data:{
          titleExp: '"Help: Trust Rating"',
          navMode: 'sub'
        }
      })
      .state('help.variants', {
        abstract: true,
        url: '/variants',
        templateUrl: 'app/pages/help_variants.tpl.html',
        data: {
          titleExp: '"Help: Variants"',
          navMode: 'sub'
        }
      })
      .state('help.variants.overview', {
        url: '/variants-overview',
        templateUrl: 'app/pages/help_variant_overview.tpl.html',
        data: {
          titleExp: '"Help: Variant Naming"',
          navMode: 'sub'
        }
      })
      .state('help.variants.naming', {
        url: '/variants-naming',
        templateUrl: 'app/pages/help_variant_naming.tpl.html',
        data: {
          titleExp: '"Help: Variant Naming"',
          navMode: 'sub'
        }
      })
      .state('help.variants.summary', {
        url: '/variants-summary',
        templateUrl: 'app/pages/help_variant_summaries.tpl.html',
        data: {
          titleExp: '"Help: Variant Summaries"',
          navMode: 'sub'
        }
      })
      .state('help.variants.type', {
        url: '/variants-type',
        templateUrl: 'app/pages/help_variant_varianttypes.tpl.html',
        data: {
          titleExp: '"Help: Variant Types"',
          navMode: 'sub'
        }
      })
      .state('help.variants.coordinates', {
        url: '/variants-coordinates',
        templateUrl: 'app/pages/help_variant_coordinates.tpl.html',
        data: {
          titleExp: '"Help: Variant Coordinates"',
          navMode: 'sub'
        }
      })
      .state('help.genes', {
        abstract: true,
        url: '/genes',
        templateUrl: 'app/pages/help_genes.tpl.html',
        data: {
          titleExp: '"Help: Genes"',
          navMode: 'sub'
        }
      })
      .state('help.genes.overview', {
        url: '/genes-overview',
        templateUrl: 'app/pages/help_gene_overview.tpl.html',
        data: {
          titleExp: '"Help: Genes Overview"',
          navMode: 'sub'
        }
      })
      .state('help.genes.summary', {
        url: '/genes-summary',
        templateUrl: 'app/pages/help_gene_summary.tpl.html',
        data: {
          titleExp: '"Help: Genes Summary"',
          navMode: 'sub'
        }
      })
      .state('help.variant-groups', {
        abstract: true,
        url: '/variant-groups',
        templateUrl: 'app/pages/help_variant_groups.tpl.html',
        data: {
          titleExp: '"Help: Variant Groups"',
          navMode: 'sub'
        }
      })
      .state('help.variant-groups.overview', {
        url: '/overview',
        templateUrl: 'app/pages/help_variant_group_overview.tpl.html',
        data: {
          titleExp: '"Help: Variant Groups Overview"',
          navMode: 'sub'
        }
      })
      .state('help.variant-groups.summary', {
        url: '/summary',
        templateUrl: 'app/pages/help_variant_group_summary.tpl.html',
        data: {
          titleExp: '"Help: Variant Groups Summary"',
          navMode: 'sub'
        }
      })
      .state('help.variant-groups.creating', {
        url: '/creating',
        templateUrl: 'app/pages/help_variant_group_create.tpl.html',
        data: {
          titleExp: '"Help: Creating Variant Groups"',
          navMode: 'sub'
        }
      })
      .state('help.variant-groups.adding', {
        url: '/adding',
        templateUrl: 'app/pages/help_variant_group_addto.tpl.html',
        data: {
          titleExp: '"Help: Variant Groups"',
          navMode: 'sub'
        }
      })
      .state('help.get', {
        url: '/get',
        templateUrl: 'app/pages/help_get.tpl.html',
        data: {
          titleExp: '"Help: Get Help"',
          navMode: 'sub'
        }
      })
      .state('help.report', {
        url: '/report',
        templateUrl: 'app/pages/help_report_problem.tpl.html',
        data: {
          titleExp: '"Help: Report a Problem"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function HelpViewController($scope, $state, $modal) {
    var vm = $scope.vm = {};
    vm.$state = $state;
    vm.tabs = {
      main: [
        {
          heading: 'Introduction',
          parent: 'help.introduction',
          // TODO: figure out why ui-sref-active isn't working with the help main menu
          // thus requireing this parent state & ng-class kludge (see menu links in help.tpl.html)
          state: 'help.introduction'
        },
        {
          heading: 'Getting Started',
          state: 'help.getting-started.introductory-materials',
          parent: 'help.getting-started'
        },
        {
          heading: 'Evidence',
          state: 'help.evidence.overview',
          parent: 'help.evidence',
        },
        {
          heading: 'Variants',
          state: 'help.variants.overview',
          parent: 'help.variants',
        },
        {
          heading: 'Genes',
          state: 'help.genes.overview',
          parent: 'help.genes'
        },
        {
          heading: 'Variant Groups',
          state: 'help.variant-groups.overview',
          parent: 'help.variant-groups'
        },
        {
          heading: 'Get Help',
          state: 'help.get',
          parent: 'help.get'
        },
        {
          heading: 'Report Problem',
          state: 'help.report',
          parent: 'help.report'
        }
      ],
      getting_started: [
	      {
	        heading: 'Introductory Materials',
          state: 'help.getting-started.introductory-materials'
        },
        {
          heading: 'Example Activities',
          state: 'help.getting-started.example-activities'
        },
        {
          heading: 'Source Ideas',
          state: 'help.getting-started.source-ideas'
        },
        {
          heading: 'Monitoring',
          state: 'help.getting-started.monitoring'
        }
	],
      evidence: [
        {
          heading: 'Overview',
          state: 'help.evidence.overview'
        },
        {
          heading: 'Variant Origin',
          state: 'help.evidence.variant-origin'
        },
        {
          heading: 'Evidence Types',
          state: 'help.evidence.evidence-types'
        },
        {
          heading: 'Evidence Levels',
          state: 'help.evidence.evidence-levels'
        },
        {
          heading: 'Trust Ratings',
          state: 'help.evidence.trust-ratings'
        }
      ],
      variant: [
        {
          heading: 'Overview',
          state: 'help.variants.overview'
        },
        {
          heading: 'Variant Name',
          state: 'help.variants.naming'
        },
        {
          heading: 'Variant Summary',
          state: 'help.variants.summary'
        },
        {
          heading: 'Variant Type',
          state: 'help.variants.type'
        },
        {
          heading: 'Variant Coordinates',
          state: 'help.variants.coordinates'
        }
      ],
      gene: [
        {
          heading: 'Overview',
          state: 'help.genes.overview'
        },
        {
          heading: 'Gene Summary',
          state: 'help.genes.summary'
        }
      ],
      variant_group: [
        {
          heading: 'Overview',
          state: 'help.variant-groups.overview'
        },
        {
          heading: 'Variant Group Summary',
          state: 'help.variant-groups.summary'
        },
        {
          heading: 'Create a Variant Group',
          state: 'help.variant-groups.creating'
        },
        {
          heading: 'Add to a Variant Group',
          state: 'help.variant-groups.adding'
        }
      ]
    };
    vm.imgPopup = function imgPopup() {
      $modal.open({
        animation: false,
        backdrop: true,
        template: '<div><img src="assets/images/GP-113_CIViC_schema-collaboration_SCHEMA_v3a.png" ' +
        'class="img-fluid" width="100%" height="100%" ' +
        'alt="CIViC Schema Diagram" ' +
        'ng-click="$close()"' +
        '/></div>',
        size: 'lg'
      });
    };
  }
})();
