(function() {
  angular.module('civic.search')
    .constant('SuggestedChangeFieldConfig', [
      {
        type: 'queryRow',
        key: 'queries',
        templateOptions: {
          rowFields: [
            {
              key: 'field',
              type: 'queryBuilderSelect',
              templateOptions: {
                label: '',
                required: true,
                options: [
                  { value: '', name: 'Please select a field' },
                  { value: 'moderated_type', name: 'Suggested Change Entity' },
                  { value: 'moderated_id', name: 'Suggested Change Entity ID' },
                  { value: 'submitter', name: 'Submitter Display Name' },
                  { value: 'submitter_id', name: 'Submitter ID' },
                ],
                onChange: function(value, options, scope) {
                  scope.model.condition = {
                    name: undefined,
                    parameters: []
                  };
                }
              }
            }
          ],
          conditionFields: {
            moderated_type: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field inline-field-md',
                data: {
                  defaultValue: 'is_equal_to'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'Assertion'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: 'Assertion', name: 'Assertion' },
                    { value: 'EvidenceItem', name: 'Evidence Item' },
                    { value: 'Gene', name: 'Gene' },
                    { value: 'Variant', name: 'Variant' },
                    { value: 'VariantGroup', name: 'Variant Group' },
                  ]
                }
              }
            ],
            moderated_id: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field inline-field-md',
                data: {
                  defaultValue: 'is_equal_to'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'input',
                className: 'inline-field',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            submitter: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'contains'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'contains', name: 'contains'},
                    {value: 'does_not_contain', name: 'does not contain'},
                    {value: 'begins_with', name: 'begins with'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'input',
                className: 'inline-field',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            submitter_id: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'is_equal_to'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'input',
                className: 'inline-field',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
          }
        }
      }
    ]);
})();
