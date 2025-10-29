
export default (
    function(token) {
        var
            current = null,
            currentTagId = 0,

            NS = this.NS,
            TAG_ID = this.TAG_ID,
            
            openElements = this.openElements,
            fragmentContext = this.fragmentContext,

            tagID = token.tagID
        ;
        return (
            this.currentNotInHTML
            &&
            (
                ((openElements.stackTop === 0) && fragmentContext)
                ? (
                    (current = fragmentContext),
                    (currentTagId = this.fragmentContextID)
                )
                : (
                    (current = openElements.current),
                    (currentTagId = openElements.currentTagId)
                ),

                (
                    (tagID === TAG_ID.SVG)
                    &&
                    ((current.tagName) === this.TAG_NAMES.ANNOTATION_XML)
                    &&
                    ((current.namespaceURI) === NS.MATHML)
                )
                ? false
                : (
                    (this.tokenizer.inForeignNode)
                    ||
                    (
                        (
                            (tagID === TAG_ID.MGLYPH)
                            ||
                            (tagID === TAG_ID.MALIGNMARK)
                        )
                        &&
                        (currentTagId !== undefined)
                        &&
                        (!(this.is_integration_point(currentTagId, current, NS.HTML)))
                    )
                )
            )
        );
    }
)