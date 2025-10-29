import * as f from './f/i.js';

function Node(
    nodeType,
    nodeName,
    childNodes,
    parentNode,

    ownerDocument,
) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;

    this.childNodes = childNodes;
    this.parentNode = parentNode;

    this.ownerDocument = ownerDocument;
};

Node.prototype = f;

export default Node;
