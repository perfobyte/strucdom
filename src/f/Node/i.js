import * as f from './f/i.js';

function Node(
    type,
    name,
    
    children,
    parent,
    ownerDocument,

    data,
    specified,
) {
    this.name = name;

    this.children = children;
    this.parent = parent;
    this.ownerDocument = ownerDocument;

    this.data = data;
    this.specified = specified;

    this.inner_html = this._inner_html[this.type = type];
    this.outer_html = this._outer_html[type];
    this.text_content = this._text_content[type];
};

Node.prototype = f;

export default Node;
