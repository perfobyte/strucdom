
export default (
    function() {
        var
            IMPLICIT_END_TAG_REQUIRED = this.IMPLICIT_END_TAG_REQUIRED,
            currentTagId = 0
        ;
        while (
            ((currentTagId = this.currentTagId) !== undefined)
            &&
            IMPLICIT_END_TAG_REQUIRED.has(currentTagId)
        ) {
            this.pop();
        };
        return undefined;
    }
)