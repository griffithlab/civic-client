(function() {
  'use strict';


  /**
   * Permits declarative (and dynamic) definitions of tab links with full routes.
   *
   * requires 'ui.router' and 'ui.bootstrap'
   * (uses ui-tabset and tab directives in ui.bootstrap and route changes in ui.router)
   *
   * You can define (for styling) the attributes type="pills" and vertical="true | false" and justified="true | false"
   *
   * Watches the $stateChangeXX events so it can update the parent tab(s) when using $state.go or ui-sref anchors.
   *
   * See ui-router-tabs.spec.js for tests.
   *
   * Author: Robert Pocklington (rpocklin@gmail.com)
   * License: MIT
   *
   */

  angular.module('civic.events.common')
    .directive('entityTabs', entityTabsDirective)
    .controller('EntityTabsController', EntityTabsController);

// @ngInject
  function entityTabsDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        justified: '=',
        vertical: '='
      },
      require: '^^entityView',
      link: entityTabsLink,
      controller: 'EntityTabsController',
      templateUrl: 'app/views/events/common/entityTabs.tpl.html'
    };
  }

  function entityTabsLink(scope, element, attributes, entityView) {
    var _ = window._;
    var vm = scope.vm; // todo convert the rest of this controller to vm
    var entityViewModel = scope.entityViewModel = entityView.entityViewModel;
    var entityViewRevisions = scope.entityViewRevisions = entityView.entityViewRevisions;
    var entityViewOptions = scope.entityViewOptions = entityView.entityViewOptions;

    element.ready(function() {
      scope.scroll();
    });

    vm.type = '';
    vm.name = '';

    vm.type = _.map(entityViewModel.data.item.type.replace('_', ' ').split(' '), function(word) {
      return word.toUpperCase();
    }).join(' ');

    vm.actions = {};
    vm.actions = entityViewModel.data.item.lifecycle_actions;

    var fetchPending = function(){
      entityViewRevisions.getPendingFields(entityViewModel.data.item.id)
      .then(function(fields) {
        vm.pendingFields = _.keys(entityViewRevisions.data.pendingFields);
        vm.hasPendingFields = fields.length > 0;
      });
    };

    fetchPending();

    scope.$on('revisionDecision', function(event, args){
      fetchPending();
    });

    vm.anchorId = _.kebabCase(vm.type);

    scope.$watch('entityViewModel.data.item.name', function(name) {
      vm.name = name;
    });

    scope.$watchCollection('entityViewModel.data.item.lifecycle_actions', function(lifecycle_actions) {
      vm.actions = lifecycle_actions;
    });

    scope.viewBackground = 'view-' + entityViewOptions.styles.view.backgroundColor;
    scope.viewForeground = 'view-' + entityViewOptions.styles.view.foregroundColor;
    scope.tabs = entityViewOptions.tabData;

    if (!scope.tabs) {
      throw new Error('entityTabs: \'data\' attribute not defined, please check documentation for how to use this directive.');
    }

    if (!angular.isArray(scope.tabs)) {
      throw new Error('entityTabs: \'data\' attribute must be an array of tab data with at least one tab defined.');
    }

    var unbindStateChangeSuccess = scope.$on(
      '$stateChangeSuccess',
      function () {
        scope.update_tabs();
      }
    );
    scope.$on('$destroy', unbindStateChangeSuccess);
  }

  // @ngInject
  function EntityTabsController($scope,
                                $state,
                                $rootScope,
                                $stateParams,
                                $location,
                                $document,
                                Security,
                                Subscriptions,
                                _) {
    var vm = $scope.vm = {};
    vm.isAuthenticated = Security.isAuthenticated;
    vm.isEditor = Security.isEditor;
    vm.isAdmin = Security.isAdmin;
    vm.subscribed = null;
    vm.hasSubscription = false;

    vm.toggleSubscription = function(subscription) {
      console.log('toggling subscription: ');
      if(_.isObject(subscription)) {
        console.log('has subscription, unsubscribing.');
        Subscriptions.unsubscribe(subscription.id)
          .then(function(response) { console.log('unsubscribe successful.');});
      } else {
        console.log('does not have subscription, subscribing');
        var subscribableType = _.startCase(_.camelCase($scope.entityViewModel.data.item.type));
        Subscriptions.subscribe({subscribable_type: subscribableType, subscribable_id: $scope.entityViewModel.data.item.id})
          .then(function(response) {console.log('subscription successful.');});
      }
    };
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

    // set subscription flag
    $scope.$watchCollection(function() {return Subscriptions.data.collection; }, function(subscriptions) {
      console.log('$watch subscriptions called.');
      var subscribableType = _.startCase(_.camelCase($scope.entityViewModel.data.item.type));
      if(subscribableType === 'Evidence') {subscribableType = 'EvidenceItem';}
      if(subscribableType === 'Variant Group') {subscribableType = 'VariantGroup';}
      var paramType = $scope.entityViewModel.data.item.type;
      if(paramType === 'evidence') {paramType = 'evidence_item';}
      var entityId = $scope.entityViewModel.data.item.id;
      $scope.vm.subscription = _.find(subscriptions, function(sub) {
        return sub.subscribable.type === subscribableType && sub.subscribable.state_params[paramType].id === entityId;
      });
      $scope.vm.hasSubscription = _.isObject($scope.vm.subscription);
    });

    // store latest stateParams on rootscope, primarily so the Add Evidence button can
    // include gene and variantIds in the URL
    $rootScope.stateParams = $stateParams;

    // TODO not sure why this watch is necessary for tabs to be properly set to active on 1st load
    var unwatch = $scope.$watchCollection('entityViewModel', function(viewModel) {
      var currentStateEqualTo = function (tab) {
        var isEqual = $state.is(tab.route, tab.params, tab.options);
        return isEqual;
      };

      $scope.go = function (tab) {

        if (!currentStateEqualTo(tab) && !tab.disabled) {
          var promise = $state.go(tab.route, tab.params, tab.options);

          /* until the $stateChangeCancel event is released in ui-router, will use this to update
           tabs if the $stateChangeEvent is cancelled before it finishes loading the state, see
           https://github.com/rpocklin/ui-router-tabs/issues/19 and
           https://github.com/angular-ui/ui-router/pull/1090 for further information and
           https://github.com/angular-ui/ui-router/pull/1844

           $stateChangeCancel is better since it will handle ui-sref and external $state.go(..) calls */
          promise.catch(function () {
            $scope.update_tabs();
          });
        }
      };

      /* whether to highlight given route as part of the current state */
      $scope.active = function (tab) {
        var route = tab.route;
        // TODO: this is a kludge to fix misbehaving sub-tabs that we have in talk views, almost certainly not the most elegant solution.
        if (_.includes(tab.route, 'talk')) {
          // drop the last route element so all talk ancestor $state.includes() evaluates to true
          //lodash change
          route = _(tab.route.split('.')).dropRightWhile(function(r) { return r !== 'talk'; }).value().join('.');
        }
        var isAncestorOfCurrentRoute = $state.includes(route, _.omit(tab.params, '#'), tab.options);
        return isAncestorOfCurrentRoute;
      };

      $scope.update_tabs = function () {

        // sets which tab is active (used for highlighting)
        angular.forEach($scope.tabs, function (tab) {
          tab.params = tab.params || {};
          tab.options = tab.options || {};
          tab.active = $scope.active(tab);
        });
      };

      // this always selects the first tab currently - fixed in ui-bootstrap master but not yet released
      // see https://github.com/angular-ui/bootstrap/commit/91b5fb62eedbb600d6a6abe32376846f327a903d
      $scope.update_tabs();
      unwatch();
    });
  }
})();
