(function() {
  'use strict';
  angular.module('civic.assertions')
    .config(assertionsConfig);

  // @ngInject
  function assertionsConfig($stateProvider) {
    $stateProvider
      .state('assertions', {
        abstract: true,
        url: '/assertions/:assertionId',
        template: '<ui-view id="assertions-view"></ui-view>',
        data: {
          titleExp: '"Assertions"',
          navMode: 'sub'
        }
      })
      .state('assertions.summary', {
        url: '/summary',
        templateUrl: 'app/views/assertions/summary/assertionsSummary.tpl.html',
        controller: 'AssertionsSummaryController',
        data: {
          titleExp: '"Assertion Summary"',
          navMode: 'sub'
        },
        resolve: {
          assertion: function($q) {
            return $q.when({
              id: 12345,
              name: 'ASR12345',
              description: 'Quisque dignissim orci tortor, quis condimentum ex. Maecenas condimentum lacus purus, varius pulvinar nisl pharetra luctus. Pellentesque pharetra, dui sed varius iaculis, arcu velit vestibulum leo, sed elementum turpis lacus euismod lectus. Aliquam varius enim facilisis ligula finibus ultricies. Phasellus augue libero, scelerisque sit amet gravida sed, ullamcorper vel mauris. Integer accumsan aliquam nunc ut maximus. Aliquam in faucibus nisi. Fusce accumsan est at metus consequat, ut auctor turpis posuere. Ut, est non tincidunt vestibulum, dui nisl posuere massa, sed ultrices elit odio sed est. Fusce porta, felis vel semper tempus, est libero cursus justo, eu condimentum augue mi et felis. Integer quis ornare leo. Integer eget laoreet ante.',
              fda_approved: true,
              fda_approval_information: 'Curabitur vulputate vestibulum lorem.',
              nccn_guideline: 'Gastric Cancer',
              evidence_items: [
                        {
            "id": 1409,
            "name": "EID1409",
            "description": "Phase 3 randomized clinical trial comparing vemurafenib with dacarbazine in 675 patients with previously untreated, metastatic melanoma with the BRAF V600E mutation. At 6 months, overall survival was 84% (95% confidence interval [CI], 78 to 89) in the vemurafenib group and 64% (95% CI, 56 to 73) in the dacarbazine group. A relative reduction of 63% in the risk of death and of 74% in the risk of either death or disease progression was observed with vemurafenib as compared with dacarbazine (P<0.001 for both comparisons).",
            "disease": {
                "id": 206,
                "name": "Skin Melanoma",
                "display_name": "Skin Melanoma",
                "doid": "8923",
                "url": "http://www.disease-ontology.org/?id=DOID:8923"
            },
            "drugs": [
                {
                    "id": 4,
                    "name": "Vemurafenib",
                    "pubchem_id": null
                }
            ],
            "rating": 5,
            "evidence_level": "A",
            "evidence_type": "Predictive",
            "clinical_significance": "Sensitivity",
            "evidence_direction": "Supports",
            "variant_origin": "Somatic Mutation",
            "drug_interaction_type": null,
            "status": "accepted",
            "open_change_count": 0,
            "type": "evidence",
            "source": {
                "id": 954,
                "name": "Improved survival with vemurafenib in melanoma with BRAF V600E mutation.",
                "citation": "Chapman et al., 2011, N. Engl. J. Med.",
                "pubmed_id": "21639808",
                "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/21639808",
                "open_access": true,
                "pmc_id": "PMC3549296",
                "publication_date": {
                    "year": 2011,
                    "month": 6,
                    "day": 30
                },
                "journal": "N. Engl. J. Med.",
                "full_journal_title": "The New England journal of medicine",
                "status": "fully curated",
                "is_review": false
            },
            "variant_id": 12,
            "state_params": {
                "evidence_item": {
                    "id": 1409,
                    "name": "EID1409"
                },
                "variant": {
                    "id": 12,
                    "name": "V600E"
                },
                "gene": {
                    "id": 5,
                    "name": "BRAF"
                }
            }
        },
        {
            "id": 1411,
            "name": "EID1411",
            "description": "Open-label, randomized phase 3 trial with 704 patients with metastatic melanoma with a BRAF V600 mutation. Patients were randomized to receive either a combination of dabrafenib and trametinib or vemurafenib orally as first-line therapy. At preplanned interim analysis the overall survival rate at 12 months was 72% (95% confidence interval [CI], 67 to 77) in the combination-therapy group and 65% (95% CI, 59 to 70) in the vemurafenib group (hazard ratio for death in the combination-therapy group, 0.69; 95% CI, 0.53 to 0.89; P=0.005). Median progression-free survival was 11.4 months in the combination-therapy group and 7.3 months in the vemurafenib group (hazard ratio, 0.56; 95% CI, 0.46 to 0.69; P<0.001).",
            "disease": {
                "id": 206,
                "name": "Skin Melanoma",
                "display_name": "Skin Melanoma",
                "doid": "8923",
                "url": "http://www.disease-ontology.org/?id=DOID:8923"
            },
            "drugs": [
                {
                    "id": 22,
                    "name": "Dabrafenib",
                    "pubchem_id": null
                },
                {
                    "id": 19,
                    "name": "Trametinib",
                    "pubchem_id": null
                }
            ],
            "rating": 5,
            "evidence_level": "A",
            "evidence_type": "Predictive",
            "clinical_significance": "Sensitivity",
            "evidence_direction": "Supports",
            "variant_origin": "Somatic Mutation",
            "drug_interaction_type": "Combination",
            "status": "accepted",
            "open_change_count": 0,
            "type": "evidence",
            "source": {
                "id": 353,
                "name": "Improved overall survival in melanoma with combined dabrafenib and trametinib.",
                "citation": "Robert et al., 2015, N. Engl. J. Med.",
                "pubmed_id": "25399551",
                "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/25399551",
                "open_access": null,
                "pmc_id": null,
                "publication_date": {
                    "year": 2015,
                    "month": 1,
                    "day": 1
                },
                "journal": "N. Engl. J. Med.",
                "full_journal_title": "The New England journal of medicine",
                "status": "fully curated",
                "is_review": false
            },
            "variant_id": 12,
            "state_params": {
                "evidence_item": {
                    "id": 1411,
                    "name": "EID1411"
                },
                "variant": {
                    "id": 12,
                    "name": "V600E"
                },
                "gene": {
                    "id": 5,
                    "name": "BRAF"
                }
            }
        },
        {
            "id": 1410,
            "name": "EID1410",
            "description": "Pellentesque dapibus suscipit ligula.  Donec posuere augue in quam.  Etiam vel tortor sodales tellus ultricies commodo.  Suspendisse potenti.  Aenean in sem ac leo mollis blandit.  Donec neque quam, dignissim in, mollis nec, sagittis eu, wisi.  Phasellus lacus.  Etiam laoreet quam sed arcu.  Phasellus at dui in ligula mollis ultricies.  Integer placerat tristique nisl.  Praesent augue.  Fusce commodo.  Vestibulum convallis, lorem a tempus semper, dui dui euismod elit, vitae placerat urna tortor vitae lacus.  Nullam libero mauris, consequat quis, varius et, dictum id, arcu.  Mauris mollis tincidunt felis.  Aliquam feugiat tellus ut neque.  Nulla facilisis, risus a rhoncus fermentum, tellus tellus lacinia purus, et dictum nunc justo sit amet elit.",
            "disease": {
                "id": 206,
                "name": "Skin Melanoma",
                "display_name": "Skin Melanoma",
                "doid": "8923",
                "url": "http://www.disease-ontology.org/?id=DOID:8923"
            },
            "drugs": [
                {
                    "id": 4,
                    "name": "Vemurafenib",
                    "pubchem_id": null
                }
            ],
            "rating": 3,
            "evidence_level": "B",
            "evidence_type": "Predictive",
            "clinical_significance": "Sensitivity",
            "evidence_direction": "Supports",
            "variant_origin": "Somatic Mutation",
            "drug_interaction_type": null,
            "status": "accepted",
            "open_change_count": 0,
            "type": "evidence",
            "source": {
                "id": 354,
                "name": "Survival in BRAF V600-mutant advanced melanoma treated with vemurafenib.",
                "citation": "Sosman et al., 2012, N. Engl. J. Med.",
                "pubmed_id": "22356324",
                "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/22356324",
                "open_access": true,
                "pmc_id": "PMC3724515",
                "publication_date": {
                    "year": 2012,
                    "month": 2,
                    "day": 23
                },
                "journal": "N. Engl. J. Med.",
                "full_journal_title": "The New England journal of medicine",
                "status": "fully curated",
                "is_review": false
            },
            "variant_id": 12,
            "state_params": {
                "evidence_item": {
                    "id": 1410,
                    "name": "EID1410"
                },
                "variant": {
                    "id": 12,
                    "name": "V600E"
                },
                "gene": {
                    "id": 5,
                    "name": "BRAF"
                }
            }
        },
        {
            "id": 2146,
            "name": "EID2146",
            "description": "In a phase 2 clinical trial  with 250 metastatic melanoma BRAF-V600E patients, treatment groups were randomly assigned to either dabrafenib, BRAF specific inhibitor, (n=187) or dacarbazine, a standard chemotherapeutic agent (n=63). Patients treated with dabrafenib were associated with improved progression-free survival (5.1mo vs. 2.7mo, HR:0.30, 95% CI:0.18-0.51, P<0.0001) compared with patients undergoing dacarbazine therapy.",
            "disease": {
                "id": 206,
                "name": "Skin Melanoma",
                "display_name": "Skin Melanoma",
                "doid": "8923",
                "url": "http://www.disease-ontology.org/?id=DOID:8923"
            },
            "drugs": [
                {
                    "id": 22,
                    "name": "Dabrafenib",
                    "pubchem_id": null
                }
            ],
            "rating": null,
            "evidence_level": "B",
            "evidence_type": "Predictive",
            "clinical_significance": "Sensitivity",
            "evidence_direction": "Supports",
            "variant_origin": "Somatic Mutation",
            "drug_interaction_type": null,
            "status": "submitted",
            "open_change_count": 0,
            "type": "evidence",
            "source": {
                "id": 1500,
                "name": "Dabrafenib in BRAF-mutated metastatic melanoma: a multicentre, open-label, phase 3 randomised controlled trial.",
                "citation": "Hauschild et al., 2012, Lancet",
                "pubmed_id": "22735384",
                "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/22735384",
                "open_access": null,
                "pmc_id": null,
                "publication_date": {
                    "year": 2012,
                    "month": 7,
                    "day": 28
                },
                "journal": "Lancet",
                "full_journal_title": "Lancet (London, England)",
                "status": "fully curated",
                "is_review": false
            },
            "variant_id": 12,
            "state_params": {
                "evidence_item": {
                    "id": 2146,
                    "name": "EID2146"
                },
                "variant": {
                    "id": 12,
                    "name": "V600E"
                },
                "gene": {
                    "id": 5,
                    "name": "BRAF"
                }
            }
        }

              ]
            });
          }
          // assertion: function($stateParams, Assertions) {
          //   return Assertions.get($stateParams.assertionId);
          // }
        }
      });
  }

})();
