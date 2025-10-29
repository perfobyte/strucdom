import * as f from './f/i.js';


// el.id// "box"
// el.className        // "container"

function ElementNode(
    tagName,
    children,
    parentElement,
    attributes,
) {
    this.tagName = tagName;
    this.children = children;
    this.parentElement = parentElement;
    this.attributes = attributes;
}

Node.prototype = f;

export default Node;
