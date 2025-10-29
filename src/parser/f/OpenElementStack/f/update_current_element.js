

export default (
    function() {
        var
            stackTop = this.stackTop
        ;
        return (
            (this.current = this.items[stackTop]),
            (this.currentTagId = this.tagIDs[stackTop]),
            this
        );
    }
);
