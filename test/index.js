
(function () {
    const toolbox = {
        kind: 'flyoutToolbox',
        contents: [
            {
                "kind": "block",
                "type": "controls_if"
            },
            {
                "kind": "block",
                "type": "logic_compare"
            },
            {
                "kind": "block",
                "type": "controls_repeat_ext"
            },
            {
                "kind": "block",
                "type": "math_number",
                "fields": {
                    "NUM": 123
                }
            },
            {
                "kind": "block",
                "type": "math_arithmetic"
            },
            {
                "kind": "block",
                "type": "text"
            },
            {
                "kind": "block",
                "type": "text_print"
            }
        ]
    }

    Blockly.inject('blocklyDiv', {
        media: './vendor/blockly/media/',
        toolbox: toolbox
    });
})()