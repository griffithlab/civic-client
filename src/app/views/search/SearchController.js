(function() {
  'use strict';
  angular.module('civic.search')
    .controller('SearchController', SearchController);

  // @ngInject
  function SearchController($scope, $log, formlyVersion) {
    var vm = $scope.vm = {};

    // funcation assignment
    vm.onSubmit = onSubmit;

    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: formlyVersion
    };
    vm.options = {};

    init();

    vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
      $log.debug(JSON.stringify(vm.model));
    }

    vm.buttonLabel = 'Search Evidence Items';

    function init() {
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

      vm.operatorField = [
        {
          key: 'operator',
          type: 'select',
          defaultValue: 'AND',
          templateOptions: {
            label: '',
            options: [
              { value: 'AND', name: 'all' },
              { value: 'OR', name: 'any' }
            ]
          }
        }
      ];

      vm.fields = [
        {
          type: 'queryRow',
          key: 'queries',
          templateOptions: {
            rowFields: [
              {
                key: 'field',
                type: 'select',
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: '', name: 'Please select a field' },
                    { value: 'applied_suggested_changes', name: 'Applied Suggested Revisions' },
                    { value: 'citation', name: 'Citation' },
                    { value: 'citation_id', name: 'Citation ID' },
                    { value: 'description', name: 'Description' },
                    { value: 'disease_id', name: 'Disease DOID' },
                    { value: 'disease_name', name: 'Disease Name' },
                    { value: 'drug_id', name: 'Drug PubChem ID' },
                    { value: 'drug_name', name: 'Drug Name' },
                    { value: 'disease_id', name: 'Disease DOID' },
                    { value: 'evidence_level', name: 'Evidence Level' },
                    { value: 'gene_name', name: 'Gene Name' },
                    { value: 'pending_suggested_changes', name: 'Pending Suggested Revisions' },
                    { value: 'rating', name: 'Rating' },
                    { value: 'variant_name', name: 'Variant Name' }
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
              applied_suggested_changes: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'is_greater_than',
                  templateOptions: {
                    required: true,
                    label: '',
                    options: [
                      { value: 'is_greater_than', name: 'is greater than' },
                      { value: 'is_less_than', name: 'is less than' },
                      { value: 'is_equal_to', name: 'is equal to' },
                      { value: 'is_in_the_range', name: 'is in the range' }
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
                },
                {
                  template: 'to',
                  className: 'inline-field',
                  hideExpression: 'model.name.length > 0 && model.name !== "is_in_the_range"'
                },
                {
                  key: 'paramters[1]',
                  type: 'input',
                  className: 'inline-field',
                  hideExpression: 'model.name.length > 0 && model.name !== "is_in_the_range"',                              templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              citation: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: null, name: 'Please select a condition'},
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'string',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              citation_id: [
                {
                  key: 'name',
                  type: 'input',
                  defaultValue: 'is',
                  hideExpression: 'true',
                  templateOptions: {
                    label: ''
                  }
                },
                {
                  template: 'is',
                  className: 'inline-field'
                },
                {
                  key: 'id',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              rating: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    required: true,
                    label: '',
                    options: [
                      { value: '', name: 'Please select a condition' },
                      { value: 'is_greater_than', name: 'is greater than' },
                      { value: 'is_less_than', name: 'is less than' },
                      { value: 'is_equal_to', name: 'is equal to' },
                      { value: 'is_in_the_range', name: 'is in the range'}
                    ]
                  }
                },
                {
                  key: 'rating',
                  type: 'rating',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                },
                {
                  template: 'to',
                  className: 'inline-field',
                  hideExpression: 'model.name != "is_in_the_range"'
                },
                {
                  key: 'to_rating',
                  type: 'rating',
                  className: 'inline-field',
                  hideExpression: 'model.name != "is_in_the_range"',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              description: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: undefined, name: 'Please select a condition'},
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'string',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              disease_name: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: undefined, name: 'Please select a condition'},
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'string',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              disease_id: [
                {
                  key: 'name',
                  type: 'input',
                  defaultValue: 'is',
                  hideExpression: 'true',
                  templateOptions: {
                    label: ''
                  }
                },
                {
                  key: 'name',
                  template: 'is',
                  className: 'inline-field',
                  defaultValue: 'is'
                },
                {
                  key: 'id',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              drug_name: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: undefined, name: 'Please select a condition'},
                      {value: 'is', name: 'is'},
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'string',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              drug_id: [
                {
                  key: 'name',
                  type: 'input',
                  defaultValue: 'is',
                  hideExpression: 'true',
                  templateOptions: {
                    label: ''
                  }
                },
                {
                  template: 'is',
                  defaultValue: 'is',
                  className: 'inline-field'
                },
                {
                  key: 'id',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              evidence_level: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: undefined, name: 'Please select a condition'},
                      {value: 'is', name: 'is'},
                      {value: 'is_above', name: 'is above'},
                      {value: 'is_below', name: 'is below'}
                    ]
                  }
                },
                {
                  key: 'level',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      { value: '', name: 'Please select an Evidence Level' },
                      { value: 'A', name: 'A - Validated'},
                      { value: 'B', name: 'B - Clinical'},
                      { value: 'C', name: 'C - Preclinical'},
                      { value: 'D', name: 'D - Case Study'},
                      { value: 'E', name: 'E - Inferential'}
                    ]
                  }
                }
              ],
              gene_name: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: undefined, name: 'Please select a condition'},
                      {value: 'is', name: 'is'},
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'string',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              pending_suggested_changes: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    required: true,
                    label: '',
                    options: [
                      { value: '', name: 'Please select a condition' },
                      { value: 'is', name: 'is' },
                      { value: 'is_greater_than', name: 'is greater than' },
                      { value: 'is_less_than', name: 'is less than' },
                      { value: 'is_equal_to', name: 'is equal to' },
                      { value: 'is_in_the_range', name: 'is in the range' }
                    ]
                  }
                },
                {
                  key: 'count',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                },
                {
                  template: 'to',
                  className: 'inline-field',
                  hideExpression: 'model.name != "is_in_the_range"'
                },
                {
                  key: 'to_count',
                  type: 'input',
                  className: 'inline-field',
                  hideExpression: 'model.name != "is_in_the_range"',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              variant_name: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: undefined, name: 'Please select a condition'},
                      {value: 'is', name: 'is'},
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'string',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ]
            }
          }
        }
      ];
    }
  }
})();
