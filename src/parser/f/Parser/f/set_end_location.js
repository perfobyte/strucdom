

export default (
    function(
        element,
        closingToken
    ) {
        var
            l = null,
            s = null
        ;
        return (
            (s = element.sourceCodeLocation)
            &&
            (l = closingToken.location)
            &&
            (
                (
                    element.sourceCodeLocation = (
                        (
                            (closingToken.type === this.TokenType.END_TAG)
                            &&
                            ((element.tagName) === closingToken.tagName)
                        )
                        ? ({
                            ...s,
                            endTag: { ...l },
                            endLine: l.endLine,
                            endCol: l.endCol,
                            endOffset: l.endOffset,
                        })
                        : ({
                            ...s,
                            endLine: l.startLine,
                            endCol: l.startCol,
                            endOffset: l.startOffset,
                        })
                    )
                )
            ),

            this
        );
    }
);
