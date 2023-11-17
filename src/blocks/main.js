import * as Blockly from 'blockly'


export const buildMainBlock = (ws) => {
    const blocks = document.getElementById('workspace-blocks');
    if (blocks.firstElementChild) {
        const ids = Blockly.Xml.domToWorkspace(blocks, ws);
        return ws.getBlockById(ids[0])
    }
    throw new Error('No blocks found in workspace');
}