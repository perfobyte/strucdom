export default (
    function(decodeMode) {
        this.decodeMode = decodeMode;
        this.state = this.EntityDecoderState.EntityStart;
        this.result = 0;
        this.treeIndex = 0;
        this.excess = 1;
        this.consumed = 1;
        return this;
    }
);
