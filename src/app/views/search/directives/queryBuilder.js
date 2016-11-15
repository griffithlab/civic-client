(function() {
  'use strict';

  angular.module('civic.search')
    .directive('queryBuilder', queryBuilder)
    .controller('QueryBuilderController', QueryBuilderController);

  // @ngInject
  function queryBuilder() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '=',
        fields: '='
      },
      controller: 'QueryBuilderController',
      templateUrl: 'app/views/search/directives/queryBuilder.tpl.html'
    };

    return directive;
  }

  // @ngInject
  function QueryBuilderController($scope, $state, $stateParams, $log, _, Search) {
    var vm = $scope.vm = {};
    var entity = vm.entity = $scope.entity;

    // function assignment
    vm.onSubmit = onSubmit;
    vm.options = {};
    vm.searchResults = [];
    vm.showGrid = true;

    vm.model = {
      operator: '',
      queries: {}
    };

    init();

    $scope.$watch('vm.model', function() {
      vm.formError = false;
    }, true);

    $scope.$on('setSearch', function(event, search) {
      if (!_.isUndefined(search)) {
        vm.model.operator = search.operator;
        vm.model.queries = search.queries;
        onSubmit();
      }
    });

    // function definition
    function onSubmit() {
      $log.debug(angular.toJson(vm.model));
      //vm.searchResults = Search.post(vm.model);
      //vm.showEvidenceGrid = true;
      vm.model.entity = entity;
      vm.model.save = true;
      vm.formError = false;
      Search.post(vm.model)
        .then(function(response) { // success
          vm.searchResults = response.results;
          vm.showGrid = true;
          if(_.has(response, 'token') && !_.isNull(response.token)) {
            var state = entity === 'evidence_items' ? 'search.evidence' : 'search.' + entity;
            $state.transitionTo(state, { token: response.token }, {notify: false});
          }
        },
        function(response) { // error
          angular.copy([], vm.searchResults);
          vm.showGrid = true;
          vm.formError = response;
        });
    }

    vm.buttonLabel = 'Search';

    function init() {
      if (_.has($stateParams, 'token') && !_.isEmpty($stateParams.token)) {
        Search.get({entity: entity, token: $stateParams.token})
          .then(function (response) {
            vm.model.operator = response.params.operator;
            vm.model.queries = response.params.queries;
            vm.searchResults = response.results;
            vm.showGrid = true;
          });
      } else {
        Search.reset();
        vm.model = {
          operator: 'AND',
          queries: [
            {
              field: '',
              condition: {
                name: undefined,
                parameters: []
              }
            }
          ]
        };
      }
    }
    vm.operatorField = [
      {
        key: 'operator',
        type: 'queryBuilderSelect',
        data: {
          defaultValue: 'AND'
        },
        templateOptions: {
          label: '',
          options: [
            { value: 'AND', name: 'all' },
            { value: 'OR', name: 'any' }
          ]
        }
      }
    ];

    vm.fields = $scope.fields;
  }
})();
