(function() {
  'use strict';
  angular
    .module('civic.pages')
    .controller('AboutCtrl', AboutCtrl);

// @ngInject
  function AboutCtrl ($scope, $state) {
    var vm = $scope.vm = {};

    vm.experts = [
      {
        'id': 133,
        'name': 'Elaine Mardis',
        'role': 'Curator',
        'avatar_url': 'assets/images/experts/emardis.jpg',
        'area_of_expertise': 'Research Scientist',
        'display_name': 'emardis',
        'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus, odio non cursus maximus, justo elit malesuada libero, non elementum purus nulla vitae ipsum. Morbi in mattis elit.'
      },
      {
        'id': 144,
        'name': 'Ron Bose',
        'role': 'Curator',
        'avatar_url': 'assets/images/experts/rbose.jpg',
        'area_of_expertise': 'Research Scientist',
        'display_name': 'rbose',
        'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus, odio non cursus maximus, justo elit malesuada libero, non elementum purus nulla vitae ipsum. Morbi in mattis elit.'
      },
      {
        'id': 15,
        'name': 'Malachi Griffith',
        'username': 'malachigriffith',
        'role': 'Curator',
        'avatar_url': 'assets/images/experts/mgriffith.jpg',
        'area_of_expertise': 'Research Scientist',
        'display_name': 'malachigriffith',
        'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus, odio non cursus maximus, justo elit malesuada libero, non elementum purus nulla vitae ipsum. Morbi in mattis elit.'
      },
      {
        'id': 6,
        'name': 'Kilannin Krysiak',
        'role': 'Curator',
        'avatar_url': 'assets/images/experts/kkrysiak.jpg',
        'area_of_expertise': 'Research Scientist',
        'display_name': 'kkrysiak',
        'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus, odio non cursus maximus, justo elit malesuada libero, non elementum purus nulla vitae ipsum. Morbi in mattis elit.'
      },
      {
        'id': 41,
        'name': 'Nick Spies',
        'role': 'Curator',
        'avatar_url': 'assets/images/experts/nspies.jpg',
        'area_of_expertise': 'Research Scientist',
        'display_name': 'nickspies',
        'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus, odio non cursus maximus, justo elit malesuada libero, non elementum purus nulla vitae ipsum. Morbi in mattis elit.'
      },
      {
        'id': 3,
        'name': 'Obi Griffith',
        'role': 'Curator',
        'avatar_url': 'assets/images/experts/ogriffith.jpg',
        'area_of_expertise': 'Research Scientist',
        'display_name': 'ogriffith',
        'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus, odio non cursus maximus, justo elit malesuada libero, non elementum purus nulla vitae ipsum. Morbi in mattis elit.'
      }
    ];
  }
})();
