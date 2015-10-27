(function() {
  'use strict';
  angular.module('civic.add')
    .config(AddVariantGroupConfig)
    .factory('AddVariantGroupViewOptions', AddVariantGroupViewOptions)
    .controller('AddVariantGroupController', AddVariantGroupController);

  // @ngInject
  function AddVariantGroupConfig($stateProvider) {
    $stateProvider
      .state('add.variantGroup', {
        url: '/variantGroup',
        templateUrl: 'app/views/add/variantGroup/AddVariantGroup.tpl.html',
        resolve: {
          Evidence: 'VariantGroups'
        },
        controller: 'AddVariantGroupController',
        controllerAs: 'vm',
        data: {
          title: 'Add Variant Group',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function AddVariantGroupViewOptions($state, $stateParams) {
    var state = {
      baseParams: {},
      baseState: '',
      baseUrl: ''
    };
    var styles = {};

    function init() {
      angular.copy($stateParams, this.state.baseParams);
      this.state.baseState = 'add.variantGroup';
      this.state.baseUrl = $state.href(this.state.baseState, $stateParams);

      angular.copy({
        view: {
          backgroundColor: 'pageBackground'
        }
      }, this.styles);
    }

    return {
      init: init,
      state: state,
      styles: styles
    };
  }

  // @ngInject
  function AddVariantGroupController(Evidence, AddVariantGroupViewOptions) {
    AddVariantGroupViewOptions.init();
    this.type = 'VARIANT GROUP';
    // can get references to the view model and view options
    this.AddVariantGroupViewModel = Evidence;
    this.AddVariantGroupViewOptions = AddVariantGroupViewOptions;
  }

})();
