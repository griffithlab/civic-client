'use strict';

describe('GenesViewController', function () {
  var $rootScope,
    $compile,
    $state,
    $timeout,
    $controller,
    $q,
    $location,
    $injector,
    GenesService,
    Genes,
    MyGeneInfoService,
    MyGeneInfo,
    GenesViewController,
    scope,
    state = 'events.genes';

  function goFromState(state1, params1) {
    return {
      toState: function (state2, params2) {
        $state.go(state1, params1);
        $rootScope.$digest();
        $state.go(state2, params2);
        $rootScope.$digest();
      }};
  }

  beforeEach(function () {
    module('civic.events');
    module('civic.events.genes', function ($provide, $stateProvider) {
      // set up mock service providers
      $provide.value('Genes', GenesService = {
        get: sinon.stub().resolves({
          "id": 1,
          "entrez_name": "ALK",
          "entrez_id": 238,
          "description": "ALK amplifications, fusions and mutations have been shown to be driving events in non-small cell lung cancer. While crizontinib has demonstrated efficacy in treating the amplification, mutations in ALK have been shown to confer resistance to current tyrosine kinase inhibitors. Second-generation TKI's have seen varied success in treating these resistant cases, and the HSP90 inhibitor 17-AAG has been shown to be cytostatic in ALK-altered cell lines.",
          "clinical_description": null,
          "variants": [
            {
              "name": "R1275Q",
              "id": 9
            },
            {
              "name": "F1174L",
              "id": 8
            },
            {
              "name": "EML4-ALK L1196M",
              "id": 7
            },
            {
              "name": "EML4-ALK C1156Y",
              "id": 6
            },
            {
              "name": "EML4-ALK",
              "id": 5
            }
          ],
          "variant_groups": [
            {
              "id": 2,
              "name": "ALK Fusions",
              "description": "ALK fusion positive non-small cell lung cancer (NSCLC) is treated as its own subset of NSCLC. Many ALK fusions that have been seen as recurrent in cancer serve to increase the activity of the ALK oncogene relative to normal cells. While EML4 is the most common fusion partner, other 5' partners have been observed. The EML4-ALK fusion has shown sensitivity to targeted tyrosine kinase inhibitors such as crizotinib. ",
              "variants": [
                {
                  "id": 5,
                  "entrez_name": "ALK",
                  "entrez_id": 238,
                  "name": "EML4-ALK",
                  "description": "The EML4-ALK fusion has been seen in non-small cell lung cancer, and appears to be an alternative mechanism for ALK activation. Cells with this fusion have been shown to be sensitive to the ALK inhibitor crizotinib."
                },
                {
                  "id": 6,
                  "entrez_name": "ALK",
                  "entrez_id": 238,
                  "name": "EML4-ALK C1156Y",
                  "description": "In patients with non-small cell lung cancer exhibiting EML4-ALK fusion, this variant has been shown to confer resistance to crizotinib."
                },
                {
                  "id": 7,
                  "entrez_name": "ALK",
                  "entrez_id": 238,
                  "name": "EML4-ALK L1196M",
                  "description": "In patients with non-small cell lung cancer exhibiting EML4-ALK fusion, this variant has been shown to confer resistance to crizotinib."
                }
              ]
            },
            {
              "id": 3,
              "name": "Crizotinib Resistance",
              "description": "The ALK oncogene has long been considered a driving factor in non-small cell lung cancer (NSCLC). The targeted tyrosine kinase inhibitor criztonib has shown to be effective in ALK-mutant NSCLC. However, in patients that have shown acquired resistance to crizotinib, missense mutations in the tyrosine kinase domain have shown to drive this resistance. ",
              "variants": [
                {
                  "id": 6,
                  "entrez_name": "ALK",
                  "entrez_id": 238,
                  "name": "EML4-ALK C1156Y",
                  "description": "In patients with non-small cell lung cancer exhibiting EML4-ALK fusion, this variant has been shown to confer resistance to crizotinib."
                },
                {
                  "id": 7,
                  "entrez_name": "ALK",
                  "entrez_id": 238,
                  "name": "EML4-ALK L1196M",
                  "description": "In patients with non-small cell lung cancer exhibiting EML4-ALK fusion, this variant has been shown to confer resistance to crizotinib."
                },
                {
                  "id": 8,
                  "entrez_name": "ALK",
                  "entrez_id": 238,
                  "name": "F1174L",
                  "description": "ALK F1174L has been observed as recurrent in neuroblastoma, non-small cell lung cancer (NSCLC), and other cancer types. Neuroblastoma cells containing this mutation have shown resistance to low doses of criztonib. However, increased dosage can overcome this resistance in cell lines studies. TAE684 has also proven effective in both NSCLC and neuroblastoma F1174L containing cells."
                }
              ]
            }
          ],
          "aliases": [
            "NBLST3",
            "CD246"
          ],
          "last_modified": {},
          "sources": [
            {
              "citation": "Shaw et al., 2013, J. Clin. Oncol.",
              "pubmed_id": "23401436",
              "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/23401436"
            },
            {
              "citation": "Rossi et al., 2014, Int. J. Oncol.",
              "pubmed_id": "24889366",
              "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/24889366"
            }
          ]
        })
      });
      $provide.value('MyGeneInfo', MyGeneInfoService = {
        getDetails: sinon.stub().resolves({
          "_id": "238",
          "alias": ["CD246", "NBLST3"],
          "interpro": [{
            "short_desc": "ConA-like_lec_gl_sf",
            "id": "IPR008985",
            "desc": "Concanavalin A-like lectin/glucanases superfamily"
          }, {
            "short_desc": "LDrepeatLR_classA_rpt",
            "id": "IPR002172",
            "desc": "Low-density lipoprotein (LDL) receptor class A repeat"
          }, {"short_desc": "MAM_dom", "id": "IPR000998", "desc": "MAM domain"}, {
            "short_desc": "Prot_kinase_dom",
            "id": "IPR000719",
            "desc": "Protein kinase domain"
          }, {
            "short_desc": "Kinase-like_dom",
            "id": "IPR011009",
            "desc": "Protein kinase-like domain"
          }, {
            "short_desc": "Ser-Thr/Tyr_kinase_cat_dom",
            "id": "IPR001245",
            "desc": "Serine-threonine/tyrosine-protein kinase catalytic domain"
          }, {
            "short_desc": "Ser/Thr_dual-sp_kinase",
            "id": "IPR002290",
            "desc": "Serine/threonine/dual specificity protein kinase, catalytic  domain"
          }, {
            "short_desc": "Tyr_kinase_cat_dom",
            "id": "IPR020635",
            "desc": "Tyrosine-protein kinase, catalytic domain"
          }],
          "name": "anaplastic lymphoma receptor tyrosine kinase",
          "pathway": {
            "reactome": [{"id": "REACT_115566", "name": "Cell Cycle"}, {
              "id": "REACT_116125",
              "name": "Disease"
            }, {"id": "REACT_22172", "name": "Chromosome Maintenance"}, {
              "id": "REACT_22186",
              "name": "Deposition of new CENPA-containing nucleosomes at the centromere"
            }, {"id": "REACT_22344", "name": "Nucleosome assembly"}, {
              "id": "REACT_6185",
              "name": "HIV Infection"
            }, {"id": "REACT_6288", "name": "Host Interactions of HIV factors"}, {
              "id": "REACT_6916",
              "name": "Interactions of Rev with host cellular proteins"
            }, {"id": "REACT_9395", "name": "Nuclear import of Rev protein"}],
            "kegg": {"id": "hsa05223", "name": "Non-small cell lung cancer - Homo sapiens (human)"},
            "wikipathways": {"id": "WP2848", "name": "Differentiation Pathway"}
          },
          "summary": "This gene encodes a receptor tyrosine kinase, which belongs to the insulin receptor superfamily. This protein comprises an extracellular domain, an hydrophobic stretch corresponding to a single pass transmembrane region, and an intracellular kinase domain. It plays an important role in the development of the brain and exerts its effects on specific neurons in the nervous system. This gene has been found to be rearranged, mutated, or amplified in a series of tumours including anaplastic large cell lymphomas, neuroblastoma, and non-small cell lung cancer. The chromosomal rearrangements are the most common genetic alterations in this gene, which result in creation of multiple fusion genes in tumourigenesis, including ALK (chromosome 2)/EML4 (chromosome 2), ALK/RANBP2 (chromosome 2), ALK/ATIC (chromosome 2), ALK/TFG (chromosome 3), ALK/NPM1 (chromosome 5), ALK/SQSTM1 (chromosome 5), ALK/KIF5B (chromosome 10), ALK/CLTC (chromosome 17), ALK/TPM4 (chromosome 19), and ALK/MSN (chromosome X).",
          "symbol": "ALK"
        })
      });

      // create a navigable events.genes.test state for to force events.genes loading
      $stateProvider
        .state('initial', {
          abstract: false,
          url: '/initial',
          template: '<ui-view/>'
        });
      $stateProvider
        .state('events.genes.child', {
          abstract: false,
          url: '/child',
          template: '<ui-view/>'
      })
    });

    module('q-constructor'); // switch to v1.3 $q constructor for sinon-as-promised
    // module('civic.states'); // load core state config
    module('civic.templates'); // load ng-html2js templates

    // inject services
    inject(function(_$rootScope_,
                    _$compile_,
                    _$controller_,
                    _$state_,
                    _$timeout_,
                    _$q_,
                    _$location_,
                    _$injector_,
                    _Genes_,
                    _MyGeneInfo_) {

      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $controller = _$controller_;
      $state = _$state_;
      $timeout = _$timeout_;
      $q = _$q_;
      $location = _$location_;
      $injector = _$injector_;
      Genes = _Genes_;
      MyGeneInfo = _MyGeneInfo_;

      _ = window._;

      sinonAsPromised($q);

      // ui-view compile to force ui-router's controller instantiation
      $compile("<html><body><ui-view/></body></html>")($rootScope);
      $rootScope.$digest();

      // instantiate GenesViewController using resolved deps from event.genes state
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      expect($state.$current.name).to.equal('events.genes.child');
      var deps  = $state.$current.parent.locals.globals;
      scope = $rootScope.$new();
      GenesViewController = $controller('GenesViewController', {
        $scope: scope,
        Genes: deps.Genes,
        MyGeneInfo: deps.MyGeneInfo,
        gene: deps.gene,
        myGeneInfo: deps.myGeneInfo
      });
    });

  });

  describe('GenesViewController should be successfully instantiated using ui-router resolved deps', function() {
    it('is successfully instantiated using resolved state dependencies', function() {
      expect(GenesViewController).to.exist;
    });
    it('creates a geneView object on $scope', function() {
      expect(scope.geneView).to.exist;
      expect(scope.geneView).to.be.an('object');
    });
  });
});
