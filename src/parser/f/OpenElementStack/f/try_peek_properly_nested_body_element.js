export default (
    function() {
        return (
            ((this.stackTop >= 1) && (this.tagIDs[1] === this.TAG_ID.BODY))
            ? this.items[1]
            : null
        );
    }
)