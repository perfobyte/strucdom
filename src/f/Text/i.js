import * from './f/i.js';

function Text(
    data,
    parentNode,
) {
    this.data = data;
    this.parentNode = parentNode;
};

Text.prototype = f;

export default Text;
