
export default (
    function(exclusionId) {
        var
            currentTagId = 0,
            a = this.IMPLICIT_END_TAG_REQUIRED_THOROUGHLY
        ;
        while (
            ((currentTagId = this.currentTagId) !== undefined)
            &&
            (currentTagId !== exclusionId)
            &&
            a.has(currentTagId)
        ) {
            this.pop();
        };
        return undefined;
    }
);
