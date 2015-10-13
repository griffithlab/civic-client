(function() {
  'use strict';
  angular.module('civic.search')
    .controller('SearchController', SearchController);

  // @ngInject
  function SearchController($scope, $log, formlyVersion) {
    var vm = $scope.vm = {};

    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: 'Joe Zhou',
      url: 'https://plus.google.com/u/0/111062476999618400219/posts' // a link to your twitter/github/blog/whatever
    };
    vm.exampleTitle = 'Repeating Section'; // add this
    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: formlyVersion
    };
    vm.options = {};

    init();

    vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
      alert(JSON.stringify(vm.model), null, 2);
    }


    function init() {
      vm.model = {
        queries: [
          {
            field: undefined,
            condition: {
              name: undefined
            }
          }
        ]
      };

      vm.operatorField = [
        {
          key: 'operator',
          type: 'select',
          templateOptions: {
            label: 'Operator',
            options: [
              { value: undefined, name: 'Please select AND or OR' },
              { value: 'OR', name: 'OR' },
              { value: 'AND', name: 'AND' }
            ]
          }
        }
      ];

      vm.fields = [
        {
          type: 'queryRow',
          key: 'queries',
          templateOptions: {
            btnText: 'Add another investment',
            rowFields: [
              {
                key: 'field',
                type: 'select',
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: undefined, name: 'Please select a field' },
                    { value: 'description', name: 'Description' },
                    { value: 'rating', name: 'Rating' },
                    { value: 'citation', name: 'Citation' },
                    { value: 'drug_name', name: 'Drug Name' },
                    { value: 'drug_id', name: 'Drug PubChem ID' },
                    { value: 'disease_name', name: 'Disease Name' },
                    { value: 'disease_id', name: 'Disease DOID' }
                  ],
                  onChange: function(value, options, scope) {
                    scope.model.condition = {};
                  }
                }
              }
            ],
            conditionFields: {
              rating: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  templateOptions: {
                    required: true,
                    label: '',
                    options: [
                      { value: undefined, name: 'Please select a condition' },
                      { value: 'is_greater_than', name: 'is greater than' },
                      { value: 'is_less_than', name: 'is less than' },
                      { value: 'is_equal_to', name: 'is equal to' }
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
              citation: [
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
            }
          }
        }
      ];
    }
  }
})();
