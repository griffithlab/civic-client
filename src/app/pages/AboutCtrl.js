(function() {
  'use strict';
  angular
    .module('civic.pages')
    .controller('AboutCtrl', AboutCtrl);

// @ngInject
  function AboutCtrl ($scope,
                      $state,
                      $location,
                      $document,
                      Users) {
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

    vm.setUrl = function(anchor) {
      $location.hash(anchor);
    };

    Users.query({'filter[featured_expert]': true}).then(function(response) {
      vm.experts = _.sortBy(response.result, function(user) {
        return _.last(user.name.split(' ')); // sort by last name
      });
    });

    vm.experts = [];

    vm.partners = [
      {
        'id': 0,
        'name': 'Personalized Oncogenomics at BC Cancer Agency',
        'avatars': {
          'x14': 'assets/images/partners/bc_cancer_agency.png',
          'x270': 'assets/images/partners/bc_cancer_agency.png'
        },
        'description': 'The BC Cancer Agency\'s Personalized Onco-Genomics (POG) program is a clinical research initiative that is embedding genomic sequencing into real-time treatment planning for BC patients with incurable cancers. Cancer is a complex biological process. We categorize cancers according to their site of origin (e.g. lung, breast, liver, colon) as each one is different, but even within these groupings there are subtypes with differences in response to treatment and overall behaviour. The POG program is a collaborative research study including many BCCA oncologists, pathologists and other clinicians along with the Genome Sciences Centre (GSC), which aims to decode the genome – the entire DNA and RNA inside the cell – of each patient\'s cancer, to understand what is enabling it to grow. Using this genomic data in clinical decision-making should allow us to develop treatment strategies to block its growth, identify clinical trials that the patient may benefit from and potentially identify less toxic and more effective therapeutic options.'
      },
      {
        'id': 0,
        'name': 'Cartegenia Bench Lab at Agilent Technologies',
        'avatars': {
          'x14': 'assets/images/partners/agilent.png',
          'x270': 'assets/images/partners/agilent.png'
        },
        'description': 'Cartagenia Bench Lab is designed to help laboratories involved in clinical genetics and molecular pathology efficiently interpret and report on genomic variants. The clinical-grade software platform – registered as an exempt Class I Medical Device in the U.S. – has become the platform of choice for high-throughput diagnostic labs to help them validate and automate their variant assessment and reporting pipelines. With a range of new features for somatic variant classification, review and curation, the release of Cartagenia Bench Lab 5.0 represents a significant leap forward for molecular pathology labs in the ability to process their data. Bench in general provides direct access to more than 100 curated and publicly available databases with information on actionable variants, trials, drugs and therapy options such as CIViC, COSMIC, N-of-One, OncoMD and CollabRx.'
      }
    ];
  }
})();
