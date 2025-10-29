

export default (
    function(token) {
        var
            parent = null,
            beforeElement = null,
            loc = null,
            siblings = null,
            textNode = null,
            l = null
        ;
        return (
            this.should_foster_parent_on_insertion()
            ? (
                (parent = (loc = this.find_foster_parenting_location()).parent),

                (beforeElement = loc.beforeElement)
                ? this.insert_text_before(parent, token.chars, beforeElement)
                : this.insert_text(parent, token.chars)
            )
            : (
                this.insert_text(
                    (parent = this.openElements.currentTmplContentOrNode),
                    token.chars
                )
            ),

            (l = token.location)
            &&
            (
                (
                    (
                        textNode = (
                            (
                                siblings = (parent.childNodes)
                            )[
                                (
                                    beforeElement
                                    ? siblings.lastIndexOf(beforeElement)
                                    : siblings.length
                                )
                                - 1
                            ]
                        )
                    )
                    .sourceCodeLocation
                )
                ? (
                    textNode
                    .sourceCodeLocation = {
                        ...textNode.sourceCodeLocation,
                        endLine: l.endLine,
                        endCol: l.endCol,
                        endOffset: l.endOffset,
                    }
                )
                :
                (this.options.sourceCodeLocationInfo)
                &&
                (
                    textNode.sourceCodeLocation = token.location
                )
            ),

            this
        );
    }
);
