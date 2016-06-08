(function() {
  'use strict';
  angular
    .module('civic.pages')
    .controller('AboutCtrl', AboutCtrl);

// @ngInject
  function AboutCtrl ($scope, $state, $location, $document) {
    var vm = $scope.vm = {};

    if(!_.isEmpty($location.hash())) {
      var elem = document.getElementById($location.hash());
      $document.scrollToElementAnimated(elem);
    }

    $scope.scroll = function() {
      var loc = $location.hash();
      if(!_.isEmpty(loc) &&
        _.kebabCase(vm.type) === loc &&
        $rootScope.prevScroll !== loc) {// if view has already been scrolled, ignore subsequent requests
        var elem = document.getElementById(loc);
        $rootScope.prevScroll = $location.hash();
        $document.scrollToElementAnimated(elem);
      }
    };

    vm.experts = [
      {
        'id': 133,
        'name': 'Elaine Mardis',
        'role': 'Editor',
        'area_of_expertise': 'Research Scientist',
        'avatars': {
          'x14': 'assets/images/experts/emardis.jpg',
          'x270': 'assets/images/experts/emardis.jpg'
        },
        'display_name': 'emardis',
        'description': 'Dr. Mardis is the Robert E. and Louise F. Dunn Distinguished Professor of Medicine and Co-director of the McDonnell Genome Institute at Washington University School of Medicine. She is the Editor-In-Chief of Molecular Case Studies and also serves as an editorial board member of <em>Molecular Cancer Research</em>, <em>Disease Models and Mechanisms</em>, and <em>Annals of Oncology</em>. She helped create methods and automation pipelines for sequencing the human genome and was one of the team leaders to first sequence and analyze a whole cancer genome using next-generation sequencing methods. Her studies of cancer genomes have led to characterization of multiple tumor types including pediatric and adult disease as well as the understanding of acquired resistance to targeted therapies. These studies have led to development of methods to identify and characterize changes in genomic heterogeneity and design novel, personalized vaccines for individual patients.'
      },
      {
        'id': 141,
        'name': 'Ron Bose',
        'role': 'Editor',
        'avatars': {
          'x14': 'assets/images/experts/rbose.jpg',
          'x270': 'assets/images/experts/rbose.jpg'
        },
        'area_of_expertise': 'Clinical Scientist',
        'display_name': 'rbose',
        'description': 'Dr. Bose is Assistant Professor of Medicine with board certifications in medical oncology and internal medicine at Washington University School of Medicine. His lab studies how dysregulation of signal transduction pathways impacts the development of human cancers. In particular his focus is on the HER2 receptor tyrosine kinase, a member of the EGFR growth factor receptor family, a gene amplified and activated in about 20% of human breast cancer cases. His lab discovered that HER2 activating mutations can be found in many solid tumors, including breast cancer.'
      },
      {
        'id': 15,
        'name': 'Malachi Griffith',
        'username': 'malachigriffith',
        'role': 'Admin',
        'avatars': {
          'x14': 'assets/images/experts/mgriffith.jpg',
          'x270': 'assets/images/experts/mgriffith.jpg',
        },
        'area_of_expertise': 'Research Scientist',
        'display_name': 'malachigriffith',
        'description': 'Dr. Griffith is an Assistant Professor of Genetics and Assistant Director of the McDonnell Genome Institute at Washington University School of Medicine. Dr Griffith has extensive experience in the fields of genomics, bioinformatics, data mining, and cancer research. His research is focused on improving the understanding of cancer biology and the development of personalized medicine strategies for cancer using genomics and informatics technologies. The Griffith lab develops bioinformatics and statistical methods for the analysis of high throughput sequence data and identification of biomarkers for diagnostic, prognostic and drug response prediction. In collaboration with the Washington University Genomics Tumor Board, he is currently leading analyses of sequence data from the genomes and transcriptomes of living cancer patients that have exhausted standard-of-care treatment options. Dr Griffith is also leading the analysis of several large-scale genomics projects to help discover genomic signatures relevant to cancer initiation, progression, and treatment response.  He is a co-creator of the CIViC resource.'
      },
      {
        'id': 3,
        'name': 'Obi Griffith',
        'role': 'Admin',
        'avatars': {
          'x14': 'assets/images/experts/ogriffith.jpg',
          'x270': 'assets/images/experts/ogriffith.jpg'
        },
        'area_of_expertise': 'Research Scientist',
        'display_name': 'obigriffith',
        'description': 'Dr. Griffith is Assistant Professor of Medicine and Assistant Director of the McDonnell Genome Institute at Washington University School of Medicine. He has worked in genomics and bioinformatics since the earliest phase of reference genome sequencing. He contributed to the Mammalian Gene Collection, producing some of the first full-length sequences for many human genes. He also was part of a small team of bioinformaticians that helped sequence and release the first whole genome reference sequence for the severe acute respiratory syndrome (SARS) virus at the height of the 2003 epidemic. He has contributed to the identification of molecular markers at the DNA, RNA and protein level that are useful for diagnosis and prognosis of thyroid, breast, liver and other cancers. His lab’s research is focused on the development of informatics resources and personalized medicine strategies for cancer using genomic technologies. He is a co-creator of the CIViC resource.'
      },
      {
        'id': 6,
        'name': 'Kilannin Krysiak',
        'role': 'Admin',
        'avatars': {
          'x14': 'assets/images/experts/kkrysiak.jpg',
          'x270': 'assets/images/experts/kkrysiak.jpg'
        },
        'area_of_expertise': 'Research Scientist',
        'display_name': 'kkrysiak',
        'description': 'Dr. Krysiak is a staff scientist at the McDonnell Genome Institute at Washington University School of Medicine where she is involved in the comprehensive genomic analysis of cancer patient cohorts and “n-of-1” studies. She received her PhD in Molecular Genetics and Genomics at Washington University in St. Louis where she focused on the genetics of myelodysplastic syndrome through advanced flow cytometry techniques, primary cell culture and mouse models. She is a founding member of the CIViC team, helping to define the CIViC data model, and a leading content curator and feature development consultant.'
      },
      {
        'id': 41,
        'name': 'Nick Spies',
        'role': 'Admin',
        'avatars': {
          'x14': 'assets/images/experts/nspies.jpg',
          'x270': 'assets/images/experts/nspies.jpg'
        },
        'area_of_expertise': 'Research Scientist',
        'display_name': 'nickspies',
        'description': 'Nick Spies is a staff analyst at the McDonnell Genome Institute and an MD student at Washington University School of Medicine. He has made substantial contributions to the development of genome analysis tools and resources at the Genome Institute including the Drug-Gene Interaction Database. He is a founding member of the CIViC team, helping to define the CIViC data model, and a leading content curator and a feature development consultant.'
      }
    ];
    vm.partners = [
      {
        'id': 0,
        'name': 'Personalized Oncogenomics at BC Cancer Agency',
        'avatars': {
          'x14': 'assets/images/partners/bc_cancer_agency.png',
          'x270': 'assets/images/partners/bc_cancer_agency.png'
        },
        'description': 'The BC Cancer Agency\'s Personalized Onco-Genomics (POG) program is a clinical research initiative that is embedding genomic sequencing into real-time treatment planning for BC patients with incurable cancers. Cancer is a complex biological process. We categorize cancers according to their site of origin (e.g. lung, breast, liver, colon) as each one is different, but even within these groupings there are subtypes with differences in response to treatment and overall behaviour. The POG program is a collaborative research study including many BCCA oncologists, pathologists and other clinicians along with the Genome Sciences Centre (GSC), which aims to decode the genome – the entire DNA and RNA inside the cell – of each patient\'s cancer, to understand what is enabling it to grow. Using this genomic data in clinical decision-making should allow us to develop treatment strategies to block its growth, identify clinical trials that the patient may benefit from and potentially identify less toxic and more effective therapeutic options.'
      }
    ];
  }
})();
