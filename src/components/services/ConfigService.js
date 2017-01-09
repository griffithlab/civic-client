(function() {
  'use strict';
  angular.module('civic.services')
    .constant('ConfigService', {
      serverUrl: 'http://127.0.0.1:3000/',
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
          state: 'help.introduction'
        },
        {
          label: 'FAQ',
          state: 'faq'
        }
      ],
      footerMenuItems: [
        {
          label: 'Glossary of Terms',
          state: 'glossary'
        },
        {
          label: 'API Documentation',
          url: 'https://genome.github.io/civic-api-docs/'
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
          label: 'Contact',
          state: 'contact'
        }
      ],
      evidenceAttributeDescriptions: {
        variant_origin: {
          'Somatic Mutation': 'Variant is a mutation, found only in tumor cells, having arisen in a specific tissue (non-germ cell), and is not expected to be inherited or passed to offspring.',
          'Germline Mutation': 'Variant is a mutation, found in every cell, not restricted to tumor/diseased cells, is expected to have arisen de novo in the germ cells responsible for the current generation or only very recent generations (e.g., close family members), and is not thought to exist in the population at large.',
          'Germline Polymorphism': 'Variant is found in every cell, not restricted to tumor/diseased cells, and thought to represent common (or relatively rare) variation in the population at large.',
          'Unknown': 'The variant origin is uncertain based on the available evidence.',
          'N/A': 'The variant type (e.g., expression) is not compatible (or easily classified) with the CIViC concepts of variant origin.'
        },
        evidence_type: {
          'Predictive': 'Evidence pertains to a variant\'s effect on therapeutic response',
          'Diagnostic': 'Evidence pertains to a variant\'s impact on patient diagnosis (cancer subtype)',
          'Prognostic': 'Evidence pertains to a variant\'s impact on disease progression, severity, or patient survival',
          'Predisposing': 'Evidence pertains to a variant\'s role in conferring susceptibility to a disease'
        },
        evidence_level: {
          A: 'Proven/consensus association in human medicine',
          B: 'Clinical trial or other primary patient data supports association',
          C: 'Individual case reports from clinical journals',
          D: 'In vivo or in vitro models support association',
          E: 'Indirect evidence'
        },
        evidence_direction:{
          'Predictive': {
            'Supports': 'The experiment or study supports this variant\'s response to a drug',
            'Does Not Support': 'The experiment or study does not support, or was inconclusive of an interaction between the variant and a drug'
          },
          'Diagnostic': {
            'Supports': 'The experiment or study supports variant\'s impact on the diagnosis of disease or subtype',
            'Does Not Support': 'The experiment or study does not support the variant\'s impact on diagnosis of disease or subtype'
          },
          'Prognostic': {
            'Supports': 'The experiment or study supports a variant\'s impact on prognostic outcome',
            'Does Not Support': 'The experiment or study does not support a prognostic association between variant and outcome'
          }
        },
        clinical_significance: {
          'Sensitivity': 'Subject exhibits response to drug treatment',
          'Resistance or Non-Response': 'Subject exhibits a lack of response or active resistance to drug treatment',
          'Better Outcome': 'Demonstrates better than expected clinical outcome',
          'Poor Outcome': 'Demonstrates worse than expected clinical outcome',
          'Positive': 'Associated with diagnosis of disease or subtype',
          'Negative': 'Associated with lack of disease or subtype',
          'Adverse Response': 'Subject exhibits an adverse response to drug treatment',
          'Pathogenic': '',
          'Likely Pathogenic': '',
          'Benign': '',
          'Likely Benign': '',
          'Uncertain Significance': '',
          'N/A': 'Not applicable'
        },
        drug_interaction_type: {
          'Combination': 'The drugs listed were used in as part of a combination therapy approach',
          'Sequential': 'The drugs listed were used at separate timepoints in the same treatment plan',
          'Substitutes': 'The drugs listed are often considered to be of the same family, or behave similarly in a treatment setting'
        },
        rating: {
          1: 'Poor -  Claim is not supported well by experimental evidence. Results are not reproducible, or have very small sample size. No follow-up is done to validate novel claims.',
          2: 'Adequate - Evidence is not well supported by experimental data, and little follow-up data is available. Publication is from a journal with low academic impact. Experiments may lack proper controls, have small sample size, or are not statistically convincing.',
          3: 'Average - Evidence is convincing, but not supported by a breadth of experiments. May be smaller scale projects, or novel results without many follow-up experiments. Discrepancies from expected results are explained and not concerning.',
          4: 'Strong - Well supported evidence. Experiments are well controlled, and results are convincing. Any discrepancies from expected results are well-explained and not concerning.',
          5: 'Excellent - Solid, well supported evidence from a lab or journal with respected academic standing. Experiments are well controlled, and results are clean and reproducible across multiple replicates. Evidence confirmed using separate methods.'
        }
      }
    }
  );
})();

