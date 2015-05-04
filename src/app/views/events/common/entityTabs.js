(function() {
  'use strict';


  /**
   * Permits declarative (and dynamic) definitions of tab links with full routes.
   *
   * requires 'ui.router' and 'ui.bootstrap'
   * (uses tabset and tab directives in ui.bootstrap and route changes in ui.router)
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
    }
  }

  // @ngInject
  function entityTabsLink(scope, element, attributes, entityView) {
    var entityViewModel = scope.entityViewModel = entityView.entityViewModel;
    var entityViewOptions = scope.entityViewOptions = entityView.entityViewOptions;

    scope.type = entityViewModel.data.item.type;
    scope.name = entityViewModel.data.item.name;
    scope.showCorner = (scope.type === 'variant' || scope.type === 'variant group');
    scope.viewBackground = 'view-' + entityViewOptions.styles.view.backgroundColor;
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
  function EntityTabsController($scope, $state) {
    // TODO not sure why this watch is necessary for tabs to be properly set to active on 1st load
    var unwatch = $scope.$watchCollection('entityViewModel', function(vm) {
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
        if (_.contains(tab.route, 'talk')) {
          // drop the last route element so all talk ancestor $state.includes() evaluates to true
          route = _.chain(tab.route.split('.')).dropRight().value().join('.');
        }
        var isAncestorOfCurrentRoute = $state.includes(route, tab.params, tab.options);
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
