import * as f from './f/i.js';

function OpenElementStack(
    document,
    handler
) {
    this.items = [];
    this.tagIDs = [];
    this.stackTop = -1;
    this.tmplCount = 0;
    this.currentTagId = this.TAG_ID.UNKNOWN;

    this.handler = handler;
    this.current = document;
};

OpenElementStack.prototype = f;

export default OpenElementStack;
