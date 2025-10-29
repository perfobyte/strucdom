export default (
    function(node, isTop) {
        var
            current = null,
            currentTagId = 0,
            openElements = null, // this.openElements
            fragmentContext = null,

            openElements_current = null
        ;
        return (
            (this.options.sourceCodeLocationInfo)
            &&
            (
                this.set_end_location(node, this.currentToken)
            ),

            (
                openElements_current =
                    (openElements = this.openElements)
                    .current
            ),
            this.on_pop?.(node, openElements_current),

            (isTop)
            &&
            (
                (
                    ((openElements.stackTop) === 0)
                    &&
                    (fragmentContext = this.fragmentContext)
                )
                ? (
                    (current = fragmentContext),
                    (currentTagId = this.fragmentContextID)
                )
                : (
                    (current = openElements_current),
                    (currentTagId = openElements.currentTagId)
                ),
                
                this.set_context_modes(current, currentTagId)
            ),
            this
        );
    }
);
