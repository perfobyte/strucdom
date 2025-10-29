export default (
    function(token, code, beforeToken) {
        var
            loc = null
        ;
        return (
            this.on_parse_error({
                code,
                startLine: (
                    (
                        loc = (
                            token.location
                            ??
                            this.BASE_LOC
                        )
                    )
                    .startLine
                ),
                startCol: loc.startCol,
                startOffset: loc.startOffset,
                endLine: beforeToken ? loc.startLine : loc.endLine,
                endCol: beforeToken ? loc.startCol : loc.endCol,
                endOffset: beforeToken ? loc.startOffset : loc.endOffset,
            })
        );
    }
);
