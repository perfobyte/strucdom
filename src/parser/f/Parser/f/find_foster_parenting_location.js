

export default (
    function() {
        var
            openElements = this.openElements,
            TAG_ID = this.TAG_ID,
            NS = this.NS,

            TEMPLATE = TAG_ID.TEMPLATE,
            TABLE = TAG_ID.TABLE,

            NS_HTML = NS.HTML,

            items = openElements.items,
            tagIDs = openElements.tagIDs,

            i = openElements.stackTop,

            openElement = null,
            parent = null,

            tag_id = 0,

            v = null
        ;
        r: {
            b: for (; i >= 0; i--) {
                openElement = items[i];

                if ((tag_id = tagIDs[i]) === TEMPLATE) {
                    if ((openElement.namespaceURI) === NS_HTML) {
                        v = {
                            parent: (openElement.content),
                            beforeElement: null
                        };
                        break r;
                    }
                    break b;
                }
                else if (tag_id === TABLE) {
                    v = (
                        (parent = (openElement.parentNode))
                        ? ({
                            parent,
                            beforeElement: openElement,
                        })
                        : ({
                            parent: items[i - 1],
                            beforeElement: null,
                        })
                    );
                    break r;
                }
            };

            v = {
                parent: items[0],
                beforeElement: null
            };
        }

        return v;
    }
);
