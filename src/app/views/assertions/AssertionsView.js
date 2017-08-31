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
              description: 'Nam vestibulum accumsan nisl phasellus at dui in ligula mollis ultricies. Etiam vel tortor sodales tellus ultricies commodo.',
              fda_approved: true,
              fda_approval_information: 'Curabitur vulputate vestibulum lorem.',
              nccn_guideline: 'Gastric Cancer',
              evidence_items: [
                {
                  "id": 90,
                  "name": "EID90",
                  "description": "In the setting of BRAF(V600E), NF1 loss resulted in elevated activation of RAS-GTP and resistance to RAF inhibitors.",
                  "disease": {
                    "id": 7,
                    "name": "Melanoma",
                    "display_name": "Melanoma",
                    "doid": "1909",
                    "url": "http://www.disease-ontology.org/?id=DOID:1909"
                  },
                  "drugs": [
                    {
                      "id": 4,
                      "name": "Vemurafenib",
                      "pubchem_id": null
                    }
                  ],
                  "rating": 3,
                  "evidence_level": "D",
                  "evidence_type": "Predictive",
                  "clinical_significance": "Resistance or Non-Response",
                  "evidence_direction": "Supports",
                  "variant_origin": "Somatic Mutation",
                  "drug_interaction_type": null,
                  "status": "accepted",
                  "open_change_count": 0,
                  "type": "evidence",
                  "source": {
                    "id": 98,
                    "name": "Loss of NF1 in cutaneous melanoma is associated with RAS activation and MEK dependence.",
                    "citation": "Nissan et al., 2014, Cancer Res.",
                    "pubmed_id": "24576830",
                    "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/24576830",
                    "open_access": true,
                    "pmc_id": "PMC4005042",
                    "publication_date": {
                      "year": 2014,
                      "month": 4,
                      "day": 15
                    },
                    "journal": "Cancer Res.",
                    "full_journal_title": "Cancer research",
                    "status": "fully curated",
                    "is_review": false
                  },
                  "variant_id": 12
                },
                {
                  "id": 82,
                  "name": "EID82",
                  "description": "BRAF status does not predict outcome in patients treated with dacarbazine or temozolomide.",
                  "disease": {
                    "id": 7,
                    "name": "Melanoma",
                    "display_name": "Melanoma",
                    "doid": "1909",
                    "url": "http://www.disease-ontology.org/?id=DOID:1909"
                  },
                  "drugs": [
                    {
                      "id": 25,
                      "name": "Dacarbazine",
                      "pubchem_id": null
                    },
                    {
                      "id": 11,
                      "name": "Temozolomide",
                      "pubchem_id": ""
                    }
                  ],
                  "rating": 2,
                  "evidence_level": "B",
                  "evidence_type": "Predictive",
                  "clinical_significance": "N/A",
                  "evidence_direction": "Does Not Support",
                  "variant_origin": "Somatic Mutation",
                  "drug_interaction_type": "Substitutes",
                  "status": "accepted",
                  "open_change_count": 0,
                  "type": "evidence",
                  "source": {
                    "id": 96,
                    "name": "BRAF-V600 mutations have no prognostic impact in stage IV melanoma patients treated with monochemotherapy.",
                    "citation": "Meckbach et al., 2014, PLoS ONE",
                    "pubmed_id": "24586605",
                    "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/24586605",
                    "open_access": true,
                    "pmc_id": "PMC3930670",
                    "publication_date": {
                      "year": 2014
                    },
                    "journal": "PLoS ONE",
                    "full_journal_title": "PloS one",
                    "status": "fully curated",
                    "is_review": false
                  },
                  "variant_id": 12
                },
                {
                  "id": 89,
                  "name": "EID89",
                  "description": "Cetuximab or panitumumab may be ineffective in patients with BRAF mutation unless BRAF inhibitor such as Sorafenib is introduced.",
                  "disease": {
                    "id": 11,
                    "name": "Colorectal Cancer",
                    "display_name": "Colorectal Cancer",
                    "doid": "9256",
                    "url": "http://www.disease-ontology.org/?id=DOID:9256"
                  },
                  "drugs": [
                    {
                      "id": 6,
                      "name": "Sorafenib",
                      "pubchem_id": null
                    }
                  ],
                  "rating": 3,
                  "evidence_level": "D",
                  "evidence_type": "Predictive",
                  "clinical_significance": "Resistance or Non-Response",
                  "evidence_direction": "Supports",
                  "variant_origin": "Somatic Mutation",
                  "drug_interaction_type": null,
                  "status": "accepted",
                  "open_change_count": 1,
                  "type": "evidence",
                  "source": {
                    "id": 100,
                    "name": "Wild-type BRAF is required for response to panitumumab or cetuximab in metastatic colorectal cancer.",
                    "citation": "Di Nicolantonio et al., 2008, J. Clin. Oncol.",
                    "pubmed_id": "19001320",
                    "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/19001320",
                    "open_access": null,
                    "pmc_id": null,
                    "publication_date": {
                      "year": 2008,
                      "month": 12,
                      "day": 10
                    },
                    "journal": "J. Clin. Oncol.",
                    "full_journal_title": "Journal of clinical oncology : official journal of the American Society of Clinical Oncology",
                    "status": "fully curated",
                    "is_review": false
                  },
                  "variant_id": 12
                },
                {
                  "id": 91,
                  "name": "EID91",
                  "description": "In a patient with V600E-positive NSCLC, KRAS G12D seemed to confer resistance to dabrafenib.",
                  "disease": {
                    "id": 8,
                    "name": "Non-small Cell Lung Carcinoma",
                    "display_name": "Non-small Cell Lung Carcinoma",
                    "doid": "3908",
                    "url": "http://www.disease-ontology.org/?id=DOID:3908"
                  },
                  "drugs": [
                    {
                      "id": 22,
                      "name": "Dabrafenib",
                      "pubchem_id": null
                    }
                  ],
                  "rating": 2,
                  "evidence_level": "C",
                  "evidence_type": "Predictive",
                  "clinical_significance": "Resistance or Non-Response",
                  "evidence_direction": "Supports",
                  "variant_origin": "Somatic Mutation",
                  "drug_interaction_type": null,
                  "status": "accepted",
                  "open_change_count": 0,
                  "type": "evidence",
                  "source": {
                    "id": 101,
                    "name": "Molecular characterization of acquired resistance to the BRAF inhibitor dabrafenib in a patient with BRAF-mutant non-small-cell lung cancer.",
                    "citation": "Rudin et al., 2013, J Thorac Oncol",
                    "pubmed_id": "23524406",
                    "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/23524406",
                    "open_access": true,
                    "pmc_id": "PMC3634121",
                    "publication_date": {
                      "year": 2013,
                      "month": 5
                    },
                    "journal": "J Thorac Oncol",
                    "full_journal_title": "Journal of thoracic oncology : official publication of the International Association for the Study of Lung Cancer",
                    "status": "fully curated",
                    "is_review": false
                  },
                  "variant_id": 12
                },
                {
                  "id": 95,
                  "name": "EID95",
                  "description": "Dabrafenib with trametinib provides higher response rate and lower toxicity (as compared to chemotherapy) in patients with melanoma.",
                  "disease": {
                    "id": 7,
                    "name": "Melanoma",
                    "display_name": "Melanoma",
                    "doid": "1909",
                    "url": "http://www.disease-ontology.org/?id=DOID:1909"
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
                  "evidence_level": "B",
                  "evidence_type": "Predictive",
                  "clinical_significance": "Sensitivity",
                  "evidence_direction": "Supports",
                  "variant_origin": "Somatic Mutation",
                  "drug_interaction_type": "Combination",
                  "status": "accepted",
                  "open_change_count": 0,
                  "type": "evidence",
                  "source": {
                    "id": 105,
                    "name": "Dabrafenib and trametinib, alone and in combination for BRAF-mutant metastatic melanoma.",
                    "citation": "Menzies et al., 2014, Clin. Cancer Res.",
                    "pubmed_id": "24583796",
                    "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/24583796",
                    "open_access": null,
                    "pmc_id": null,
                    "publication_date": {
                      "year": 2014,
                      "month": 4,
                      "day": 15
                    },
                    "journal": "Clin. Cancer Res.",
                    "full_journal_title": "Clinical cancer research : an official journal of the American Association for Cancer Research",
                    "status": "fully curated",
                    "is_review": false
                  },
                  "variant_id": 12
                },
                {
                  "id": 96,
                  "name": "EID96",
                  "description": "Combined MEK inhibitor GDC0941 and BRAF inhibitor PLX4720 administration to NSG mice subcutanousely injected with colorectal cell lines with a BRAF V600E mutation effectively inhibited tumor growth and reduced cellular proliferation.",
                  "disease": {
                    "id": 11,
                    "name": "Colorectal Cancer",
                    "display_name": "Colorectal Cancer",
                    "doid": "9256",
                    "url": "http://www.disease-ontology.org/?id=DOID:9256"
                  },
                  "drugs": [
                    {
                      "id": 30,
                      "name": "PLX4720",
                      "pubchem_id": null
                    },
                    {
                      "id": 515,
                      "name": "GDC0941",
                      "pubchem_id": null
                    }
                  ],
                  "rating": 3,
                  "evidence_level": "D",
                  "evidence_type": "Predictive",
                  "clinical_significance": "Sensitivity",
                  "evidence_direction": "Supports",
                  "variant_origin": "Somatic Mutation",
                  "drug_interaction_type": "Combination",
                  "status": "accepted",
                  "open_change_count": 0,
                  "type": "evidence",
                  "source": {
                    "id": 106,
                    "name": "A genetic progression model of Braf(V600E)-induced intestinal tumorigenesis reveals targets for therapeutic intervention.",
                    "citation": "Rad et al., 2013, Cancer Cell",
                    "pubmed_id": "23845441",
                    "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/23845441",
                    "open_access": true,
                    "pmc_id": "PMC3706745",
                    "publication_date": {
                      "year": 2013,
                      "month": 7,
                      "day": 8
                    },
                    "journal": "Cancer Cell",
                    "full_journal_title": "Cancer cell",
                    "status": "fully curated",
                    "is_review": false
                  },
                  "variant_id": 12
                },
                {
                  "id": 97,
                  "name": "EID97",
                  "description": "Combined nutlin-3 and PLX4720 administration to athymic nude mice subcutanousely injected with the A357 colorectal cell line with a BRAF V600E mutation effectively inhibited tumor growth significantly more than single agent therapy.",
                  "disease": {
                    "id": 11,
                    "name": "Colorectal Cancer",
                    "display_name": "Colorectal Cancer",
                    "doid": "9256",
                    "url": "http://www.disease-ontology.org/?id=DOID:9256"
                  },
                  "drugs": [
                    {
                      "id": 30,
                      "name": "PLX4720",
                      "pubchem_id": null
                    },
                    {
                      "id": 31,
                      "name": "Nutlin-3",
                      "pubchem_id": null
                    }
                  ],
                  "rating": 2,
                  "evidence_level": "D",
                  "evidence_type": "Predictive",
                  "clinical_significance": "Sensitivity",
                  "evidence_direction": "Supports",
                  "variant_origin": "Somatic Mutation",
                  "drug_interaction_type": "Combination",
                  "status": "accepted",
                  "open_change_count": 0,
                  "type": "evidence",
                  "source": {
                    "id": 107,
                    "name": "Vemurafenib synergizes with nutlin-3 to deplete survivin and suppresses melanoma viability and tumor growth.",
                    "citation": "Ji et al., 2013, Clin. Cancer Res.",
                    "pubmed_id": "23812671",
                    "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/23812671",
                    "open_access": true,
                    "pmc_id": "PMC3777641",
                    "publication_date": {
                      "year": 2013,
                      "month": 8,
                      "day": 15
                    },
                    "journal": "Clin. Cancer Res.",
                    "full_journal_title": "Clinical cancer research : an official journal of the American Association for Cancer Research",
                    "status": "fully curated",
                    "is_review": false
                  },
                  "variant_id": 12
                },
                {
                  "id": 98,
                  "name": "EID98",
                  "description": "Mouse xenografts using HT29 cells harboring the BRAF V600E mutation treated with combination therapy (capecitabine, vemurafenib, bevacizumab) showed increased survival and reduced tumor burden compared to single and double agent therapies.",
                  "disease": {
                    "id": 11,
                    "name": "Colorectal Cancer",
                    "display_name": "Colorectal Cancer",
                    "doid": "9256",
                    "url": "http://www.disease-ontology.org/?id=DOID:9256"
                  },
                  "drugs": [
                    {
                      "id": 32,
                      "name": "Capecitabine",
                      "pubchem_id": null
                    },
                    {
                      "id": 4,
                      "name": "Vemurafenib",
                      "pubchem_id": null
                    },
                    {
                      "id": 33,
                      "name": "Bevacizumab",
                      "pubchem_id": null
                    }
                  ],
                  "rating": 2,
                  "evidence_level": "D",
                  "evidence_type": "Predictive",
                  "clinical_significance": "Sensitivity",
                  "evidence_direction": "Supports",
                  "variant_origin": "Somatic Mutation",
                  "drug_interaction_type": "Combination",
                  "status": "accepted",
                  "open_change_count": 0,
                  "type": "evidence",
                  "source": {
                    "id": 108,
                    "name": "Antitumor activity of BRAF inhibitor vemurafenib in preclinical models of BRAF-mutant colorectal cancer.",
                    "citation": "Yang et al., 2012, Cancer Res.",
                    "pubmed_id": "22180495",
                    "source_url": "http://www.ncbi.nlm.nih.gov/pubmed/22180495",
                    "open_access": null,
                    "pmc_id": null,
                    "publication_date": {
                      "year": 2012,
                      "month": 2,
                      "day": 1
                    },
                    "journal": "Cancer Res.",
                    "full_journal_title": "Cancer research",
                    "status": "fully curated",
                    "is_review": false
                  },
                  "variant_id": 12
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
