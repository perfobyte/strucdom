import * as f from './f/i.js';

function DocumentFragment(
    childNodes,
    ownerDocument,
) {
    this.childNodes = childNodes;
    this.ownerDocument = ownerDocument;
};

DocumentFragment.prototype = f;

export default DocumentFragment;
