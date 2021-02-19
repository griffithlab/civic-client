(function() {
  'use strict';

  var make_obj = function(val, lbl) {
    return { value: val, label: lbl };
  };

  // make options for pull down
  var make_options = function(obj) {
    var options = [];
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var new_obj = make_obj(keys[i], keys[i]);
      options.push(new_obj);
    }
    return options;
  };

  // make options for evidence level
  var el_options = function(obj) {
    var options = [];
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var new_obj = make_obj(keys[i], keys[i] + ' - ' + obj[keys[i]]);
      options.push(new_obj);
    }
    return options;
  };

  // make options for clinical significance
  var cs_options = function(obj) {
    var options = [];
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var subkeys = Object.keys(obj[keys[i]]);
      for (var j = 0; j < subkeys.length; j++){
        var new_obj = { type: keys[i], value: subkeys[j], label: subkeys[j] };
        options.push(new_obj);
      }
    }
    return options;
  };

  // merge two objects, obj and src
  var extend = function(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
  };

  // reduce depth of object tree by 1; by merging properties of properties of obj
  var merge_props = function(obj) {
    var new_obj = {};
    Object.keys(obj).forEach(function(key) { extend(new_obj, obj[key]); });
    return new_obj;
  };

  angular.module('civic.services')
    .constant('ConfigService', {
      serverUrl: 'http://127.0.0.1:3000/',
      optionMethods: {
        make_obj: make_obj,
        make_options: make_options,
        el_options: el_options,
        cs_options: cs_options,
        extend: extend,
        merge_props: merge_props
      },
      mainMenuItems: [
        {
          label: 'About',
          state: 'about'
        },
        {
          label: 'Participate',
          state: 'participate'
        },
        {
          label: 'Community',
          state: 'community.main'
        },
        {
          label: 'Help',
          state: 'help'
        },
        {
          label: 'FAQ',
          state: 'faq'
        }
      ],
      footerMenuItems: [
        {
          label: 'API Documentation',
          state: 'apidocs'
        },
        {
          label: 'Data Releases',
          state: 'releases'
        },
        {
          label: 'Presentation Graphics',
          state: 'graphics'
        },
        {
          label: 'Meetings and Events',
          state: 'meetings'
        },
        {
          label: 'Statistics',
          state: 'statistics.evidence'
        },
        {
          label: 'Acknowledgements',
          state: 'acknowledgements'
        },
        {
          label: 'Contact',
          state: 'contact'
        }
      ],
      valid_chromosomes: [
        { value: '1', name: '1' },
        { value: '2', name: '2' },
        { value: '3', name: '3' },
        { value: '4', name: '4' },
        { value: '5', name: '5' },
        { value: '6', name: '6' },
        { value: '7', name: '7' },
        { value: '8', name: '8' },
        { value: '9', name: '9' },
        { value: '10', name: '10' },
        { value: '11', name: '11' },
        { value: '12', name: '12' },
        { value: '13', name: '13' },
        { value: '14', name: '14' },
        { value: '15', name: '15' },
        { value: '16', name: '16' },
        { value: '17', name: '17' },
        { value: '18', name: '18' },
        { value: '19', name: '19' },
        { value: '20', name: '20' },
        { value: '21', name: '21' },
        { value: '22', name: '22' },
        { value: 'X', name: 'X' },
        { value: 'Y', name: 'Y' },
        { value: 'MT', name: 'MT' }
      ],
      evidenceAttributeDescriptions: {
        variant_origin: {
          'Somatic': 'Variant is a mutation, found only in tumor cells, having arisen in a specific tissue (non-germ cell), and is not expected to be inherited or passed to offspring.',
          'Rare Germline': 'Variant is found in every cell (not restricted to tumor/diseased cells) and is thought to exist in less than 1% of the population relevant to this evidence item.',
          'Common Germline': 'Variant is found in every cell (not restricted to tumor/diseased cells) and is thought to exist in at least 1% of the population relevant to this evidence item.',
          'Unknown': 'The variant origin is uncertain based on the available evidence.',
          'N/A': 'The variant type (e.g., expression) is not compatible (or easily classified) with the CIViC concept of variant origin.'
        },
        source_type: {
          'PubMed': 'Evidence item source uses a PubMed publication.',
          'ASCO': 'Evidence item source uses an ASCO abstract.'
        },
        evidence_type: {
          evidence_item: {
            'Predictive': 'Evidence pertains to a variant\'s effect on therapeutic response',
            'Diagnostic': 'Evidence pertains to a variant\'s impact on patient diagnosis (cancer subtype)',
            'Prognostic': 'Evidence pertains to a variant\'s impact on disease progression, severity, or patient survival',
            'Predisposing': 'Evidence pertains to a germline variant\'s role in conferring susceptibility to disease (including pathogenicity evaluations)',
            'Functional': 'Evidence pertains to a variant that alters biological function from the reference state',
            'Oncogenic': 'Evidence pertains to a somatic variant\'s involvement in tumor pathogenesis as described by the Hallmarks of Cancer',
          },
          assertion: {
            'Predictive': 'Evidence pertains to a variant\'s effect on therapeutic response',
            'Diagnostic': 'Evidence pertains to a variant\'s impact on patient diagnosis (cancer subtype)',
            'Prognostic': 'Evidence pertains to a variant\'s impact on disease progression, severity, or patient survival',
            'Predisposing': 'Evidence pertains to a germline variant\'s role in conferring susceptibility to disease (including pathogenicity evaluations)',
          }
        },
        evidence_level_brief: {
          A: 'Validated association',
          B: 'Clinical evidence',
          C: 'Case study',
          D: 'Preclinical evidence',
          E: 'Inferential association'
        },
        evidence_level: {
          A: 'Proven/consensus association in human medicine',
          B: 'Clinical trial or other primary patient data supports association',
          C: 'Individual case reports from clinical journals',
          D: 'In vivo or in vitro models support association',
          E: 'Indirect evidence'
        },
        evidence_direction:{
          evidence_item: {
            'Predictive': {
              'Supports': 'The experiment or study supports this variant\'s response to a drug',
              'Does Not Support': 'The experiment or study does not support, or was inconclusive of an interaction between this variant and a drug'
            },
            'Diagnostic': {
              'Supports': 'The experiment or study supports this variant\'s impact on the diagnosis of disease or subtype',
              'Does Not Support': 'The experiment or study does not support this variant\'s impact on diagnosis of disease or subtype'
            },
            'Prognostic': {
              'Supports': 'The experiment or study supports this variant\'s impact on prognostic outcome',
              'Does Not Support': 'The experiment or study does not support a prognostic association between variant and outcome'
            },
            'Predisposing': {
              'N/A': 'Evidence Direction is Not Applicable for Predisposing Evidence Type.'
            },
            'Functional': {
              'Supports': 'The experiment or study supports this variant causing alteration or non-alteration of the gene product function',
              'Does Not Support': 'The experiment or study does not support this variant causing alteration or non-alteration of the gene product function',
            },
            'Oncogenic': {
              'N/A': 'Evidence Direction is Not Applicable for Oncogenic Evidence Type.'
            },
          },
          assertion: {
            'Predictive': {
              'Supports': 'The Assertion and associated Evidence Items support this variant\'s response to a drug',
              'Does Not Support': 'The Assertion and associated evidence does not support, or was inconclusive of an interaction between this variant and a drug'
            },
            'Diagnostic': {
              'Supports': 'The Assertion and associated Evidence Items support this variant\'s impact on the diagnosis of disease or subtype',
              'Does Not Support': 'The Assertion and associated evidence does not support this variant\'s impact on diagnosis of disease or subtype'
            },
            'Prognostic': {
              'Supports': 'The Assertion and associated Evidence Items support this variant\'s impact on prognostic outcome',
              'Does Not Support': 'The Assertion and associated evidence does not support a prognostic association between variant and outcome'
            },
            'Predisposing': {
              'Supports': 'The Assertion and associated Evidence Items support a variant\'s impact on predisposing outcome',
              'Does Not Support': 'The Assertion and associated evidence does not support a predisposing association between variant and outcome'
            },
            'Functional': {
              'Supports': 'The Assertion and associated Evidence Items support this variant causing alteration or non-alteration of the gene product function',
              'Does Not Support': 'The Assertion and associated evidence does not support this variant causing alteration or non-alteration of the gene product function',
            },
          }
        },
        clinical_significance: {
          evidence_item: {
            'Predictive': {
              'Sensitivity/Response': 'Associated with a clinical or preclinical response to treatment',
              'Resistance': 'Associated with clinical or preclinical resistance to treatment',
              'Adverse Response': 'Associated with an adverse response to drug treatment',
              'Reduced Sensitivity': 'Response to treatment is lower than seen in other treatment contexts',
              'N/A': 'Variant does not inform clinical action'
            },
            'Diagnostic': {
              'Positive': 'Associated with diagnosis of disease or subtype',
              'Negative': 'Associated with lack of disease or subtype',
            },
            'Prognostic': {
              'Better Outcome': 'Demonstrates better than expected clinical outcome',
              'Poor Outcome': 'Demonstrates worse than expected clinical outcome',
              'N/A': 'Variant does not inform clinical action'
            },
            'Predisposing': {
              'N/A': 'Clinical Significance is Not Applicable for Predisposing Evidence Type'
            },
            'Functional': {
              'Gain of Function': 'Sequence variant conferrs a new or enhanced function',
              'Loss of Function': 'Sequence variant conferrs a diminished or abolished function',
              'Unaltered Function': 'Gene product of sequence variant is unchanged',
              'Neomorphic': 'Sequence variant creates a novel function',
              'Dominant Negative': 'Seuqnce variant abolishes wild type allele function',
              'Unknown': 'Sequence variant that cannot be precisely defined the other listed categories',
            },
            'Oncogenic': {
              'N/A': 'Clinical Significance is Not Applicable for Oncogenic Evidence Type'
            }
          },
          assertion: {
            'Predictive': {
              'Sensitivity/Response': 'Associated with a clinical or preclinical response to treatment',
              'Resistance': 'Associated with clinical or preclinical resistance to treatment',
              'Adverse Response': 'Associated with an adverse response to drug treatment',
              'Reduced Sensitivity': 'Response to treatment is lower than seen in other treatment contexts',
              'N/A': 'Variant does not inform clinical action'
            },
            'Diagnostic': {
              'Positive': 'Associated with diagnosis of disease or subtype',
              'Negative': 'Associated with lack of disease or subtype',
            },
            'Prognostic': {
              'Better Outcome': 'Demonstrates better than expected clinical outcome',
              'Poor Outcome': 'Demonstrates worse than expected clinical outcome',
              'N/A': 'Variant does not inform clinical action'
            },
            'Predisposing': {
              'Pathogenic': 'Very strong evidence the variant is pathogenic',
              'Likely Pathogenic': 'Strong evidence (>90% certainty) the variant is pathogenic.',
              'Benign': 'Very strong evidence the variant is benign',
              'Likely Benign': 'Not expected to have a major effect on disease',
              'Uncertain Significance': 'Does not fullfill the ACMG/AMP criteria for pathogenic/benign, or the evidence is conflicting',
            },
          }
        },
        drug_interaction_type: {
          'Combination': 'The drugs listed were used as part of a combination therapy approach',
          'Sequential': 'The drugs listed were used at separate timepoints in the same treatment plan',
          'Substitutes': 'The drugs listed are often considered to be of the same family, or behave similarly in a treatment setting'
        },
        rating: {
          1: 'Poor - Claim is not supported well by experimental evidence. Results are not reproducible, or have very small sample size. No follow-up is done to validate novel claims.',
          2: 'Adequate - Evidence is not well supported by experimental data, and little follow-up data is available. Experiments may lack proper controls, have small sample size, or are not statistically convincing.',
          3: 'Average - Evidence is convincing, but not supported by a breadth of experiments. May be smaller scale projects, or novel results without many follow-up experiments. Discrepancies from expected results are explained and not concerning.',
          4: 'Strong - Well supported evidence. Experiments are well controlled, and results are convincing. Any discrepancies from expected results are well-explained and not concerning.',
          5: 'Excellent - Solid, well supported evidence from a lab or journal with respected academic standing. Experiments are well controlled, and results are clean and reproducible across multiple replicates. Evidence confirmed using separate methods.'
        }
      },
      evidenceHelpText: {
        'Gene Entrez Name' : 'Entrez Gene name (e.g. BRAF). Gene name must be known to the Entrez database.',
        'Variant Name' : 'Description of the type of variant (e.g., V600E, BCR-ABL fusion, Loss-of-function, exon 12 mutations). Should be as specific as possible (i.e., specific amino acid changes).',
        'Pubmed ID' : 'PubMed ID for the publication associated with the evidence statement (e.g. 23463675)',
        'Variant Origin' : 'Origin of variant',
        'Disease' : 'Please enter a disease name. If you are unable to locate the disease in the dropdown, please check the \'Could not find disease\' checkbox below and enter the disease in the field that appears.',
        'Disease Name' : 'Enter the name of the disease here.',
        'Evidence Statement' : 'Your original description of evidence from published medical literature detailing the association of or lack of association of a variant with diagnostic, prognostic or predictive value in relation to a specific disease (and treatment for predictive evidence). Data constituting protected health information (PHI) should not be entered. Please familiarize yourself with your jurisdiction\'s definition of PHI before contributing.',
        'Evidence Type' : 'Type of clinical outcome associated with the evidence statement.',
        'Evidence Level' : 'Type of study performed to produce the evidence statement',
        'Evidence Direction' : 'An indicator of whether the evidence statement supports or refutes the clinical significance of an event. For predisposing and oncogenic evidence, directionality is only applied at the assertion level and N/A should be selected here.',
        'Clinical Significance' : 'The impact of the variant for predictive, prognostic, diagnostic, or functional evidence types. For predisposing and oncogenic evidence, impact is only applied at the assertion level and N/A should be selected here.',
        'Drug Names' : 'For predictive evidence, specify one or more drug names. If the type-ahead list does not display your drug\'s name or alias, it likely does not exist in CIViC\'s database. You may click the button adjacent to the input box to show the Add Drug form and add a new drug to the database.',
        'Drug Interaction Type' : 'Please indicate whether the drugs specified above are substitutes, or are used in sequential or combination treatments.',
        'Phenotypes' : 'Please provide any <a href="https://hpo.jax.org/app/browse/term/HP:0000118" target="_blank">HPO phenotypes.</a>',
        'Rating' : 'Please rate your evidence on a scale of one to five stars. Use the star rating descriptions for guidance.',
        'Source Type': 'CIViC accepts PubMed or ASCO Abstracts sources. Please indicate the source of the support for your evidence here.',
        'SourceASCO': 'Please enter an ASCO Web ID to specify your source. NOTE: The ASCO Web ID is not the ASCO abstract number. The ASCO Web ID can be found in the URL of the abstract, e.g. 160900 is the ASCO Web ID for Tyler Stewart, 2018, ASCO Annual Meeting, Abstract 9056 (https://meetinglibrary.asco.org/record/160900/abstract).',
        'SourcePubMed': 'Please enter the PubMed ID for your source.',
        'Revision Description' : 'Please provide a short description of your edits to this Evidence record.',
        'Additional Comments' : 'Please provide any additional comments you wish to make about this evidence item. This comment will appear as the first comment in this item\'s comment thread.',
        'keepSourceStatus' : 'Check this box if you wish the originating source suggestion to keep its un-curated status. Otherwise, it will be marked as curated and removed from the source suggestion queues.',
        'suggestionComment' : 'Please provide any additional comments you wish to make about this source. This comment will aid curators when evaluating your suggested source for inclusion.'
      },
      assertionAttributeDescriptions: {
        ampLevels: {
          // 'Tier I - Level A', 'Tier I - Level B', 'Tier II - Level C', 'Tier II - Level D', 'Tier III', 'Tier IV', 'Not Applicable'
          'Tier I - Level A': 'Biomarkers showing therapeutic response to FDA-approved therapy, or therapy included in professional guidelines',
          'Tier I - Level B': 'Biomarkers showing therapeutic response based on well-powered studies with consensus from experts in the field',
          'Tier II - Level C': 'FDA-approved therapies for different tumor types or investigational therapies, or multiple small published studies with some consensus',
          'Tier II - Level D': 'Biomarkers that show plausible therapeutic significance based on preclinical studies',
          'Tier III': 'Somatic variants in cancer genes reported in the same or different cancer types with unknown clinical significance and variants in cancer genes that have not been reported in any cancers',
          'Tier IV': 'Benign or likely benign germline variants observed at significant allele frequencies in the general population or specific subpopulation',
          'Not Applicable': 'AMP/ASCO/CAP category is not relevant to this assertion.'
        },
        nccnGuidelines: [
          'Acute Lymphoblastic Leukemia',
          'Acute Myeloid Leukemia',
          'Anal Carcinoma',
          'Bladder Cancer',
          'Bone Cancer',
          'Breast Cancer',
          'Central Nervous System Cancers',
          'Cervical Cancer',
          'Chronic Lymphocytic Leukemia/Small Lymphocytic Lymphoma',
          'Chronic Myeloid Leukemia',
          'Colon/Rectal Cancer',
          'Colon Cancer',
          'Rectal Cancer',
          'Esophageal and Esophagogastric Junction Cancers',
          'Gastric Cancer',
          'Hairy Cell Leukemia',
          'Head and Neck Cancers',
          'Hepatobiliary Cancers',
          'Hodgkin Lymphoma',
          'Kidney Cancer',
          'Malignant Pleural Mesothelioma',
          'Melanoma',
          'Multiple Myeloma/Other Plasma Cell Neoplasms',
          'Multiple Myeloma',
          'Systemic Light Chain Amyloidosis',
          'Waldenström\'s Macroglobulinemia / Lymphoplasmacytic Lymphoma',
          'Myelodysplastic Syndromes',
          'Myeloproliferative Neoplasms',
          'Neuroendocrine Tumors',
          'Non-Hodgkin\'s Lymphomas',
          'B-Cell Lymphomas',
          'Primary Cutaneous B-Cell Lymphomas',
          'T-Cell Lymphomas',
          'Non-Melanoma Skin Cancers',
          'Basal Cell Skin Cancer',
          'Dermatofibrosarcoma Protuberans',
          'Merkel Cell Carcinoma',
          'Squamous Cell Skin Cancer',
          'Non-Small Cell Lung Cancer',
          'Occult Primary',
          'Ovarian Cancer',
          'Pancreatic Adenocarcinoma',
          'Penile Cancer',
          'Prostate Cancer',
          'Small Cell Lung Cancer',
          'Soft Tissue Sarcoma',
          'Testicular Cancer',
          'Thymomas and Thymic Carcinomas',
          'Thyroid Carcinoma',
          'Uterine Neoplasms',
          'Vulvar Cancer',
        ]
      }
    }
             );
})();
