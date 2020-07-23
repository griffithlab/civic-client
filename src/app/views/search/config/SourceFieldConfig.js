(function() {
  angular.module('civic.search')
    .factory('SourceFieldConfig', function() {
      return {
        getFields: function() {
          return [
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
                        { value: 'abstract', name: 'Abstract' },
                        { value: 'asco_id', name: 'ASCO ID' },
                        { value: 'author', name: 'Author' },
                        { value: 'evidence_item_count', name: 'Evidence Items' },
                        { value: 'gene', name: 'Gene' },
                        { value: 'journal', name: 'Journal Name' },
                        { value: 'nct_id', name: 'NCT ID'},
                        { value: 'pmc_id', name: 'PMC ID' },
                        { value: 'publication_year', name: 'Publication Year' },
                        { value: 'pubmed_id', name: 'PubMed ID' },
                        { value: 'source_suggestion_count', name: 'Source Suggestions' },
                        { value: 'id', name: 'Source ID'},
                        { value: 'source_type', name: 'Source Type' },
                        { value: 'title', name: 'Title' },
                        { value: 'variant', name: 'Variant'},
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
                  asco_id: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-md',
                      data: {
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'}
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]', // pubmed id
                      type: 'input',
                      className: 'inline-field',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  pubmed_id: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-md',
                      data: {
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'}
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
                  journal: [
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
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_empty', name: 'is empty'}
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
                  abstract: [
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
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_empty', name: 'is empty'}
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      hideExpression: 'model.name === "is_empty"',
                      className: 'inline-field',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  nct_id: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-md',
                      data: {
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'},
                          {value: 'is_empty', name: 'is empty'},
                          {value: 'is_not_empty', name: 'is not empty'},
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      hideExpression: 'model.name =="is_empty" || model.name == "is_not_empty"',
                      className: 'inline-field',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  pmc_id: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-md',
                      data: {
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'}
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
                  author: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-md',
                      data: {
                        defaultValue: 'contains'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
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
                  publication_year: [
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
                          {value: 'is_not_equal_to', name: 'is not'},
                          {value: 'is_greater_than_or_equal_to', name: 'is greater than or equal to'},
                          {value: 'is_less_than_or_equal_to', name: 'is less than or equal to'},
                          { value: 'is_in_the_range', name: 'is in the range' }
                        ],
                        onChange: function(value, options, scope) {
                          _.pullAt(scope.model.parameters, 1,2);
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field inline-field-small',
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
                      key: 'parameters[1]',
                      type: 'input',
                      className: 'inline-field inline-field-small',
                      hideExpression: 'model.name != "is_in_the_range"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  evidence_item_count: [
                    {
                      template: 'with status',
                      className: 'inline-field'
                    },
                    {
                      key: 'parameters[0]', // status
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'accepted'
                      },
                      templateOptions: {
                        required: true,
                        label: '',
                        options: [
                          { value: 'accepted', name: 'accepted' },
                          { value: 'submitted', name: 'submitted' },
                          { value: 'any', name: 'any' },
                          { value: 'rejected', name: 'rejected' },
                          { value: 'not rejected', name: 'not rejected' }
                        ]
                      }
                    },
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'is_greater_than_or_equal_to'
                      },
                      templateOptions: {
                        required: true,
                        label: '',
                        options: [
                          { value: 'is_greater_than_or_equal_to', name: 'is greater than or equal to' },
                          { value: 'is_greater_than', name: 'is greater than' },
                          { value: 'is_less_than', name: 'is less than' },
                          { value: 'is_less_than_or_equal_to', name: 'is less than or equal to' },
                          { value: 'is_equal_to', name: 'is equal to' },
                          { value: 'is_in_the_range', name: 'is in the range'}
                        ],
                        onChange: function(value, options, scope) {
                          _.pullAt(scope.model.parameters, 1,2);
                        }
                      }
                    },
                    {
                      key: 'parameters[1]', // from value
                      type: 'input',
                      className: 'inline-field inline-field-xs',
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
                      key: 'parameters[2]', // to value
                      type: 'input',
                      className: 'inline-field inline-field-xs',
                      hideExpression: 'model.name.length > 0 && model.name !== "is_in_the_range"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  source_suggestion_count: [
                    {
                      template: 'with status',
                      className: 'inline-field'
                    },
                    {
                      key: 'parameters[0]', // status
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'new'
                      },
                      templateOptions: {
                        required: true,
                        label: '',
                        options: [
                          { value: 'new', name: 'new' },
                          { value: 'rejected', name: 'rejected' },
                          { value: 'any', name: 'any' },
                          { value: 'curated', name: 'curated' },
                        ]
                      }
                    },
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'is_greater_than_or_equal_to'
                      },
                      templateOptions: {
                        required: true,
                        label: '',
                        options: [
                          { value: 'is_greater_than_or_equal_to', name: 'is greater than or equal to' },
                          { value: 'is_greater_than', name: 'is greater than' },
                          { value: 'is_less_than', name: 'is less than' },
                          { value: 'is_less_than_or_equal_to', name: 'is less than or equal to' },
                          { value: 'is_equal_to', name: 'is equal to' },
                          { value: 'is_in_the_range', name: 'is in the range'}
                        ],
                        onChange: function(value, options, scope) {
                          _.pullAt(scope.model.parameters, 1,2);
                        }
                      }
                    },
                    {
                      key: 'parameters[1]', // from value
                      type: 'input',
                      className: 'inline-field inline-field-xs',
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
                      key: 'parameters[2]', // to value
                      type: 'input',
                      className: 'inline-field inline-field-xs',
                      hideExpression: 'model.name.length > 0 && model.name !== "is_in_the_range"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  source_type: [
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
                        defaultValue: 'PubMed'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          { value: 'ASCO', name: 'ASCO' },
                          { value: 'PubMed', name: 'PubMed' },
                        ]
                      }
                    }
                  ],
                  title: [
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
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_empty', name: 'is empty'}
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
                  gene: [
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
                          {value: 'is', name: 'is'},
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'}
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
                  variant: [
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
                          {value: 'is', name: 'is'},
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'}
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
                  id: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'is_equal_to'
                      },
                      templateOptions: {
                        required: true,
                        label: '',
                        options: [
                          { value: 'is_greater_than_or_equal_to', name: 'is greater than or equal to' },
                          { value: 'is_greater_than', name: 'is greater than' },
                          { value: 'is_less_than', name: 'is less than' },
                          { value: 'is_less_than_or_equal_to', name: 'is less than or equal to' },
                          { value: 'is_equal_to', name: 'is equal to' },
                          { value: 'is_in_the_range', name: 'is in the range'}
                        ],
                        onChange: function(value, options, scope) {
                          _.pullAt(scope.model.parameters, 1,2);
                        }
                      }
                    },
                    {
                      key: 'parameters[0]', // from value
                      type: 'input',
                      className: 'inline-field inline-field-sm',
                      templateOptions: {
                        size: 8,
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
                      key: 'parameters[1]', // to value
                      type: 'input',
                      className: 'inline-field inline-field-xs',
                      hideExpression: 'model.name.length > 0 && model.name !== "is_in_the_range"',
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
      };
    });
})();
