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
      }
    ];
  }
})();
