export default {
    'kind': 'categoryToolbox',
    'contents': [
        {
            'kind': 'category',
            'name': 'Logic',
            'categorystyle': 'logic_category',
            'contents': [
                {
                    'kind': 'block',
                    'type': 'controls_if'
                },
                {
                    'kind': 'block',
                    'type': 'logic_compare'
                },
                {
                    'kind': 'block',
                    'type': 'logic_operation'
                },
                {
                    'kind': 'block',
                    'type': 'logic_negate'
                },
                {
                    'kind': 'block',
                    'type': 'logic_boolean'
                }
            ]
        },
        {
            'kind': 'category',
            'name': 'Loops',
            'categorystyle': 'loop_category',
            'contents': [
                {
                    'kind': 'block',
                    'type': 'controls_repeat_ext',
                    'inputs': {
                        'TIMES': {
                            'shadow': {
                                'type': 'math_number',
                                'fields': {
                                    'NUM': 10
                                }
                            },
                        }
                    },
                },
                {
                    'kind': 'block',
                    'type': 'controls_flow_statements'
                }
            ]
        },
        {
            'kind': 'category',
            'name': 'Math',
            'categorystyle': 'math_category',
            'contents': [
                {
                    'kind': 'block',
                    'type': 'math_number',
                    'fields': {
                        'NUM': 123
                    }
                },
                {
                    'kind': 'block',
                    'type': 'math_arithmetic',
                    'inputs': {
                        'A': {
                            'shadow': {
                                'type': 'math_number',
                                'fields': {
                                    'NUM': 1
                                }
                            }
                        },
                        'B': {
                            'shadow': {
                                'type': 'math_number',
                                'fields': {
                                    'NUM': 1
                                }
                            }
                        }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'math_single',
                    'inputs': {
                        'NUM': {
                            'shadow': {
                                'type': 'math_number',
                                'fields': {
                                    'NUM': 9
                                }
                            }
                        }
                    },
                },
                {
                    'kind': 'block',
                    'type': 'math_number_property',
                    'inputs': {
                        'NUMBER_TO_CHECK': {
                            'shadow': {
                                'type': 'math_number',
                                'fields': {
                                    'NUM': 0
                                }
                            }
                        }
                    },
                }
            ]
        },
        {
            'kind': 'category',
            'name': 'Text',
            'categorystyle': 'text_category',
            'contents': [
                {
                    'kind': 'block',
                    'type': 'text'
                },
                {
                    'kind': 'block',
                    'type': 'text_multiline'
                },
                {
                    'kind': 'label',
                    'text': 'Input/Output:',
                    'web-class': 'ioLabel'
                },
                {
                    'kind': 'block',
                    'type': 'print_block',
                    'inputs': {
                        'VALUE': {
                            'shadow': {
                                'type': 'text',
                                'fields': {
                                    'TEXT': 'abc'
                                }
                            }
                        }
                    },
                },
            ]
        },
        {
            'kind': 'category',
            'name': 'Variables',
            'categorystyle': 'variable_category',
            'custom': 'VARIABLE'
        },
        {
            'kind': 'category',
            'name': 'Functions',
            'categorystyle': 'procedure_category',
            'custom': 'PROCEDURE'
        }
    ]
}