
export default (
    function(
        tagNames,
        namespace
    ) {
        var
            i = this.stackTop,
            items = this.items,
            tagIDs = this.tagIDs,
            v = -1
        ;
        for (; i >= 0; i--) {
            if (
                tagNames.has(tagIDs[i])
                &&
                (
                    (
                        (
                            items[i]
                        )
                        .namespaceURI
                    ) === namespace
                )
            ) {
                v = i;
                break;
            }
        }
        return v;
    }
);
