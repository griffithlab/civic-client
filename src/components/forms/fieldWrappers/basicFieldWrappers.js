(function() {
  'use strict';
  angular.module('civic.config')
    .config(formlyWrappersConfig);

  // @ngInject
  function formlyWrappersConfig(formlyConfigProvider, formConfig) {
    var inputColWidth = formConfig.options.inputColWidth;
    var labelColWidth = formConfig.options.labelColWidth;
    var helpColWidth = formConfig.options.helpColWidth;

    /*
     * ERROR MSG WRAPPERS
     */

    formlyConfigProvider.setWrapper({
      name: 'validationMessages',
      template: [
        '<formly-transclude></formly-transclude>',
        '<div class="validation"',
        'ng-if="options.validation.errorExistsAndShouldBeVisible"',
        'ng-messages="options.formControl.$error">',
        '<div class="field-message-error" ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
        '{{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}',
        '</div>',
        '</div>'
      ].join(' ')
    });

    /*
     * FIELD WRAPPERS
     */
    // TODO: get all template strings into their own files while preserving the ability to define col widths etc.
    formlyConfigProvider.setWrapper({
      // horizontal bootstrap row with label
      name: 'horizontalBootstrapLabel',
      template: [
        '<label for="{{::id}}" class="col-sm-'+ labelColWidth +' control-label">',
        '{{to.label}}',
        '</label>',
        '<div class="col-sm-' + inputColWidth + '">',
        '<formly-transclude></formly-transclude>',
        '</div>'
      ].join(' ')
    });

    // horizontal bootstrap field with label and help column
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapHelp',
      template: [
        '<label for="{{::id}}" class="col-sm-'+ labelColWidth +' control-label">',
        '{{to.label}}',
        '</label>',
        '<div class="col-sm-'+ inputColWidth +'">',
        '<formly-transclude></formly-transclude>',
        //'<p class="small">errors:</p>',
        //'<div ng-messages-include="commentValidation.tpl.html"></div>',
        '</div>',
        '<div class="col-sm-'+ helpColWidth +' control-help">',
        '<span class="small" ng-bind-html="to.helpText"></span>',
        '</div>'
      ].join(' ')
    });

    // horizontal bootstrap checkbox
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapCheckbox',
      template: [
        '<div class="col-sm-offset-'+ labelColWidth +' col-sm-8">',
        '<formly-transclude></formly-transclude>',
        '</div>'
      ].join(' ')
    });

    // horizontal bootstrap with current user (intended for comment forms)
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapComment',
      template: [
        '<label for="{{::id}}" class="col-sm-1 control-label">',
        '<user-image user="to.currentUser" height="32" width="32"></user-image>',
        '</label>',
        '<div class="col-sm-11">',
        '<formly-transclude></formly-transclude>',
        '</div>'
      ].join(' ')
    });

    // displays loading animation inside input
    formlyConfigProvider.setWrapper({
      name: 'loader',
      template: [
        '<formly-transclude></formly-transclude>',
        '<span class="glyphicon glyphicon-refresh loader" ng-show="to.loading"></span>'
      ].join(' ')
    });

    formlyConfigProvider.setWrapper({
      name: 'pubdisplay',
      template: [
        '<formly-transclude></formly-transclude>',
        '<span class="small">Citation: {{ to.data.description }}</span>'
      ].join(' ')
    });
  }
})();
