(function() {
  'use strict';
  angular.module('civic.search')
    .factory('VariantFieldConfig', function(ConfigService) {
      var make_options = ConfigService.optionMethods.make_options;
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
                        { value: 'chromosome', name: 'CHR1 Chromosome' },
                        { value: 'start', name: 'CHR1 Start' },
                        { value: 'stop', name: 'CHR1 Stop' },
                        { value: 'representative_transcript', name: 'CHR1 Representative Transcript' },
                        { value: 'chromosome2', name: 'CHR2 Chromosome' },
                        { value: 'start2', name: 'CHR2 Start' },
                        { value: 'stop2', name: 'CHR2 Stop' },
                        { value: 'representative_transcript2', name: 'CHR2 Representative Transcript' },
                        { value: 'allele_registry_id', name: 'Allele Registry ID' },
                        { value: 'assertion_count', name: 'Assertion' },
                        { value: 'civic_actionability_score', name: 'CIViC Variant Evidence Score' },
                        { value: 'description', name: 'Description' },
                        { value: 'disease_name', name: 'Disease Implicated (Name)' },
                        { value: 'disease_doid', name: 'Disease Implicated (DOID)' },
                        { value: 'ensembl_version', name: 'Ensembl Version' },
                        { value: 'evidence_item_count', name: 'Evidence Items' },
                        { value: 'gene', name: 'Gene Entrez Name' },
                        { value: 'hgvs_expressions', name: 'HGVS Expression(s)' },
                        { value: 'name', name: 'Name' },
                        { value: 'pipeline_type', name: 'Pipeline Type' },
                        { value: 'reference_bases', name: 'Reference Base(s)' },
                        { value: 'reference_build', name: 'Reference Build' },
                        { value: 'suggested_changes_count', name: 'Suggested Revisions' },
                        { value: 'variant_alias', name: 'Variant Alias' },
                        { value: 'variant_bases', name: 'Variant Base(s)' },
                        { value: 'variant_group', name: 'Variant Group' },
                        { value: 'id', name: 'Variant ID'},
                        { value: 'variant_types', name: 'Variant Type(s)' },
                        { value: 'variant_types_soids', name: "Variant Type(s) Sequence Ontology IDs" },
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
                  assertion_count: [
                    {
                      template: 'Variant',
                      className: 'inline-field',
                    },
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
                        ],
                      }
                    },
                    {
                      template: 'associated with an assertion',
                      className: 'inline-field',
                    },
                  ],
                  allele_registry_id: [
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
                          {value: 'contains', name: 'contains'},
                          {value: 'is_empty', name: 'is empty'},
                          {value: 'is_not_empty', name: 'is not empty'},
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name =="is_empty" || model.name == "is_not_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  civic_actionability_score: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'is_above'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is_equal_to', name: 'is'},
                          {value: 'is_above', name: 'is above'},
                          {value: 'is_below', name: 'is below'}
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
                  name: [
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
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  pipeline_type: [
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
                        defaultValue: 'Proteint-Based'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          { value: 'Protein-Based', name: 'Protein-Based' },
                          { value: 'DNA-Based', name: 'DNA-Based' },
                          { value: 'RNA-Based', name: 'RNA-Based' },
                        ]
                      }
                    }
                  ],
                  description: [
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
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  disease_name: [
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
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'is_not', name: 'is not'},
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'typeahead',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true,
                        typeahead: 'item.name as item.name for item in to.data.typeaheadSearch($viewValue)',
                        editable: true,
                        templateUrl: 'components/forms/fieldTypes/diseaseTypeahead.tpl.html',
                        data: {
                          typeaheadSearch: function(val) {
                            return Diseases.beginsWith(val)
                              .then(function(response) {
                                return _.map(response, function(disease) {
                                  if ( disease.aliases.length > 0 ) {
                                    disease.alias_list = disease.aliases.join(', ');
                                  } else {
                                    disease.alias_list = '--';
                                  }
                                  return disease;
                                });
                              });
                          }
                        }
                      }
                    }
                  ],
                  disease_doid: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-small',
                      data: {
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'},
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  variant_types_soids: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'},
                          {value: 'is_empty', name: 'is empty'}
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  variant_types: [
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
                          {value: 'is_empty', name: 'is empty'}
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  variant_group: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'},
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_undefined', name: 'is undefined'}
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_undefined"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  variant_alias: [
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
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_empty', name: 'is empty'}
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  hgvs_expressions: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'},
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_undefined', name: 'is undefined'}
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_undefined"',
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
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'},
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_undefined', name: 'is undefined'}
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_undefined"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  reference_build: [
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
                        defaultValue: 'GRCh38'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          { value: 'GRCh38', name: 'GRCh38 (hg20)' },
                          { value: 'GRCh37', name: 'GRCh37 (hg19)' },
                          { value: 'NCBI36', name: 'NCBI36 (hg18)' }
                        ]
                      }
                    }
                  ],
                  ensembl_version: [
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
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  reference_bases: [
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
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  variant_bases: [
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
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  chromosome: [
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
                          {value: 'is_empty', name: 'is empty'},
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: null
                      },
                      hideExpression: 'model.name == "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [{ value: null, name: 'Please choose a chromosome'}].concat(ConfigService.valid_chromosomes)
                      }
                    }
                  ],
                  start: [
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
                      hideExpression: 'model.name != "is_in_the_range"'
                    },
                    {
                      key: 'parameters[1]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name != "is_in_the_range"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  stop: [
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
                      hideExpression: 'model.name != "is_in_the_range"'
                    },
                    {
                      key: 'parameters[1]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name != "is_in_the_range"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  representative_transcript: [
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
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  chromosome2: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-md',
                      data: {
                        defaultValue: 'is_equal_to'
                      },
                      onChange: function(value, options, scope) {
                        if(scope.model.name.match(/empty/)) {
                          _.pullAt(scope.model.parameters, 0);
                        }
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is_equal_to', name: 'is'},
                          {value: 'is_not_equal_to', name: 'is not'},
                          {value: 'is_empty', name: 'is empty'},
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: '1'
                      },
                      hideExpression: 'model.name =="is_empty" || model.name == "is_not_empty"',
                      templateOptions: {
                        label: '',
                        required: true,
                        options: ConfigService.valid_chromosomes
                      }
                    }
                  ],
                  start2: [
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
                      hideExpression: 'model.name != "is_in_the_range"'
                    },
                    {
                      key: 'parameters[1]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name != "is_in_the_range"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  stop2: [
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
                      hideExpression: 'model.name != "is_in_the_range"'
                    },
                    {
                      key: 'parameters[1]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name != "is_in_the_range"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  representative_transcript2: [
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
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  suggested_changes_count: [
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
                          { value: 'applied', name: 'applied' },
                          { value: 'rejected', name: 'rejected' }
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
