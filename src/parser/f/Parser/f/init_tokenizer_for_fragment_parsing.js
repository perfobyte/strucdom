

export default (
    function() {
        var
            fragmentContext = this.fragmentContext,
            tokenizer = this.tokenizer,
            TokenizerMode = this.TokenizerMode,

            HTML = this.NS.HTML,
            _ = this.TAG_ID,
            
            i = 0
        ;
        return (
            (
                (!fragmentContext)
                ||
                ((fragmentContext.namespaceURI) !== HTML)
            )
            ||
            (
                tokenizer.state = (
                    (
                        (
                            (i = this.fragmentContextID) === _.TITLE
                        )
                        ||
                        (i === _.TEXTAREA)
                    )
                    ? TokenizerMode.RCDATA
                    :
                    (
                        (i === _.STYLE)
                        ||
                        (i === _.XMP)
                        ||
                        (i === _.IFRAME)
                        ||
                        (i === _.NOEMBED)
                        ||
                        (i === _.NOFRAMES)
                        ||
                        (i === _.NOSCRIPT)
                    )
                    ? TokenizerMode.RAWTEXT
                    :
                    (i === _.SCRIPT)
                    ? TokenizerMode.SCRIPT_DATA
                    :
                    (i === _.PLAINTEXT)
                    ? TokenizerMode.PLAINTEXT
                    : tokenizer.state
                )
            ),
            this
        );
    }
)