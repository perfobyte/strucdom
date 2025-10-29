export default (
    function() {
        return (
            (this.stackTop === 0)
            &&
            (this.tagIDs[0] === this.TAG_ID.HTML)
        );
    }
);
