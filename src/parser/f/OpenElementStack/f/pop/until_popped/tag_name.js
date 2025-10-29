
export default (
    function(tagName) {
        var
            targetIdx = (this.stackTop + 1),
            HTML = this.NS.HTML,

            items = this.items,
            tagIDs = this.tagIDs
        ;
        
        do {
            targetIdx = tagIDs.lastIndexOf(tagName, (targetIdx - 1));
        }
        while (
            (targetIdx > 0)
            &&
            ((items[targetIdx]).namespaceURI) !== HTML
        );

        return this.shorten_to_length(Math.max(targetIdx, 0));
    }
);
