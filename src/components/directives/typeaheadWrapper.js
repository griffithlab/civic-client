(function() {
  'use strict';
  angular.module('civic.events')
    .directive('typeaheadWrapper', typeaheadWrapper)
    // @ngInject
    function typeaheadWrapper($templateCache, $compile, _) {
      var directive = {
        restrict: 'A',
        scope: false, //bypassing the scope isolation
        link: function(scope, elem, attrs)
        {
          //sha1(''+new Date().getTime())
          console.log("A:", attrs);
          var template = "<input ";
          template+='type="'+attrs['type']+'" ';
          template+='ng-model="'+attrs['ngModel']+'" ';
          template+='class="'+attrs['class']+'" ';
          template+='typeahead-editable="'+attrs['typeaheadEditable']+'" ';
          template+='typeahead-focus-first="'+attrs['typeaheadFocusFirst']+'" ';
          template+='typeahead-append-to-body="'+attrs['typeaheadAppendToBody']+'" ';
          template+='typeahead-on-select="'+attrs['typeaheadOnSelect']+'" ';
          template+='typeahead-input-formatter="'+_.get(scope,attrs['typeaheadInputFormatter'])+'" ';
          template+='typeahead-template-url="'+_.get(scope,attrs['typeaheadTemplateUrl'])+'" ';
          template+='uib-typeahead="'+_.get(scope, attrs['typeaheadWrapper'])+'" ';
          template+='>';
          console.log("Linking:", scope);
          console.log("ELem:", angular.element(template));
          $templateCache.put('typeahead.tpl.html', template);
          $compile($templateCache.get('typeahead.tpl.html'))(scope, function(replacement){
            elem.replaceWith(replacement);
          });
        }

      };

      return directive;
    }

})();
