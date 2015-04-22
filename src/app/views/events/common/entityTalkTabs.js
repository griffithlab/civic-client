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
  .directive('entityTalkTabs', entityTalkTabsDirective)
  .controller('EntityTalkTabsController', EntityTalkTabsController);

// @ngInject
function entityTalkTabsDirective($rootScope) {
  return /* @ngInject */ {
    restrict: 'E',
    scope: {
      entityTalkModel: '=',
      type: '@',
      justified: '@',
      vertical: '@'
    },
    link: function entityTalkTabsLink(scope, element, attributes) {
      var unbindStateChangeSuccess = $rootScope.$on(
        '$stateChangeSuccess',
        function() {
          scope.update_tabs();
        }
      );
      scope.$on('$destroy', unbindStateChangeSuccess);
    },
    controller: 'EntityTalkTabsController',
    templateUrl: 'app/views/events/common/entityTalkTabs.tpl.html'
  }
}

// @ngInject
function EntityTalkTabsController($scope, $state) {
  var ctrl = $scope.ctrl = {};

  var config = $scope.entityTalkModel.config;

  ctrl.type = config.type;
  ctrl.name = config.name;

  ctrl.showCorner = config.type === 'variant';

  ctrl.tabRowBackground = config.styles.tabs.tabRowBackground;
  ctrl.viewBackground = 'view-' + config.styles.view.backgroundColor;

  $scope.tabs = $scope.entityTalkModel.config.tabData;
  if (!$scope.tabs) {
    throw new Error('entityTalkTabs: \'data\' attribute not defined, please check documentation for how to use this directive.');
  }

  if (!angular.isArray($scope.tabs)) {
    throw new Error('entityTalkTabs: \'data\' attribute must be an array of tab data with at least one tab defined.');
  }

  var currentStateEqualTo = function(tab) {

    var isEqual = $state.is(tab.route, tab.params, tab.options);
    return isEqual;
  };

  $scope.go = function(tab) {

    if (!currentStateEqualTo(tab) && !tab.disabled) {
      var promise = $state.go(tab.route, tab.params, tab.options);

      /* until the $stateChangeCancel event is released in ui-router, will use this to update
       tabs if the $stateChangeEvent is cancelled before it finishes loading the state, see
       https://github.com/rpocklin/ui-router-tabs/issues/19 and
       https://github.com/angular-ui/ui-router/pull/1090 for further information and
       https://github.com/angular-ui/ui-router/pull/1844

       $stateChangeCancel is better since it will handle ui-sref and external $state.go(..) calls */
      promise.catch(function() {
        $scope.update_tabs();
      });
    }
  };

  /* whether to highlight given route as part of the current state */
  $scope.active = function(tab) {

    var isAncestorOfCurrentRoute = $state.includes(tab.route, tab.params, tab.options);
    return isAncestorOfCurrentRoute;
  };

  $scope.update_tabs = function() {

    // sets which tab is active (used for highlighting)
    angular.forEach($scope.tabs, function(tab) {
      tab.params = tab.params || {};
      tab.options = tab.options || {};
      tab.active = $scope.active(tab);
    });
  };

  // this always selects the first tab currently - fixed in ui-bootstrap master but not yet released
  // see https://github.com/angular-ui/bootstrap/commit/91b5fb62eedbb600d6a6abe32376846f327a903d
  $scope.update_tabs();

}
