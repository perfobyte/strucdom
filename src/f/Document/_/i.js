
import * as f from './f/i.js';

function Document(
    childNodes,
) {
    this.childNodes = childNodes;
};

Document.prototype = f;

export default Document;