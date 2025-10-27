import * as f from './f/i.js';

function EntityDecoder(
    decodeTree,
    emitCodePoint,
    errors
) {
    this.state = this.EntityDecoderState.EntityStart;
    this.decodeMode = this.DecodingMode.Strict;
    
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    

    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
};

EntityDecoder.prototype = f;

export default EntityDecoder;
