

export default (
    function() {
        var
            a = this.IMPLICIT_END_TAG_REQUIRED_THOROUGHLY,
            currentTagId = 0
        ;
        while (
            ((currentTagId = this.currentTagId) !== undefined)
            &&
            a.has(currentTagId)
        ) {
            this.pop();
        };
        return undefined;
    }
)