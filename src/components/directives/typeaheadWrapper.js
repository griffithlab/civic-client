(function() {
  'use strict';
  angular.module('civic.events')
    .directive('typeaheadWrapper', typeaheadWrapper);

  // @ngInject
  function typeaheadWrapper($compile, _) {
    var directive = {
      restrict: 'A',
      scope: false, //bypassing the scope isolation
      // templateUrl: 'typeahead.tpl.html',
      link: function(scope, elem, attrs)
      {
        var template = '<input ';
        template+='type="'+attrs['type']+'" ';
        template+='placeholder="{{ to.placeholder }}"';
        if(attrs['formlyCustomValidation'] !== undefined) { template += 'formlyCustomValidation '; }
        var id = attrs['id'];
        if(id !== undefined) { template+='id="'+id+'" '; }
        var name = attrs['name'];
        if(name !== undefined) { template+='name="'+name+'" '; }
        var required = _.get(scope,'to.required');
        if(required === true) { template+='required="true" '; }
        var disabled = attrs['ngDisabled'];
        if(disabled !== undefined) { template+='ng-disabled="'+disabled+'" '; }
        template+='ng-model="'+attrs['ngModel']+'" ';
        template+='ng-model-options="'+attrs['ngModelOptions']+'" ';
        template+='class="'+attrs['class']+'" ';
        template+='typeahead-editable="'+attrs['typeaheadEditable']+'" ';
        template+='typeahead-focus-first="'+attrs['typeaheadFocusFirst']+'" ';
        template+='typeahead-append-to-body="'+attrs['typeaheadAppendToBody']+'" ';
        var minLength = _.get(scope, attrs['typeaheadMinLength']);
        if(minLength !== undefined) { template+='typeahead-min-length="'+attrs['typeaheadMinLength']+'" '; }
        var onSelect = _.get(scope, attrs['typeaheadOnSelect']);
        if(onSelect !== undefined) { template+='typeahead-on-select="'+onSelect+'" '; }
        var inputFormatter = _.get(scope,attrs['typeaheadInputFormatter']);
        if(inputFormatter !== undefined) { template+='typeahead-input-formatter="'+inputFormatter+'" '; }
        var templateUrl = _.get(scope,attrs['typeaheadTemplateUrl']);
        if(templateUrl !== undefined) { template+='typeahead-template-url="'+templateUrl+'" '; }
        var selectOnBlur = _.get(scope, attrs['to.selectOnBlur']);
        if (selectOnBlur !== undefined) { template+='typeahead-select-on-blur="' + selectOnBlur + '" '; }
        template+='uib-typeahead="'+_.get(scope, attrs['typeaheadWrapper'])+'" ';
        template+='>';
        $compile(template)(
          scope,
          function(replacement){
            elem.replaceWith(replacement);
          }
        );
      }
    };
    return directive;
  }
})();
